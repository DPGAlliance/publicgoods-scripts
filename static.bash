#!/bin/bash
wget --no-host-directories --recursive --page-requisites --no-parent --timestamping -P static http://localhost:8000
pushd static
find . -name '*.html' -exec sed -i '' -e 's_http://localhost:8000/_/_g' {} \;
find . -name '*.html' -exec sed -i '' -e 's_http:\\/\\/localhost:8000\\/_\\/_g' {} \;
rm -rf comments feed wp-json xmlrpc.php\?rsd 
popd
cp -a static/* ../publicgoods-website
