repository="techdemoacr"
firstimagename="somepath/someimage"
version="v1"

echo " Taggin images ..."
docker tag $firstimagename:$version $repository.azurecr.io/firstimagename:$version
## repeat as much as needed

echo " Pushing to Azure ACR ... "
docker push $repository.azurecr.io/$myimage:$version
# repeat for all your images

echo " list of images created ... "
az acr repository list -n $repository -o table
