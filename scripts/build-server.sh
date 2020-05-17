#!/bin/bash
npm i

# clean up
rimraf ./dist
rimraf ./public

# build
tsc

mkdir ./public

# scss
npm run sass
cp src/server/root/root.html ./dist/server/root/root.html

# build-web
npm run build:web
