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
# Dockerfile — Multi-stage build: Node.js (build) → nginx (serve)
#
# Build:
#   docker build -f docker/Dockerfile -t alextselegidis/questionful .
#
# Run:
#   docker run -p 8080:80 alextselegidis/questionful
#
# Provide questionnaire config at runtime (mount a volume):
#   docker run -p 8080:80 -v /path/to/config:/config:ro alextselegidis/questionful
#
# Provide questionnaire config at runtime (environment variable):
#   docker run -p 8080:80 -e 'QUESTIONFUL_JSON={...}' alextselegidis/questionful
#
# ----------------------------------------------------------------------------

# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the full project
COPY . .

# Build the static site (skip the zip step from npm run build)
RUN npx vite build

# Inject config.js script tag for optional runtime config override
RUN sed -i 's|</head>|<script src="/config.js"></script>\n</head>|' build/index.html

# ---- Production Stage ----
FROM nginx:alpine

LABEL maintainer="alextselegidis@gmail.com"
LABEL org.opencontainers.image.source="https://github.com/alextselegidis/questionful"
LABEL org.opencontainers.image.description="Questionful - Questionnaires Made Simple"
LABEL org.opencontainers.image.licenses="GPL-3.0"

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/build /usr/share/nginx/html

# Copy entrypoint script
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create default empty config.js (overwritten by entrypoint if runtime config is provided)
RUN echo "// No runtime config override" > /usr/share/nginx/html/config.js

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
