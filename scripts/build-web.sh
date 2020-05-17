#!/bin/bash
mkdir -p src/qtip_cli/public

# build client
parcel build src/qtip_cli/actions/preview/preview.ts

# copy files around
cp dist/preview.js src/qtip_cli/public/preview.js
cp dist/preview.js public/root/preview.js
cp public/root/root.css src/qtip_cli/public/root.css
