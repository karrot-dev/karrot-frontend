[![Stories in "Tasking"](https://badge.waffle.io/yunity/yunity.svg?label=%5Bkanban%5D%20tasking&title=Tasking)](https://waffle.io/yunity/yunity)
[![Stories in "Next"](https://badge.waffle.io/yunity/yunity.svg?label=%5Bkanban%5D%20next&title=Next)](https://waffle.io/yunity/yunity)
[![Stories in "In Progress"](https://badge.waffle.io/yunity/yunity.svg?label=%5Bkanban%5D%20in-progress&title=In%20Progress)](https://waffle.io/yunity/yunity)

# yunity-core

## Getting started
For a quick startup, please checkout the [yunity-setup Repo](https://github.com/yunity/yunity-setup).

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
See the yunity-setup repository [![yunity-setup repository](https://github.com/yunity/yunity-setup)] for a complete local environment that also includes a swagger release.

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
We follow PEP8 with the same rules as the [Django project](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/).
As always, the coding style may not apply at some parts.
You can execute `flake8` in the repository root to check your code.

Code will only be accepted into `master` if it passes the PEP8 test.

## Using the API
A live instance of yunity is running at https://dev.yunity.org. The database will be emptied regularly, any data may be available to the public. Use at your own risk for testing.
Use https://dev.yunity.org/api/ for a browseable API and for API requests.
A session is identified via the sessionid cookie. Additionally, a csrftoken cookie is set with each POST request (initially for the login). To issue any other POST request than a login, you need to provide the contents of the csrftoken cookie in the X-CSRFToken header field. The session cookie is automatically appended to each request by the browser.
For more detailled notes on how to implement this in javascript, see https://docs.djangoproject.com/en/1.9/ref/csrf/
