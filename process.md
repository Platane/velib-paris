
#docker

build image for the updater

```
docker build --file ./back/updater/Dockerfile --tag=platane/paris-velib-updater:$(node -e "console.log(require('./package.json').version)") .
docker build --file ./back/updater/Dockerfile --tag=platane/paris-velib-updater .
```
> push a tagged version, and one with 'latest' as tag ( so it will be pulled preferably )

push it to hub.docker.com
( the repository must have the same name as the image built )
```
docker push platane/paris-velib-updater
```



##Inside the vm

> Note that the container must have the credentials as env var

```
# install docker
curl get.docker.io | bash

# pull the image
sudo docker pull platane/paris-velib-updater

# fetch the env var
project_id=$(curl "http://metadata.google.internal/computeMetadata/v1/project/project-id" --silent -H "Metadata-Flavor: Google")
client_email=$(curl "http://metadata.google.internal/computeMetadata/v1/project/attributes/client_email" --silent -H "Metadata-Flavor: Google")
private_key=$(curl "http://metadata.google.internal/computeMetadata/v1/project/attributes/private_key" --silent -H "Metadata-Flavor: Google")

# run
sudo docker run -d -e "project_id=$project_id" -e "client_email=$client_email" -e "private_key=$private_key" platane/paris-velib-updater &> ./updater.log
```


# misc
```
# the commit hash ( short )
git log --pretty=format:'%h' -n 1

# the package version
$(node -e "console.log(require('./package.json').version)")
```

use a env.list file to push the env var into the docker
```
echo -e "project_id=$project_id\nclient_email=$client_email\nprivate_key=$private_key" > env.list

docker run --env-file env.list platane/paris-velib-updater
```
