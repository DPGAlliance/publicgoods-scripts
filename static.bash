#!/bin/bash

# source a static version of the site
wget --no-host-directories --recursive --page-requisites --no-parent --timestamping -e robots=off -w 1 --random-wait --retry-on-http-error=503 -P static http://dpgwebsite.herokuapp.com http://dpgwebsite.herokuapp.com/submission-guide/

# cd into the folder
pushd static

# remove unneeded files
rm -rf comments feed wp-json xmlrpc.php\?rsd wp-login* wp-admin index.html\?*

for file in $(find . -name "*\?*")
do
	echo $file
	mv $file $(echo $file | sed s/\?.*$//)
done

if [[ "$OSTYPE" == "darwin"* ]]; then
	echo 'Detected OSX...'
	find . -name '*.html' -exec sed -i '' -e 's_http://dpgwebsite.herokuapp.com/_/_g' {} \;
	find . -name '*.html' -exec sed -i '' -e 's_https://dpgwebsite.herokuapp.com/_/_g' {} \;
	find . -name '*.html' -exec sed -i '' -e 's_http:\\/\\/dpgwebsite.herokuapp.com\\/_\\/_g' {} \;
	find . -name '*.html' -exec sed -i '' -e 's_https:\\/\\/dpgwebsite.herokuapp.com\\/_\\/_g' {} \;
else
	echo 'Detected non-OSX...'
	find . -name '*.html' -exec sed -i -e 's_http://dpgwebsite.herokuapp.com/_/_g' {} \;
	find . -name '*.html' -exec sed -i -e 's_https://dpgwebsite.herokuapp.com/_/_g' {} \;
	find . -name '*.html' -exec sed -i -e 's_http:\\/\\/dpgwebsite.herokuapp.com\\/_\\/_g' {} \;
	find . -name '*.html' -exec sed -i -e 's_https:\\/\\/dpgwebsite.herokuapp.com\\/_\\/_g' {} \;
fi
popd
cp -a static/* ../publicgoods-website
rm -rf static
