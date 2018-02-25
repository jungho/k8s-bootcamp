#!/usr/bin/env bash

deployWithConduit=false
namespace='todo-app'

function checkConduitInstalled {
    if conduit version
    then
      echo "conduit is installed"
    else
      echo "conduit is not installed.  Please go to https://conduit.io/getting-started/ for instructions on how to install.";
      exit 1;
    fi
}

while getopts :cn: opt; do
    case $opt in
        c)
            deployWithConduit=true
            checkConduitInstalled
            ;;
        n)
            namespace=${OPTARG:-'todo-app'}
            ;;
        \?) #invalid option
            echo "usage: ./deploy-todo-app [-c] [-n namespace] default namespace is 'todo-app'"
            exit 1
            ;;
    esac
done

#Create the secrets need by the application to access Azure AD
kubectl create secret generic todoapp-secrets --from-file=secrets --namespace="$namespace"

#Create the configuration object for the todo and user APIs
kubectl create --namespace="$namespace" -f todo-api-config.yaml
kubectl create --namespace="$namespace" -f user-api-config.yaml
kubectl create --namespace="$namespace" -f todo-ui-config.yaml

#Now create the application

if [ "$deployWithConduit" = true ]; then
    echo "deploying todo-app to namespace: '$namespace' WITH the Conduit side proxy."
    conduit inject todo-app.yaml | kubectl create --namespace="$namespace" -f -
    echo ""
    echo "access the Conduit Dashboard by executing 'conduit dashboard'"
else
    echo "deploying todo-app to namespace: '$namespace'"
    kubectl create -f todo-app.yaml --namespace="$namespace"
fi