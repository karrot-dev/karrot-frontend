#!/bin/bash

set -e

HOST=yuca.yunity.org

if [ ! -z "$CIRCLE_TAG" ]; then
  REF="${CIRCLE_TAG}"
  DIR="release"
elif [ ! -z "$CIRCLE_BRANCH" ]; then
  REF="${CIRCLE_BRANCH}"
  DIR="${CIRCLE_BRANCH}"
fi

if [ -z "$REF" ]; then
  echo "Error! CIRCLE_TAG/CIRCLE_BRANCH was not set"
  exit 1
fi

echo "deploying frontend branch [$REF] to [$HOST] in [$DIR] dir"

echo "$REF" > dist/version
echo "$REF" > storybook-static/version

# send it all to the host
rsync -avz --delete dist/ "deploy@$HOST:karrot-frontend/$DIR/"
rsync -avz --delete storybook-static/ "deploy@$HOST:karrot-frontend-storybook/$DIR/"
