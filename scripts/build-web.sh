#!/bin/bash
mkdir -p src/cli/public

# build client
parcel build src/cli/actions/preview/preview.ts

# copy files around
cp dist/preview.js src/cli/public/preview.js
cp dist/preview.js public/root/preview.js
cp public/root/root.css src/cli/public/root.css
