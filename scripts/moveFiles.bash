#!/bin/bash
pushd ../publicgoods-website/registry && \
	git rm -rf static/* || true && \
    mkdir static && \
    cp -a ../../publicgoods-scripts/packages/registry/build/static/* static && \
    git add static/* && \
    cp ../../publicgoods-scripts/packages/registry/build/index.html . && \
popd
pushd packages/eligibility && \
  ln -s ../../../../publicgoods-website/wp-includes/
  ln -s ../../../../publicgoods-website/wp-content/
  npm install && npm run build && \
popd

pushd ../publicgoods-website/eligibility && \
	git rm -rf static/* || true && \
    mkdir static && \
    cp -a ../../publicgoods-scripts/packages/eligibility/build/static/* static && \
    git add static/* && \
    cp ../../publicgoods-scripts/packages/eligibility/build/index.html . && \
popd

