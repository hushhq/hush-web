# Multi-stage build for Hush Web Client
# WASM crypto is installed from @gethush/hush-crypto on npmjs.com (public).

# --- Stage 1: Vite build (main client) ---
FROM node:22-alpine AS client-builder
WORKDIR /app
COPY .npmrc package.json package-lock.json ./
RUN npm ci
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
COPY docker/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=client-builder /app/dist /srv
COPY --from=admin-builder /dist-admin /srv/admin
