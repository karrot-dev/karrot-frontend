#!/bin/bash

set -e

HOST=yuca.yunity.org

REF=$1
DIR=$2

if [ -z "$REF" ] || [ -z "$DIR" ]; then
  echo "Usage: <ref> <dir>"
  exit 1
fi

ISO_DATE=$(date -Idate)
REPO_URL="https://github.com/yunity/karrot-frontend"
COMMIT_SHA=$(git rev-parse HEAD)
COMMIT_SHA_SHORT=$(git rev-parse --short HEAD)

if [ "$DIR" == "release" ]; then

  # release

  DEPLOY_ENV="production"
  DEPLOY_EMOJI=":rocket:"
  URL="https://karrot.world"
  APK_URL="https://karrot.world/app.apk"

elif [ "$REF" == "master" ]; then

  # dev

  DEPLOY_ENV="development"
  DEPLOY_EMOJI=":beer:"
  URL="https://dev.karrot.world"
  APK_URL="https://dev.karrot.world/app.apk"
  STORYBOOK_URL="https://storybook.karrot.world"
  DEPLOY_DOCS="true"

else

  # nothing

  exit 0

fi


REF_URL="$REPO_URL/tree/$REF"
COMMIT_URL="$REPO_URL/tree/$COMMIT_SHA"

mkdir -p ~/.ssh
ssh-keyscan -H $HOST >> ~/.ssh/known_hosts

echo "deploying frontend branch [$REF] to [$HOST] in [$DIR] dir"

about_json=$(printf '{
    "commitSHA": "%s",
    "commitSHAShort": "%s",
    "ref": "%s",
    "env": "%s",
    "apkUrl": "%s",
    "date": "%s"
  }' "$COMMIT_SHA" "$COMMIT_SHA_SHORT" "$REF" "$DEPLOY_ENV" "$APK_URL" "$ISO_DATE")

echo "$about_json" > dist/about.json
echo "$about_json" > storybook-static/about.json

# send it all to the host
rsync -avz --delete dist/ "deploy@$HOST:karrot-frontend/$DIR/"
rsync -avz --delete storybook-static/ "deploy@$HOST:karrot-frontend-storybook/$DIR/"

if [ "$DEPLOY_DOCS" == "true" ] && [ -d docs-dist/gitbook ]; then
  rsync -avz --delete docs-dist/ "deploy@$HOST:karrot-docs/$DIR/"
fi

if [ ! -z "$SLACK_WEBHOOK_URL" ]; then

  WEBPACK_URL="$URL/bundlesize.html"
  CIRCLE_WORKFLOW_URL="https://circleci.com/gh/yunity/workflows/karrot-frontend/tree/$REF"

  COMMIT_MESSAGE=$(git log -1 --pretty="%s - %an")

  ATTACHMENT_TEXT=""

  ATTACHMENT_TEXT+=":karrot: <$URL|Visit the site>"

  if [ ! -z "$STORYBOOK_URL" ]; then
    ATTACHMENT_TEXT+="\n:books: <$STORYBOOK_URL|Visit the storybook>"
  fi

  ATTACHMENT_TEXT+="\n:webpack: <$WEBPACK_URL|Visit the webpack bundle analyzer>"
  ATTACHMENT_TEXT+="\n:circleci: <$CIRCLE_WORKFLOW_URL|Visit CircleCI>"

  if [ "$DEPLOY_DOCS" == "true" ] && [ -d docs-dist ]; then
    DOCBOOK_URL="https://docs.karrot.world"
    ATTACHMENT_TEXT+="\n:page_facing_up: <$DOCBOOK_URL|View docs>"
  fi

  ATTACHMENT_FOOTER="Using git ref <$REF_URL|$REF>, commit <$COMMIT_URL|$COMMIT_SHA_SHORT> - $COMMIT_MESSAGE"

  payload=$(printf '{
      "channel": "#karrot-git",
      "username": "deploy",
      "text": ":sparkles: Successful deployment of :karrot: *karrot* to _%s_ %s",
      "attachments": [
        {
          "text": "%s",
          "footer": "%s"
        }
      ]
    }' "$DEPLOY_ENV" "$DEPLOY_EMOJI" "$ATTACHMENT_TEXT" "$ATTACHMENT_FOOTER")

  curl -X POST --data-urlencode "payload=$payload" "$SLACK_WEBHOOK_URL"

fi
