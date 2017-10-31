#!/bin/bash

set -e

HOST=yuca.yunity.org

BRANCH=$CIRCLE_BRANCH

if [ -z "$BRANCH" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

echo "deploying branch [$BRANCH] to [$HOST]"

scp deploy/deploy-systemd.sh deploy@$HOST:deploy-systemd.sh
ssh deploy@$HOST ./deploy-systemd.sh "$BRANCH"
