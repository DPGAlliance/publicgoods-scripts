#/bin/bash
pushd ../publicgoods-website/explore
git rm -r static/*
mkdir static
cp -a ../../publicgoods-scripts/build/static/* static
git add static/*
cp ../../publicgoods-scripts/build/index.html .
popd