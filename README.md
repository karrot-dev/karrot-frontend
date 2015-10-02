[![Stories in "Tasking"](https://badge.waffle.io/yunity/yunity-core.svg?label=%5Bkanban%5D%20tasking&title=Tasking)](https://waffle.io/yunity/yunity-core)
[![Stories in "Next"](https://badge.waffle.io/yunity/yunity-core.svg?label=%5Bkanban%5D%20next&title=Next)](https://waffle.io/yunity/yunity-core)
[![Stories in "In Progress"](https://badge.waffle.io/yunity/yunity-core.svg?label=%5Bkanban%5D%20in-progress&title=In%20Progress)](https://waffle.io/yunity/yunity-core)

# yunity-core

## Getting started

### Install system dependencies
- Python: python3 python3-devel python-virtualenv
- Databases: postgresql redis [elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/1.4/setup-repositories.html)
- Real-time: gcc libffi-devel python-devel openssl-devel
- Push-hooks: vlc

### Install Pycharm
- wget https://download.jetbrains.com/python/pycharm-professional-4.5.4.tar.gz
- tar xf pycharm-professional-4.5.4.tar.gz
- ./pycharm-4.5.4/bin/pycharm.sh

### Create the environment
- git clone git@github.com:yunity/yunity-core.git ~/yunity-core
- mkdir -p ~/virtualenvs/yunity-core
- virtualenv --python=python3 --no-site-packages ~/virtualenvs/yunity-core
- source ~/virtualenvs/yunity-core/bin/activate
- pip install -r ~/yunity-core/requirements.pip
- To push a git commit image, decide between VLC or fswebcam:
  - ln -rs scripts/git-hooks/picture-vlc .git/hooks/pre-push
  - ln -rs scripts/git-hooks/picture-fswebcam .git/hooks/pre-push

### Start the servers
- Start Elasticsearch: sudo /etc/init.d/elasticsearch start
- Start Crossbar: cd ~/yunity-core; crossbar start
- Start Redis: redis-server

If you get "low disk watermark" errors from ElasticSearch, create a config .yml file (e.g. `~/.elasticsearch.yml`) with
the following contents:

```yml
cluster:
    routing:
      allocation:
        disk:
          threshold_enabled: false
```

Then invoke the server like so: `elasticsearch -Des.config="~/.elasticsearch.yml"``

If you need to modify the crossbar ip/port settings, you may copy the .crossbar/config.json to a local .crossbar/config_local.json and run

- crossbar start --config config_server.json

(the .crossbar path is automatically prepended)

### Run the project
- charm ~/yunity-core
- Set the project interpreter to ~/virtualenvs/yunity-core/bin/python
- Run yunity-core (Shift+F10)

## Architecture

### Data model

[![ER diagram](documentation/yunity-schema.png)](documentation/yunity-schema.xml)

## Settings

In development, you can add and override local settings in
`wuppdays/local_settings.py`, which is present in `.gitignore` and hence out of
version control. If the file is not present, i.e. in production, nothing
happens.

### Database Connection

Add the connection to your local Postgres database server to `wuppdays/local_settings.py`.

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydatabase',
        'USER': 'mydatabaseuser',
        'PASSWORD': 'mypassword',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}
```
