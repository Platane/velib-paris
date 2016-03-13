#velib-paris

## gCloud

Bescause i'm poor, the project is running on one instence with a coreOS which holds all the containers.

In order to access the dataStore, some value should be injected as env var.

Create a service account, generate a key and allows it to access dataStore.

In the console, create the metadata `client_email` and `private_key`. With the values of the key.

create the env.list on the server, which will be parsed at docker run to inject env var

```
#!/bin/bash

project_id=$(curl "http://metadata.google.internal/computeMetadata/v1/project/project-id" --silent -H "Metadata-Flavor: Google")
client_email=$(curl "http://metadata.google.internal/computeMetadata/v1/project/attributes/client_email" --silent -H "Metadata-Flavor: Google")
private_key=$(curl "http://metadata.google.internal/computeMetadata/v1/project/attributes/private_key" --silent -H "Metadata-Flavor: Google")

cat > ~/env.list <<- EOF
project_id=$project_id
client_email=$client_email
private_key=$private_key
EOF


```

## containers

Containers are stocked on the docker hub
- __updater__ every x minutes, query the API and push station availabilities.
- __server__ respond to REST API to get the last availabilities.

```
docker run -d --env-file ~/env.list platane/paris-velib-updater
```

## server API

__routes__

 - `/api/v1/stations/` return all the stations

 - `/api/v1/stations/availabilities`
    accept params `startDate` and `endDate`
