#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# Questionful - Questionnaires Made Simple
#
# @package     Questionful
# @author      A.Tselegidis <alextselegidis@gmail.com>
# @copyright   Copyright (c) Alex Tselegidis
# @license     https://opensource.org/licenses/GPL-3.0 - GPLv3
# @link        https://questionful.org
# @since       v1.0.x
# ----------------------------------------------------------------------------
#
# Docker Publish Script
#
# Pushes the Questionful Docker image to Docker Hub.
# Also tags and pushes as "latest" when a specific version is given.
#
# Prerequisites:
#   docker login
#
# Usage:
#   ./docker/docker-publish.sh              # pushes alextselegidis/questionful:latest
#   ./docker/docker-publish.sh v1.0.0       # pushes :v1.0.0 and also tags as :latest
#   ./docker/docker-publish.sh v2.1.0       # pushes :v2.1.0 and also tags as :latest
#
# Typical workflow:
#   ./docker/docker-build.sh v1.0.0
#   ./docker/docker-publish.sh v1.0.0
#
# ----------------------------------------------------------------------------
set -euo pipefail

IMAGE_NAME="alextselegidis/questionful"
IMAGE_TAG="${1:-latest}"

# Verify the local image exists
if ! docker image inspect "${IMAGE_NAME}:${IMAGE_TAG}" > /dev/null 2>&1; then
    echo "Error: Local image '${IMAGE_NAME}:${IMAGE_TAG}' not found."
    echo "Run docker-build.sh first."
    exit 1
fi

echo "Pushing ${IMAGE_NAME}:${IMAGE_TAG}..."
docker push "${IMAGE_NAME}:${IMAGE_TAG}"

# When publishing a specific version, also tag and push as latest
if [ "$IMAGE_TAG" != "latest" ]; then
    echo
    echo "Tagging ${IMAGE_NAME}:${IMAGE_TAG} → ${IMAGE_NAME}:latest"
    docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${IMAGE_NAME}:latest"

    echo "Pushing ${IMAGE_NAME}:latest..."
    docker push "${IMAGE_NAME}:latest"
fi

echo
echo "Successfully published: ${IMAGE_NAME}:${IMAGE_TAG}"
