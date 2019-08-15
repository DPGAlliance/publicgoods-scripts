#!/bin/bash

# source a static version of the site
wget --no-host-directories --recursive --page-requisites --no-parent --timestamping -P static http://localhost:8000

# cd into the folder
pushd static

# remove unneeded files
rm -rf comments feed wp-json xmlrpc.php\?rsd wp-login* wp-admin author index.html\?*

for file in $(find . -name "*\?*")
do
	echo $file
	mv $file $(echo $file | sed s/\?.*$//)
done

if [[ "$OSTYPE" == "darwin"* ]]; then
	echo 'Detected OSX...'
	find . -name '*.html' -exec sed -i '' -e 's_http://localhost:8000/_/_g' {} \;
	find . -name '*.html' -exec sed -i '' -e 's_http:\\/\\/localhost:8000\\/_\\/_g' {} \;
else
	echo 'Detected non-OSX...'
	find . -name '*.html' -exec sed -i -e 's_http://localhost:8000/_/_g' {} \;
	find . -name '*.html' -exec sed -i -e 's_http:\\/\\/localhost:8000\\/_\\/_g' {} \;
fi
popd
cp -a static/* ../publicgoods-website
rm -rf static
