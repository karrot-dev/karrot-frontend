#!/bin/bash

set -e

BRANCH=$1
backend_dir=foodsaving-backend

if [ "x$BRANCH" = "x" ]; then
  echo "Please pass branch to deploy as first argument"
  exit 1
fi

if [ ! -d ${backend_dir} ]; then
  git clone https://github.com/yunity/foodsaving-backend.git ${backend_dir}
fi

if [ ! -d ${backend_dir}/env ]; then
  virtualenv --python=python3 --no-site-packages ${backend_dir}/env
fi

deploy_dir=$(pwd)

cat <<-CONFIG > ${backend_dir}/config/local_settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'fstool',
        'USER': 'fstool',
        'PASSWORD': 'fstool',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}
DEBUG = False
ALLOWED_HOSTS = ['fstool.yunity.org', 'mvp-proposal.yunity.org', 'mvp-design.yunity.org']
STATIC_ROOT = '${deploy_dir}/${backend_dir}/static/'
ANYMAIL = {
    "SPARKPOST_API_KEY": add your server key
}

DEFAULT_FROM_EMAIL = "fstool@yunity.org"
CONFIG

createdb fstool || true

(
  cd ${backend_dir} && \
  git clean -fd && \
  git checkout $BRANCH && \
  git pull && \
  env/bin/pip install -r requirements.txt && \
  env/bin/python manage.py migrate --fake-initial && \
  env/bin/python manage.py check --deploy && \
  env/bin/python manage.py collectstatic --clear --no-input
)

touch /tmp/fstool.reload
