#!/bin/bash

set -e

name=$1

if [ -z "$name" ]; then
  echo "Please pass name to deploy as first argument"
  exit 1
fi

echo "deploying branch [$name]"

git clone https://github.com/yunity/yuca yuca

export ANSIBLE_HOST_KEY_CHECKING=False
ansible-playbook -i yuca/inventory -u "$name"-deploy --become-user "$name"-deploy yuca/playbooks/"$name"/deploy.playbook.yml
