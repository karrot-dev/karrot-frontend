#!/bin/bash

set -e

HOST=yuca.yunity.org
DIR=release

if [ "x$CIRCLE_TAG" = "x" ]; then
  echo "Error! CIRCLE_TAG was not set"
  exit 1
fi

echo "deploying frontend branch [$CIRCLE_TAG] to [$HOST] in [$DIR] dir"

# write the release version into "version" file
echo $CIRCLE_TAG > dist/version

# create a downloadable archive too
(cd dist && tar czf ../archive.tar.gz *)

# send it all to the host
rsync -avz --delete dist/ deploy@$HOST:foodsaving-frontend/$DIR/

