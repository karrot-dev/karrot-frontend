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

dev_deployment_branch="quasar"

if [ "$REF" == "$dev_deployment_branch" ]; then
  if [ ! -z "$SLACK_WEBHOOK_URL" ]; then

    payload=$(printf '{
      "channel": "#karrot-git",
        "username": "deploy",
        "text": "Successful deploy of *karrot-dev* from %s",
        "icon_emoji": ":sparkles:",
        "attachments": [
          {
            "title": "karrot-dev.foodsaving.world",
            "title_link": "https://karrot-dev.foodsaving.world"
          },
          {
            "title": "karrot-storybook-dev.foodsaving.world",
            "title_link": "https://karrot-storybook-dev.foodsaving.world"
          }
        ]
      }' "$dev_deployment_branch")

    curl -X POST --data-urlencode "payload=$payload" "$SLACK_WEBHOOK_URL"

  fi
fi
