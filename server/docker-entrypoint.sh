#!/bin/sh

echo "Waiting for Postgres to start..."
./wait-for-postgres.sh db:5432

yarn build && yarn start