#!/bin/bash

set -e

BRANCH=$1

if [ "x$BRANCH" = "x" ]; then
  echo "Please pass branch to deploy as first argument"
  exit 1
fi

if [ ! -d yunity-core ]; then
  git clone https://github.com/yunity/yunity-core.git
fi

if [ ! -d yunity-core/env ]; then
  virtualenv --python=python3 --no-site-packages yunity-core/env
fi

cat <<-CONFIG > yunity-core/config/local_settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'yunity-dev',
        'USER': 'yunity-dev',
        'PASSWORD': 'yunity',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}
DEBUG = False
ALLOWED_HOSTS = ['dev.yunity.org']
CONFIG

dropdb --if-exists yunity-dev
createdb yunity-dev

(
  cd yunity-core && \
  git clean -fd && \
  git checkout $BRANCH && \
  git pull && \
  env/bin/pip install -r requirements.txt && \
  env/bin/python manage.py remakeallmigrations && \
  env/bin/python manage.py migrate && \
  env/bin/python manage.py check --deploy
)
