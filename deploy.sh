#!/bin/bash

set -e

HOST=yuca.yunity.org

REF=$1
DIR=$2

if [ -z "$REF" ] || [ -z "$DIR" ]; then
  echo "Usage: <ref> <dir>"
  exit 1
fi

ssh-keyscan -H $HOST >> ~/.ssh/known_hosts

echo "deploying frontend branch [$REF] to [$HOST] in [$DIR] dir"

echo "$REF" > dist/version
echo "$REF" > storybook-static/version

# send it all to the host
rsync -avz --delete dist/ "deploy@$HOST:karrot-frontend/$DIR/"
rsync -avz --delete storybook-static/ "deploy@$HOST:karrot-frontend-storybook/$DIR/"
