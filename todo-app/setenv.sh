#!/bin/bash

########
# For convenience set environment variables by filling in the values in this file then running:
# `source setenv.sh`
########

## Provide values in between the single quotes
export AZURE_APP_ID=''
export AZURE_CLIENT_SECRET=''
export AZURE_AD_TENANT=''

# Should not need to modify these
export AZURE_IDENTITY_META_DATA="https://login.microsoftonline.com/${AZURE_AD_TENANT}/v2.0/.well-known/openid-configuration"
export IS_TEST_MODE='false'
export REACT_APP_TEST_MODE=$IS_TEST_MODE
export REACT_APP_CLIENT_ID=$AZURE_APP_ID
export REACT_APP_TENANT=$AZURE_AD_TENANT
