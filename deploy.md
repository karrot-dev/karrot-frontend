to build pip dependencies:

```
sudo apt-get install postgresql-server-dev-9.4 python3-dev dev
```

Create db user with permissions:

```
createuser yunity-dev
sudo -u postgres psql
> alter user "yunity-dev" with password 'yunity';
> grant all privileges on database "yunity-dev" to "yunity-dev";
```

Give deploy user postgres permissions
in `/etc/postgresql/9.4/main/pg_hba.conf`:

```
local	all		deploy					peer
```

Add deploy user:

```
createuser deploy
sudo -u postgres psql
> alter user deploy createdb;
```

Setup uwsgi:

```
sudo apt-get install uwsgi uwsgi-plugin-python3
```

create /etc/uwsgi/apps-available/yunity-dev.ini

```
[uwsgi]
project = yunity-core
base = /home/deploy

chdir = %(base)/%(project)
home = %(base)/%(project)/env
module = config.wsgi:application

master = true
processes = 2

socket = /tmp/yunity-dev.sock

touch-reload = /tmp/yunity-dev.reload

chmod-socket = 664
vacuum = true

```

```
cd /etc/uwsgi/apps-enabled/
sudo ln -s ../apps-available/yunity-dev.ini
```

Create nginx config:

```
/etc/nginx/sites-available/yunity-dev
```

```
upstream websocket {
    server localhost:5090;
}

upstream django {
    server unix:/tmp/yunity-dev.sock;
}

map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {

    server_name dev.yunity.org;

    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate /var/www/yunity-dev/cert/fullchain.pem;
    ssl_certificate_key /var/www/yunity-dev/cert/key.pem;

    root /home/deploy/public;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        include uwsgi_params;
        uwsgi_pass django;

        uwsgi_param Host $host;
        uwsgi_param X-Real-IP $remote_addr;
        uwsgi_param X-Forwarded-For $proxy_add_x_forwarded_for;
        uwsgi_param X-Forwarded-Proto $http_x_forwarded_proto;
    }

    location /socket/ {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    } 

}

```

symlink it to sites-enabled:

```
cd /etc/nginx/sites-enabled
ln -s ../sites-available/yunity-dev .
```
