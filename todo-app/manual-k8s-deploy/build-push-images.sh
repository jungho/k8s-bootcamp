if [ "$#" -ne 2 ] ; then
  echo "Usage: $0 dockerhub-id version" >&2
  echo "assuming it is \"my maker\" id"
  docker_id="architechbootcamp"
  version="1.0.1"
 else
  docker_id=$1
  version=$2
fi

echo " building images"
docker build -t todo-ui ../todo-ui
docker build -t todo-api ../todo-api-java
docker build -t user-api ../user-api

# docker rmi $(docker images -f "dangling=true" -q )

docker tag todo-ui:latest $docker_id/todo-ui:$version
docker tag todo-api:latest $docker_id/todo-api:$version
docker tag user-api:latest $docker_id/user-api:$version


echo " Enter your login password to Docker .."
docker login --username $docker_id

echo " .. "
echo " pushing images .. "

docker push  $docker_id/todo-ui:$version
docker push  $docker_id/todo-api:$version
docker push  $docker_id/user-api:$version
