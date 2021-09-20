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

pushd ../publicgoods-website/map && \
    git rm -rf _next/* || true && \
    mkdir _next && \
    cp -a ../../publicgoods-scripts/packages/map/build/_next/static _next && \
    cp -a ../../publicgoods-scripts/packages/map/build/_next/data _next && \
    git add _next/* && \
    cp ../../publicgoods-scripts/packages/map/build/index.html . && \
popd

pushd ../publicgoods-website/roadmap && \
    git rm -rf static/* || true && \
    mkdir static && \
    cp -a ../../publicgoods-scripts/packages/roadmap/build/static/* static && \
    git add static/* && \
    cp ../../publicgoods-scripts/packages/roadmap/build/index.html . && \
popd
