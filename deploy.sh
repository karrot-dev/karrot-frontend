#!/bin/bash

set -x
set -e

echo "------------------------------------"
env
echo "------------------------------------"

scp deploy/remote.sh deploy@yuca.yunity.org:
ssh deploy@yuca.yunity.org sh deploy.remote.sh
