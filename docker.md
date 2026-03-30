# Questionful — Docker Guide

This guide covers how to build, run, and publish Questionful as a Docker container.

## Overview

The Docker setup uses a **multi-stage build**:

1. **Build stage** — Node.js installs dependencies and builds the static site
2. **Production stage** — A lightweight nginx image serves the built files (~30 MB total)

Questionnaire configuration is provided **at runtime** when starting the container — either by mounting a JSON file or passing it as an environment variable.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- (For publishing) A [Docker Hub](https://hub.docker.com/) account

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/alextselegidis/questionful.git
cd questionful

# Build the Docker image
./docker/docker-build.sh

# Run the container
docker run -p 8080:80 alextselegidis/questionful
```

Open [http://localhost:8080](http://localhost:8080) to see your questionnaire.

---

## Providing a Questionnaire Config

You can provide your own `Questionful.json` at container startup.

### Option A: Mount a JSON File

Create your config file and mount it to `/config/Questionful.json`:

```bash
docker run -p 8080:80 \
  -v /path/to/my-config-dir:/config:ro \
  alextselegidis/questionful
```

The directory must contain a file named `Questionful.json`.

### Option B: Environment Variable

Pass the JSON directly as an environment variable:

```bash
docker run -p 8080:80 \
  -e 'QUESTIONFUL_JSON={"type":"form","title":"My Form","styles":{"backgroundColor":"#ffd832","primaryFontColor":"#333","secondaryFontColor":"#666","fontFamily":"Arial","fontSize":"14px"},"pages":[{"name":"page-1","elements":[{"type":"qf-short-text","name":"q1","title":"What is your name?","required":true}]}]}' \
  alextselegidis/questionful
```

### Priority

1. Mounted file (`/config/Questionful.json`) — highest priority
2. Environment variable (`QUESTIONFUL_JSON`)
3. Default example config — fallback

---

## Building the Image

```bash
./docker/docker-build.sh              # builds alextselegidis/questionful:latest
./docker/docker-build.sh v1.0.0       # builds alextselegidis/questionful:v1.0.0
```

### Building Manually (without the script)

```bash
docker build -f docker/Dockerfile -t alextselegidis/questionful .
```

---

## Docker Compose

A `docker-compose.yml` is provided in the `docker/` directory:

```bash
cd docker
docker compose up -d
```

To use runtime config with Compose, edit `docker/docker-compose.yml` and uncomment the `volumes` or `environment` section:

```yaml
services:
  questionful:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "8080:80"
    restart: unless-stopped

    # Mount a config directory
    volumes:
      - ./config:/config:ro
```

Then place your `Questionful.json` in `docker/config/Questionful.json`.

---

## Publishing to Docker Hub

### 1. Log in to Docker Hub

```bash
docker login
```

### 2. Build the image

```bash
./docker/docker-build.sh v1.0.0
```

### 3. Publish

```bash
./docker/docker-publish.sh v1.0.0
```

This pushes `alextselegidis/questionful:v1.0.0` and also automatically tags and pushes as `latest`.

---

## Pulling from Docker Hub

Once published, others can pull and run your questionnaire:

```bash
docker pull alextselegidis/questionful:latest
docker run -p 8080:80 alextselegidis/questionful:latest
```

Or provide their own config at runtime:

```bash
docker run -p 8080:80 \
  -v /path/to/config:/config:ro \
  alextselegidis/questionful:latest
```

---

## Networking

### Mapping to a Custom Port

```bash
docker run -p 3000:80 alextselegidis/questionful    # Available at http://localhost:3000
```

### Running on an Internal Network

```bash
# Create a Docker network
docker network create my-intranet

# Run on that network
docker run -d --name questionful \
  --network my-intranet \
  -p 8080:80 \
  alextselegidis/questionful
```

### Using with a Reverse Proxy

If you're running behind a reverse proxy (e.g., Traefik, Caddy, another nginx), just map the port and configure your proxy to forward to the container:

```bash
docker run -d --name questionful \
  -p 127.0.0.1:8080:80 \
  alextselegidis/questionful
```

---

## File Reference

| File | Description |
|---|---|
| `docker/Dockerfile` | Multi-stage build definition |
| `docker/nginx.conf` | nginx configuration for SPA routing |
| `docker/docker-entrypoint.sh` | Container entrypoint (handles runtime config) |
| `docker/docker-build.sh` | Build helper script |
| `docker/docker-publish.sh` | Publish helper script |
| `docker/docker-compose.yml` | Docker Compose configuration |
| `.dockerignore` | Files excluded from build context |

---

## Troubleshooting

### Container starts but page is blank

Check the browser console for errors. The most common cause is an invalid `Questionful.json` format.

### Form submissions fail

The submission URL in your `Questionful.json` must be reachable from the user's browser (not from inside the container). If your API is also running in Docker, use Docker networking or an externally resolvable hostname.

### Config changes not reflected

If using **runtime config** (mounted file or env var), restart the container:

```bash
docker restart questionful
```
