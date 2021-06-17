## How to run in Docker

```
docker run -p 3000:3000 --env-file .env multi_tenant
```

## When MSSQL is running in a separate container

When MSSQL is running in different network, then pass host as network to connect to it i.e.

_Advanced_

```
docker run --rm --name node_app -p 3000:3000 --env-file .env --network=host multi_tenant
```

## Using Named Network

```
1. Create network i.e. docker network create <network-name> i.e. cls
2. Run DB container on above network i.e. docker run --name <container-name> -p 1433:1433 --network=cls -d <image-name>
3. Create 'docker.env' file to override database host name for internal use by Docker
4. Add DB_HOST=<container-name> i.e. DB_HOST=mssql
5. Run app with both .env files on aboce network i.e. docker run --name node_app -p 3000:3000 --env-file .env --env-file docker.env --network=cls -d <image-name>
6. Now we can run app in docker & DB migrations from local i.e. npm run db:tenant:run
```
