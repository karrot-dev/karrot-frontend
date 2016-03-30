[![Stories in "Tasking"](https://badge.waffle.io/yunity/yunity.svg?label=%5Bkanban%5D%20tasking&title=Tasking)](https://waffle.io/yunity/yunity)
[![Stories in "Next"](https://badge.waffle.io/yunity/yunity.svg?label=%5Bkanban%5D%20next&title=Next)](https://waffle.io/yunity/yunity)
[![Stories in "In Progress"](https://badge.waffle.io/yunity/yunity.svg?label=%5Bkanban%5D%20in-progress&title=In%20Progress)](https://waffle.io/yunity/yunity)

# yunity-core

## Getting started
For a very quick startup, please checkout the [yunity-setup Repo](https://github.com/yunity/yunity-setup).
If you want to only install the backend, please have a look into the setup repo for the dependencies and configuration.

## Create the environment manually
- git clone git@github.com:yunity/yunity-core.git ~/yunity-core
- mkdir -p ~/virtualenvs/env
- virtualenv --python=python3 --no-site-packages ~/yunity-core/env
- source ~/yunity-core/env/bin/activate
- pip install -r ~/yunity-core/requirements.txt

### Configure database access
Add the connection parameters to your local Postgres database server to `wuppdays/local_settings.py`.

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'yunity-database',
        'USER': 'yunity-user',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}
```

If you get a "virtual memory error" with any of the postgres commands, close PyCharm and re-issue your command.

## IDE
We use PyCharm for development. The open source free professional licences are still pending, for now use the community edition from https://www.jetbrains.com/pycharm/download/.

Archlinux users may install pycharm-community from the aur.

Please set the python interpreter to the virtual env python created during during the setup.

### Vim

For all those who love Vim, just enable syntax checking and add python and django plugins to Vim. Follow [using vim with django](https://code.djangoproject.com/wiki/UsingVimWithDjango).

## Django quick introduction
Before using any tools from the shell, you need to activate the virtualenv:

```sh
source ./env/bin/activate
```

The manage.py application can be used to perform administrative tasks:

  - makemigrations: Create database migrations
  - migrate: Apply database migrations
  - remakeallmigrations: Remove and recreate all migrations
  - shell\_plus: (requires ipython) for playing in a django python environment
  - test: Run automated tests

## Architecture

### Data model
Currently, the data model is subject to change. When the backend reaches the beta stage, an ER-diagram could be put here.

## API Documentation
A swagger description file is generated at /doc. You can pass it to any swagger installation.

### Install swagger locally
See the yunity-setup repository [![yunity-setup repository](https://https://github.com/yunity/yunity-setup)] for a complete local environment that also includes a swagger release.

## Django application settings
In development, you can add and override local settings in
`wuppdays/local_settings.py`, which is present in `.gitignore` and hence out of
version control. If the file is not present, i.e. in production, nothing
happens.

## Update requirement packages
pip-tools is used to manage requirements. To use the latest possible requirements, do:

- pip install pip-tools
- pip-compile --upgrade

Use pip-compile --upgrade -p to include prereleases.

## Contributing to yunity-core
To contribute, please get in contact with us. We want to follow a pull request / code review cycle as soon as possible but in our early design stages we prefer to work in teams at the same desk.
We use

- github issues for development tasks (try waffle.io for a nice view on it)
- [slack](https://yunity.slack.com) as team communication, not only for development

### Coding guidelines
We follow the pep8 with disabled whitespace checks and a wider maximum line length of 120 characters.
As always, the coding style may not apply at some parts.
You can execute yunity/management/scripts/git-hooks/pep8-check in the repository root.
