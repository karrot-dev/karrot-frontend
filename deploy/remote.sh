#!/bin/bash

set -e

BRANCH=$1
backend_dir=foodsaving-backend

if [ "x$BRANCH" = "x" ]; then
  echo "Please pass branch to deploy as first argument"
  exit 1
fi

deploy_dir=$(pwd)

# expects that project is cloned into backend directory
# manually: git clone https://github.com/yunity/foodsaving-backend.git ${backend_dir}

# expects that virtualenv is set up
# manually: virtualenv --python=python3 --no-site-packages ${backend_dir}/env

# expects ./config/local_settings.py to exist
# use local_settings.py.example as template

(
  cd ${backend_dir} && \
  git clean -fd && \
  git checkout $BRANCH && \
  git pull && \
  env/bin/pip install -r requirements.txt && \
  env/bin/python manage.py migrate --fake-initial && \
  env/bin/python manage.py check --deploy && \
  env/bin/python manage.py collectstatic --clear --no-input && \
  env/bin/python manage.py compilemessages
)

touch /tmp/fstool.reload
