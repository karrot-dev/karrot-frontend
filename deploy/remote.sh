#!/bin/bash

set -e

BRANCH=$1

if [ "x$BRANCH" = "x" ]; then
  echo "Please pass branch to deploy as first argument"
  exit 1
fi

if [ ! -d foodsaving-backend ]; then
  git clone https://github.com/yunity/foodsaving-backend.git
fi

if [ ! -d foodsaving-backend/env ]; then
  virtualenv --python=python3 --no-site-packages foodsaving-backend/env
fi

deploy_dir=$(pwd)

cat <<-CONFIG > foodsaving-backend/config/local_settings.py
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
ALLOWED_HOSTS = ['dev.yunity.org', 'mvp-proposal.yunity.org']
STATIC_ROOT = '${deploy_dir}/foodsaving-backend/static/'
CONFIG

createdb yunity-dev || true

(
  cd foodsaving-backend && \
  git clean -fd && \
  git checkout $BRANCH && \
  git pull && \
  env/bin/pip install -r requirements.txt && \
  env/bin/python manage.py migrate --fake-initial && \
  env/bin/python manage.py check --deploy && \
  env/bin/python manage.py collectstatic --clear --no-input
)

touch /tmp/yunity-dev.reload
