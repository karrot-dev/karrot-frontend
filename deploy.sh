#!/bin/bash

set -e

HOST=yuca.yunity.org

BRANCH=$CIRCLE_BRANCH

if [ "x$BRANCH" = "x" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

echo "deploying frontend branch [$BRANCH] to [$HOST]"

rsync -avz --delete dist/ deploy@$HOST:foodsaving-frontend/$BRANCH/
