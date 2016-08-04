#!/bin/bash

set -e

HOST=yuca.yunity.org

echo "sending [dist] to [$HOST]"

rsync -av --delete dist/ deploy@$HOST:public-angular/
