#!/bin/bash

set -e

name=$1

if [ -z "$name" ]; then
  echo "Please pass name to deploy as first argument"
  exit 1
fi

BRANCH=$CIRCLE_BRANCH

if [ -z "$BRANCH" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

echo "deploying branch [$BRANCH] to [$name]"

git clone https://github.com/yunity/yuca
pip install ansible

export ANSIBLE_HOST_KEY_CHECKING=False
ansible-playbook -i yuca/inventory -u "$name"-deploy --become-user "$name"-deploy ansible/playbooks/"$name"/deploy.playbook.yml -v
