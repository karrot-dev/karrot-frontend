#!/bin/sh

yarn upgrade
(
  cd cordova/playstoreHelper && \
  pip-compile --upgrade
)
(
  cd updateLocalesHelper && \
  pip-compile --upgrade
)
