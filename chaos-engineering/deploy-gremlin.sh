kubectl create secret generic gremlin-secrets --from-file=secrets --namespace=${1:-default}

kubectl create -f gremlin.yaml -n ${1:-default}