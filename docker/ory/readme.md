# ORY Stack

### Deploy Locally

```bash
docker-compose --env-file .env.local up -d
```

### Deploying to Staging

```bash
docker-compose --env-file .env.staging up -d
```


### Deploy to Production

```bash
docker-compose --env-file .env.production up -d
```


### Destroying the containters

```bash
docker-compose --env-file <ENV_FILE> down
```