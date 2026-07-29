# Docker Guide

## Build Image

```bash
docker build -f week3/day16/Dockerfile -t sda-training .
```

## Start Containers

```bash
docker compose -f week3/day16/docker-compose.yml up -d
```

## Stop Containers

```bash
docker compose -f week3/day16/docker-compose.yml down
```

## View Logs

```bash
docker compose -f week3/day16/docker-compose.yml logs -f
```

## List Running Containers

```bash
docker ps
```