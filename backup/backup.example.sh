#!/usr/bin/env bash

# settings
dbname=fstool
filename=foodsaving-$(date -I).db.enc
testdb=fstool_test_backup_$(date -I)

# dump database and encrypt
pg_dump -Fc $dbname | gpg --batch --no-tty --quiet -e -r #your GPG key id# > $filename && \
echo dumped into $filename && \
# check if it decrypts and imports into new database
createdb $testdb && \
gpg --batch --no-tty --quiet -d $filename | pg_restore -d $testdb && \
dropdb $testdb && \
echo checked decrypting and import into $testdb

# copy to offsite
rsync -avz $filename #offsite location#:backup/ && \
echo copied to offsite location
