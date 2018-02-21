#!/bin/bash

set -e

HOST=yuca.yunity.org

APK=$1
DIR=$2

if [ -z "$APK" ] || [ -z "$DIR" ]; then
  echo "Usage: <apk> <dir>"
  exit 1
fi

REPO_URL="https://github.com/yunity/karrot-frontend"
COMMIT_SHA=$(git rev-parse HEAD)
COMMIT_SHA_SHORT=$(git rev-parse --short HEAD)

if [ "$DIR" == "release" ]; then

  # release

  DEPLOY_ENV="production"
  DEPLOY_EMOJI=":rocket:"
  URL="https://karrot.world/app.apk"

elif [ "$REF" == "master" ]; then

  # dev

  DEPLOY_ENV="development"
  DEPLOY_EMOJI=":beer:"
  URL="https://dev.karrot.world/app.apk"

else

  # nothing

  exit 0

fi

REF_URL="$REPO_URL/tree/$REF"
COMMIT_URL="$REPO_URL/tree/$COMMIT_SHA"

ssh-keyscan -H $HOST >> ~/.ssh/known_hosts

echo "deploying app [$APK] to [$HOST] in [$DIR] dir"

rsync -avz ~/android-dev.apk "deploy@$HOST:karrot-app/$DIR/app.apk"

if [ ! -z "$SLACK_WEBHOOK_URL" ]; then

  COMMIT_MESSAGE=$(git log -1 --pretty="%s - %an")

  ATTACHMENT_TEXT=""

  ATTACHMENT_TEXT+=":android: <$URL|Download the app>"

  ATTACHMENT_FOOTER="Using git ref <$REF_URL|$REF>, commit <$COMMIT_URL|$COMMIT_SHA_SHORT> - $COMMIT_MESSAGE"

  payload=$(printf '{
      "channel": "#karrot-git",
      "username": "deploy",
      "text": ":sparkles: Successful deployment of :karrot: *karrot* app to _%s_ %s",
      "attachments": [
        {
          "text": "%s",
          "footer": "%s"
        }
      ]
    }' "$DEPLOY_ENV" "$DEPLOY_EMOJI" "$ATTACHMENT_TEXT" "$ATTACHMENT_FOOTER")

  curl -X POST --data-urlencode "payload=$payload" "$SLACK_WEBHOOK_URL"

fi
