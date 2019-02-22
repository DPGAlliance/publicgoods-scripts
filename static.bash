#!/bin/bash
wget --no-host-directories --recursive --page-requisites --no-parent --timestamping -P static http://localhost:8000
pushd static
if [[ "$OSTYPE" == "darwin"* ]]; then
	echo 'Detected OSX...'
	find . -name '*.html' -exec sed -i '' -e 's_http://localhost:8000/_/_g' {} \;
	find . -name '*.html' -exec sed -i '' -e 's_http:\\/\\/localhost:8000\\/_\\/_g' {} \;
else
	echo 'Detected non-OSX...'
	find . -name '*.html' -exec sed -i -e 's_http://localhost:8000/_/_g' {} \;
	find . -name '*.html' -exec sed -i -e 's_http:\\/\\/localhost:8000\\/_\\/_g' {} \;
fi
rm -rf comments feed wp-json xmlrpc.php\?rsd 
popd
cp -a static/* ../publicgoods-website
rm -rf static
