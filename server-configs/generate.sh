#!/bin/bash

set -e

names="foodsaving-world foodsaving-world-dev foodsaving-world-channels"

dest=out

for name in $names; do
    if [ ! -f "$name.json" ]; then
        echo "missing $name.json config"
        exit 1
    fi
done

mkdir -p "$dest"

for name in $names; do
    echo "generating configs for $name"

    if [ -d "$name" ]; then
        rm -r "$dest/$name"
    fi

    # nginx
    #----------------------------

    mkdir -p "$dest/$name/nginx"

    jinja2 templates/nginx.conf.j2 \
        "$name.json" --format json \
        > "$dest/$name/nginx/$name"

    # systemd services
    #----------------------------

    mkdir -p "$dest/$name/systemd"

    # daphne service

    jinja2 templates/daphne.service.j2 \
        "$name.json" --format json \
        > "$dest/$name/systemd/$name-daphne.service"

    # worker target

    jinja2 templates/worker.target.j2 \
        "$name.json" --format json \
        > "$dest/$name/systemd/$name-worker.target"

    # worker service

    jinja2 templates/worker@.service.j2 \
        "$name.json" --format json \
        > "$dest/$name/systemd/$name-worker@.service"

done