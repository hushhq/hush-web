# Multi-stage build for Hush Web Client
# WASM crypto is installed from @gethush/hush-crypto on npmjs.com (public).
# Admin dashboard is not included here — it is embedded in hush-server.

# --- Stage 1: Vite build (main client) ---
FROM node:22-alpine AS client-builder
WORKDIR /app
COPY .npmrc package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_DEBUG_TOOLBAR=false
ENV VITE_DEBUG_TOOLBAR=$VITE_DEBUG_TOOLBAR
RUN npm run build

# --- Stage 2: Caddy serve ---
FROM caddy:2-alpine
COPY docker/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=client-builder /app/dist /srv
