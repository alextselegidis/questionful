#!/bin/sh
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
# Docker Entrypoint
#
# Handles optional runtime config injection before starting nginx.
#
# Runtime config can be provided in two ways:
#   1. Mount a JSON file:   docker run -v /path/to/config:/config:ro ...
#      (place Questionful.json inside the mounted directory)
#   2. Environment variable: docker run -e 'QUESTIONFUL_JSON={...}' ...
#
# If no runtime config is provided, the build-time config is used.
#
# ----------------------------------------------------------------------------
set -e

CONFIG_DIR="/config"
CONFIG_FILE="$CONFIG_DIR/Questionful.json"
HTML_DIR="/usr/share/nginx/html"

# Runtime config injection — allows overriding the baked-in questionnaire
# config without rebuilding the Docker image.

if [ -f "$CONFIG_FILE" ]; then
    echo "Questionful: Loading runtime config from $CONFIG_FILE"
    echo "window.__QUESTIONFUL_CONFIG__ = $(cat "$CONFIG_FILE");" > "$HTML_DIR/config.js"
elif [ -n "${QUESTIONFUL_JSON:-}" ]; then
    echo "Questionful: Loading runtime config from QUESTIONFUL_JSON env var"
    echo "window.__QUESTIONFUL_CONFIG__ = ${QUESTIONFUL_JSON};" > "$HTML_DIR/config.js"
else
    echo "Questionful: Using build-time config"
fi

exec nginx -g "daemon off;"
