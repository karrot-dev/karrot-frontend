#!/bin/bash

set -e

HOST=yuca.yunity.org

REF=$1
DIR=$2

if [ -z "$REF" ] || [ -z "$DIR" ]; then
  echo "Usage: <ref> <dir>"
  exit 1
fi

REPO_URL="https://github.com/yunity/karrot-frontend"
COMMIT_SHA=$(git rev-parse HEAD)
COMMIT_SHA_SHORT=$(git rev-parse --short HEAD)

if [ "$DIR" == "release" ]; then

  # release

  DEPLOY_ENV="production"
  URL="https://alpha.foodsaving.world"

elif [ "$REF" == "master" ]; then

  # dev

  DEPLOY_ENV="development"
  URL="https://karrot-dev.foodsaving.world"
  STORYBOOK_URL="https://karrot-storybook-dev.foodsaving.world"

else

  # nothing

  exit 0

fi


REF_URL="$REPO_URL/tree/$REF"
COMMIT_URL="$REPO_URL/tree/$COMMIT_SHA"

ssh-keyscan -H $HOST >> ~/.ssh/known_hosts

echo "deploying frontend branch [$REF] to [$HOST] in [$DIR] dir"

about_json=$(printf '{
    "commitSHA": "%s",
    "commitSHAShort": "%s",
    "ref": "%s",
    "env": "%s"
  }' "$COMMIT_SHA" "$COMMIT_SHA_SHORT" "$REF" "$DEPLOY_ENV")

echo "$about_json" > dist/about.json
echo "$about_json" > storybook-static/about.json

# send it all to the host
rsync -avz --delete dist/ "deploy@$HOST:karrot-frontend/$DIR/"
rsync -avz --delete storybook-static/ "deploy@$HOST:karrot-frontend-storybook/$DIR/"

if [ ! -z "$SLACK_WEBHOOK_URL" ]; then

  WEBPACK_URL="$URL/bundlesize.html"

  COMMIT_MESSAGE=$(git log -1 --pretty="%s - %an")

  ATTACHMENT_TEXT=""

  ATTACHMENT_TEXT+=":karrot: <$URL|Visit the site>"

  if [ ! -z "$STORYBOOK_URL" ]; then
    ATTACHMENT_TEXT+="\n:books: <$STORYBOOK_URL|Visit the storybook>"
  fi

  ATTACHMENT_TEXT+=":webpack: <$WEBPACK_URL|Visit the webpack bundle analyzer>"

  ATTACHMENT_FOOTER="Using git ref <$REF_URL|$REF>, commit <$COMMIT_URL|$COMMIT_SHA_SHORT> - $COMMIT_MESSAGE"

  payload=$(printf '{
      "channel": "#karrot-git",
      "username": "deploy",
      "text": ":sparkles: Successful deployment of *karrot* to _%s_",
      "attachments": [
        {
          "text": "%s",
          "footer": "%s"
        }
      ]
    }' "$DEPLOY_ENV" "$ATTACHMENT_TEXT" "$ATTACHMENT_FOOTER")

  curl -X POST --data-urlencode "payload=$payload" "$SLACK_WEBHOOK_URL"

fi
