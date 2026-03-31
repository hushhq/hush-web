# Multi-stage build for Hush Web Client
# Requires NPM_TOKEN build arg for GitHub Packages auth
# WASM crypto is installed from @gethush/hush-crypto on GitHub Packages.

# --- Stage 1: Vite build (main client) ---
FROM node:22-alpine AS client-builder
WORKDIR /app
ARG NPM_TOKEN
COPY .npmrc package.json package-lock.json ./
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc && \
    npm ci && \
    sed -i '/_authToken/d' .npmrc
COPY . .
ARG VITE_DEBUG_TOOLBAR=false
ENV VITE_DEBUG_TOOLBAR=$VITE_DEBUG_TOOLBAR
RUN npm run build

# --- Stage 2: Vite build (admin dashboard) ---
FROM node:22-alpine AS admin-builder
WORKDIR /app
COPY admin/package.json admin/package-lock.json ./
RUN npm ci
COPY admin/ .
RUN npx vite build --base /admin/

# --- Stage 3: Caddy serve ---
FROM caddy:2-alpine
COPY --from=client-builder /app/dist /srv
COPY --from=admin-builder /dist-admin /srv/admin
