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
server {
    listen 80;
    server_name dev.yunity.org;
    location / {
        include         uwsgi_params;
        uwsgi_pass      unix:/tmp/yunity-dev.sock;
    }
}

```

symlink it to sites-enabled:

```
cd /etc/nginx/sites-enabled
ln -s ../sites-available/yunity-dev .
```
