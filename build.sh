#!/usr/bin/env bash

npm ci || exit $?
npm run build || exit $?

echo "ordlabyrint.no" > dist/CNAME