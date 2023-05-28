#!/bin/sh
exec /opt/bitnami/scripts/nginx/entrypoint.sh "$@"
exit $?
