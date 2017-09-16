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

    URL="https://karrot-dev.foodsaving.world"
    STORYBOOK_URL="https://karrot-storybook-dev.foodsaving.world"

    REPO_URL="https://github.com/yunity/karrot-frontend"
    REF_URL="$REPO_URL/tree/$REF"
    COMMIT_URL="$REPO_URL/tree/$CIRCLE_SHA1"
    SHORT_SHA=$(git rev-parse --short HEAD)
    COMMIT_MESSAGE=$(git log -1 --pretty=%s)

    ATTACHMENT_TEXT=":banana: <$URL|Visit the site>\n:books: <$STORYBOOK_URL|Visit the storybook>"
    ATTACHMENT_FOOTER="Using git ref <$REF_URL|$REF>, commit <$COMMIT_URL|$SHORT_SHA> - $COMMIT_MESSAGE"

    payload=$(printf '{
        "channel": "#karrot-git",
        "username": "deploy",
        "text": ":sparkles: Successful deploy of *karrot-dev*",
        "attachments": [
          {
            "text": "%s",
            "footer": "%s"
          }
        ]
      }' "$ATTACHMENT_TEXT" "$ATTACHMENT_FOOTER")

    curl -X POST --data-urlencode "payload=$payload" "$SLACK_WEBHOOK_URL"

  fi
fi
