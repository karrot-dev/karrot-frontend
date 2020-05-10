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
  APK_URL="https://karrot.world/app.apk"
  PLAYSTORE_URL="https://play.google.com/store/apps/details?id=world.karrot"
  PACKAGE_NAME="world.karrot"

elif [ "$DIR" == "master" ]; then

  # dev

  DEPLOY_ENV="development"
  DEPLOY_EMOJI=":beer:"
  APK_URL="https://dev.karrot.world/app.apk"
  PLAYSTORE_URL="https://play.google.com/store/apps/details?id=world.karrot.dev"
  PACKAGE_NAME="world.karrot.dev"

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

# push apk to server
rsync -avz "$APK" "deploy@$HOST:karrot-app/$DIR/app.apk"

# publish in playstore
(
  APK_FILE="$(pwd)/$APK"
  cd cordova
  KEY="$CORDOVA_PLAYSTORE_SERVICEACCOUNT_KEY" PACKAGE_NAME="$PACKAGE_NAME" APK_FILE="$APK_FILE" ./publish_to_playstore
)

if [ -n "$ROCKETCHAT_WEBHOOK_URL" ]; then

  COMMIT_MESSAGE=$(git log -1 --pretty="%s - %an")

  ATTACHMENT_TEXT=""

  ATTACHMENT_TEXT+="- :android: Download <$PLAYSTORE_URL|from Play Store> or <$APK_URL|as APK>"

  ATTACHMENT_FOOTER="Using git ref <$REF_URL|$REF>, commit <$COMMIT_URL|$COMMIT_SHA_SHORT> - $COMMIT_MESSAGE"

  payload=$(printf '{
      "text": ":sparkles: Successful deployment of :karrot: *karrot* app to _%s_ %s\n%s\n_%s_"
    }' "$DEPLOY_ENV" "$DEPLOY_EMOJI" "$ATTACHMENT_TEXT" "$ATTACHMENT_FOOTER")

  curl -X POST --data-urlencode "payload=$payload" "$ROCKETCHAT_WEBHOOK_URL"

fi
