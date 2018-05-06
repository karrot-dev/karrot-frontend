#!/bin/bash

set -e

HOST=yuca.yunity.org

REF=$1
APK=$2
DIR=$3

if [ -z "$REF" ] || [ -z "$APK" ] || [ -z "$DIR" ]; then
  echo "Usage: <ref> <apk> <dir>"
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

elif [ "$DIR" == "master" ]; then

  # dev

  DEPLOY_ENV="development"
  DEPLOY_EMOJI=":beer:"
  URL="https://dev.karrot.world/app.apk"

else

  # nothing

  echo "Not deploying [$APK] to [$DIR] as it has not been configured in deploy-android.sh"

  exit 1

fi

REF_URL="$REPO_URL/tree/$REF"
COMMIT_URL="$REPO_URL/tree/$COMMIT_SHA"

mkdir -p ~/.ssh
ssh-keyscan -H $HOST >> ~/.ssh/known_hosts

echo "deploying app [$APK] to [$HOST] in [$DIR] dir"

rsync -avz "$APK" "deploy@$HOST:karrot-app/$DIR/app.apk"

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
