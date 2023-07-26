# Install dependencies only when needed
FROM --platform=linux/amd64 node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM --platform=linux/amd64 node:16-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Mount the secrets and write them to .env
RUN --mount=type=secret,id=GOOGLE_ADSENSE echo "GOOGLE_ADSENSE=$(cat /run/secrets/GOOGLE_ADSENSE)" > ./.env
RUN --mount=type=secret,id=GOOGLE_TAG echo "GOOGLE_TAG=$(cat /run/secrets/GOOGLE_TAG)" >> ./.env
RUN --mount=type=secret,id=AWS_REGION echo "AWS_REGION=$(cat /run/secrets/AWS_REGION)" >> ./.env
RUN --mount=type=secret,id=DATABASE_URL echo "DATABASE_URL=$(cat /run/secrets/DATABASE_URL)" >> ./.env

RUN npm run build

# Production image, copy all the files and run next
FROM --platform=linux/amd64 node:16-alpine AS runner
WORKDIR /app

# Map environment
ENV NODE_ENV production

# Run app in non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
