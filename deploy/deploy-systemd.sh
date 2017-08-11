#!/bin/bash

set -e

export LC_ALL=C.UTF-8
export LANG=C.UTF-8

BRANCH=$1
name=

if [ "x$BRANCH" = "x" ]; then
  echo "Please pass branch to deploy as first argument"
  exit 1
fi

if [ "x$BRANCH" = "xproduction" ]; then
  name=foodsaving-world
else
  name=foodsaving-world-dev
fi

function restart-workers() {
  sudo systemctl restart "${name}-worker.target"
}

backend_dir="/var/www/${name}/www"
virtualenv_dir="${backend_dir}/env"

# Ensure we have the git repo cloned

if [ ! -d "$backend_dir" ]; then
  mkdir -p "$backend_dir"
  (
    cd "$backend_dir" && \
    git clone https://github.com/yunity/foodsaving-backend.git .
  )
fi

# Ensure we have the virtualenv setup

if [ ! -d "$virtualenv_dir" ]; then
  virtualenv --no-setuptools --python=python3 --no-site-packages "$virtualenv_dir"
fi

# TODO: ensure ownership is "foodsaving-world" (or maybe "foodsaving-world-dev")

(
  cd ${backend_dir} && \
  git clean -fd && \
  git checkout "$BRANCH" && \
  git pull && \
  env/bin/pip install setuptools pip-tools && \
  env/bin/pip-sync && \
  env/bin/python manage.py check --deploy && \
  env/bin/python manage.py migrate && \
  env/bin/python manage.py collectstatic --clear --no-input && \
  env/bin/python manage.py compilemessages
)

echo "Restarting worker processes"

restart-workers
