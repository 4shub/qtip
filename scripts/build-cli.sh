#!/bin/bash
#npm i

#npm run build:web

rm -rf dist/qtip*
rm -rf build/cli

mkdir -p build/cli/qtip_cli

cp -r src/qtip_cli/* build/cli/qtip_cli
mv build/cli/qtip_cli/setup.py build/cli
mv build/cli/qtip_cli/MANIFEST.in build/cli
(cd build/cli && python setup.py sdist bdist_wheel)

cp -r build/cli/dist/* dist
