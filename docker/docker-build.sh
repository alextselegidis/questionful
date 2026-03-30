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
# Docker Build Script
#
# Builds the Questionful Docker image with the given version tag.
#
# Usage:
#   ./docker/docker-build.sh              # builds alextselegidis/questionful:latest
#   ./docker/docker-build.sh v1.0.0       # builds alextselegidis/questionful:v1.0.0
#   ./docker/docker-build.sh v2.1.0       # builds alextselegidis/questionful:v2.1.0
#
# After building, run the container with:
#   docker run -p 8080:80 alextselegidis/questionful
#   docker run -p 8080:80 -v /path/to/config:/config:ro alextselegidis/questionful
#   docker run -p 8080:80 -e 'QUESTIONFUL_JSON={...}' alextselegidis/questionful
#
# ----------------------------------------------------------------------------
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

IMAGE_NAME="alextselegidis/questionful"
IMAGE_TAG="${1:-latest}"

cd "$PROJECT_DIR"

echo "Building ${IMAGE_NAME}:${IMAGE_TAG}..."
echo

docker build -f docker/Dockerfile -t "${IMAGE_NAME}:${IMAGE_TAG}" .

echo
echo "Successfully built: ${IMAGE_NAME}:${IMAGE_TAG}"
echo
echo "Run with:"
echo "  docker run -p 8080:80 ${IMAGE_NAME}:${IMAGE_TAG}"
echo
echo "Then open http://localhost:8080"
