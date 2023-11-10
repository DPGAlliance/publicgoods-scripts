#!/bin/bash

# DOMAIN=" https://dpgalliance.github.io/"

# source a static version of the site
wget --no-host-directories --recursive --page-requisites --no-parent --timestamping -e robots=off -w 1 --random-wait --retry-on-http-error=503 -P static https://sourcewp.digitalpublicgoods.net https://sourcewp.digitalpublicgoods.net/submission-guide/

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
	find . -name '*.html' -exec sed -i '' -e 's_http://sourcewp.digitalpublicgoods.net/_/_g' {} \;
	find . -name '*.html' -exec sed -i '' -e 's_https://sourcewp.digitalpublicgoods.net/_/_g' {} \;
	find . -name '*.html' -exec sed -i '' -e 's_http:\\/\\/sourcewp.digitalpublicgoods.net\\/_\\/_g' {} \;
	find . -name '*.html' -exec sed -i '' -e 's_https:\\/\\/sourcewp.digitalpublicgoods.net\\/_\\/_g' {} \;
	# After all URLs with page links after the / have been replaced,
	# anything without trailing / is replaced with the actual domain
	# find . -name '*.html' -exec sed -i '' -e "s,http://sourcewp.digitalpublicgoods.net,$DOMAIN,g" {} \;
else
	echo 'Detected non-OSX...'
	find . -name '*.html' -exec sed -i -e 's_http://sourcewp.digitalpublicgoods.net/_/_g' {} \;
	find . -name '*.html' -exec sed -i -e 's_https://sourcewp.digitalpublicgoods.net/_/_g' {} \;
	find . -name '*.html' -exec sed -i -e 's_http:\\/\\/sourcewp.digitalpublicgoods.net\\/_\\/_g' {} \;
	find . -name '*.html' -exec sed -i -e 's_https:\\/\\/sourcewp.digitalpublicgoods.net\\/_\\/_g' {} \;
	# After all URLs with page links after the / have been replaced,
	# anything without trailing / is replaced with the actual domain
	# find . -name '*.html' -exec sed -i -e "s,http://sourcewp.digitalpublicgoods.net,$DOMAIN,g" {} \;
fi
popd
cp -a static/* ../publicgoods-website-test
rm -rf static
