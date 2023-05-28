#!/bin/sh

echo "Waiting for MongoDB to start..."
./wait-for db:5432

yarn build && yarn start