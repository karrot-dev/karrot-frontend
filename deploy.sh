#!/bin/bash

set -eu

HOST="yuca.yunity.org"

TYPE="$1"
REF="${2:-master}"

# optionally available from the environment
ROCKETCHAT_WEBHOOK_URL="${ROCKETCHAT_WEBHOOK_URL:-}"

if [ -z "$REF" ]; then
  echo "Usage: <type(release|dev|branch)> [<ref>]"
  exit 1
fi

# initialize some variables
STORYBOOK_URL=
APK_URL=
DEPLOY_DOCS="false"
DEPLOY_SITE=
DEPLOY_VARIANT=
BUNDLE_FILENAME_BASE="karrot-frontend"
STORYBOOK_BUNDLE_FILENAME_BASE=
DOCS_BUNDLE_FILENAME_BASE=

if [ "$TYPE" == "release" ]; then

  # release

  DIR="release"
  DEPLOY_ENV="production"
  DEPLOY_SITE="karrot-world"
  DEPLOY_VARIANT="production"
  DEPLOY_EMOJI=":rocket:"
  URL="https://karrot.world"
  APK_URL="https://karrot.world/app.apk"
  BUNDLE_FILENAME_BASE="$BUNDLE_FILENAME_BASE-$DEPLOY_VARIANT"

elif [ "$TYPE" == "dev" ]; then

  # dev

  if [ "$REF" != "master" ]; then
    # technically we could deploy other branches
    # but the dir name is setup to be "master"
    echo "Error: dev deployment must be of master branch"
    echo "(it could be implemented that you can deploy other branches, but is not right now)"
    exit 1
  fi

  DIR="master"
  DEPLOY_ENV="development"
  DEPLOY_SITE="karrot-dev"
  DEPLOY_VARIANT="dev"
  DEPLOY_EMOJI=":beer:"
  URL="https://dev.karrot.world"
  APK_URL="https://dev.karrot.world/app.apk"
  BUNDLE_FILENAME_BASE="$BUNDLE_FILENAME_BASE-$DEPLOY_VARIANT"
  STORYBOOK_URL="https://storybook.karrot.world"
  STORYBOOK_BUNDLE_FILENAME_BASE="$BUNDLE_FILENAME_BASE-storybook"
  DEPLOY_DOCS="true"
  DOCS_BUNDLE_FILENAME_BASE="$BUNDLE_FILENAME_BASE-docs"

elif [ "$TYPE" == "branch" ]; then

  if [ -z "$REF" ]; then
    echo "Error: you must specify ref for branch releases"
    echo "Usage: <type(release|dev|branch)> [<ref>]"
    exit 1
  fi

  # branch deployment

  SAFE_REF="$(echo -n "$REF" | tr -c '[a-zA-Z0-9.]-' '-' | tr "[:upper:]" "[:lower:]")"
  SAFE_DIR="$(echo -n "$SAFE_REF" | replace '.' '-')" # ... also without dots
  DIR="branches/$SAFE_DIR"
  DEPLOY_ENV="branch/$REF"
  DEPLOY_SITE="karrot-dev"
  DEPLOY_VARIANT="branch-$SAFE_REF"
  DEPLOY_EMOJI=":construction_worker:"
  URL="https://$SAFE_DIR.dev.karrot.world"
  DEPLOY_DOCS="false"
  BUNDLE_FILENAME_BASE="$BUNDLE_FILENAME_BASE-$DEPLOY_VARIANT"

else

  echo "Invalid type, must be one of release|dev|branch"
  exit 1

fi

ISO_DATE=$(date -Idate)
REPO_URL="https://github.com/yunity/karrot-frontend"
COMMIT_SHA=$(git rev-parse HEAD)
COMMIT_SHA_SHORT=$(git rev-parse --short HEAD)
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

echo "$about_json" > dist/pwa/about.json

# send it all to the host
rsync -avz --delete dist/pwa/ "deploy@$HOST:karrot-frontend/$DIR/"

# build a zipped version for next-gen deployment method :)
ZIP_FILENAME="$BUNDLE_FILENAME_BASE.zip"
(cd dist/pwa && zip -r "../../$ZIP_FILENAME" .)
rsync -avz "$ZIP_FILENAME" "karrot-download@$HOST:www/"

if [ ! -z "$STORYBOOK_URL" ]; then
  echo "$about_json" > storybook-static/about.json
  rsync -avz --delete storybook-static/ "deploy@$HOST:karrot-frontend-storybook/$DIR/"
  if [ ! -z "$STORYBOOK_BUNDLE_FILENAME_BASE" ]; then
    STORYBOOK_ZIP_FILENAME="$STORYBOOK_BUNDLE_FILENAME_BASE.zip"
    (cd storybook-static && zip -r "../$STORYBOOK_ZIP_FILENAME" .)
    rsync -avz "$STORYBOOK_ZIP_FILENAME" "karrot-download@$HOST:www/"
  fi
fi

if [ "$DEPLOY_DOCS" == "true" ] && [ -d docs-dist/gitbook ]; then
  rsync -avz --delete docs-dist/ "deploy@$HOST:karrot-docs/$DIR/"
  if [ ! -z "$DOCS_BUNDLE_FILENAME_BASE" ]; then
    DOCS_ZIP_FILENAME="$DOCS_BUNDLE_FILENAME_BASE.zip"
    (cd docs-dist && zip -r "../$DOCS_ZIP_FILENAME" .)
    rsync -avz "$DOCS_ZIP_FILENAME" "karrot-download@$HOST:www/"
  fi
fi

DEPLOY_USER="$DEPLOY_SITE-deploy"
git clone https://github.com/yunity/yuca yuca
export ANSIBLE_HOST_KEY_CHECKING=False
(
  cd yuca && \
  ansible-galaxy install -r galaxy-requirements.yml && \
  ANSIBLE_CONFIG="ansible.ci.cfg" \
  ansible-playbook \
    -u "$DEPLOY_USER" \
    --become-user "$DEPLOY_USER" \
    "playbooks/$DEPLOY_SITE/deploy-frontend.playbook.yml" \
    --extra-vars "karrot_frontend__variant=$DEPLOY_VARIANT"
)

if [ ! -z "$ROCKETCHAT_WEBHOOK_URL" ]; then

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
      "channel": "#ci",
      "username": "deploy",
      "text": ":sparkles: Successful deployment of :karrot: *karrot* to _%s_ %s",
      "attachments": [
        {
          "text": "%s",
          "footer": "%s"
        }
      ]
    }' "$DEPLOY_ENV" "$DEPLOY_EMOJI" "$ATTACHMENT_TEXT" "$ATTACHMENT_FOOTER")

  curl -X POST --data-urlencode "payload=$payload" "$ROCKETCHAT_WEBHOOK_URL"

fi
