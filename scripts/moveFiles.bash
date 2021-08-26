#!/bin/bash
pushd ../publicgoods-website/registry && \
	git rm -rf static/* || true && \
    mkdir static && \
    cp -a ../../publicgoods-scripts/packages/registry/build/static/* static && \
    git add static/* && \
    cp ../../publicgoods-scripts/packages/registry/build/index.html . && \
popd

pushd ../publicgoods-website/eligibility && \
	git rm -rf static/* || true && \
    mkdir static && \
    cp -a ../../publicgoods-scripts/packages/eligibility/build/static/* static && \
    git add static/* && \
    cp ../../publicgoods-scripts/packages/eligibility/build/index.html . && \
popd

pushd ../publicgoods-website && \
	rm -r map || true && \
    mkdir map && \
    cp -a ../publicgoods-scripts/packages/map/build/* map && \
    git add map/* && \
popd
