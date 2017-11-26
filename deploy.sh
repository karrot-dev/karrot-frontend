#!/bin/bash

set -e

HOST=yuca.yunity.org

name=$1

if [ -z "$name" ]; then
  echo "Please pass name to deploy as first argument"
  exit 1
fi

BRANCH=$CIRCLE_BRANCH

if [ -z "$BRANCH" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

echo "deploying branch [$BRANCH] to [$name] on [$HOST]"

scp deploy/deploy-systemd.sh deploy@$HOST:deploy-systemd.sh
ssh deploy@$HOST ./deploy-systemd.sh "$name" "$BRANCH"
