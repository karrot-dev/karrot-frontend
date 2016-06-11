#!/bin/bash

set -e

HOST=yuca.yunity.org

BRANCH=$CIRCLE_BRANCH

if [ "x$BRANCH" = "x" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

echo "deploying branch [$BRANCH] to [$HOST]"

scp deploy/remote.sh deploy@$HOST:deploy.sh
ssh deploy@$HOST ./deploy.sh $BRANCH
