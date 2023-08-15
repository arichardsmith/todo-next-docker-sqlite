FROM node:18-slim AS base
ENV DB_PATH=/data/database.sqlite
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:scripts
RUN pnpm build:next

FROM base AS runner
VOLUME /data
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/scripts ./scripts
COPY database/schema.sql ./database/schema.sql

COPY run.sh .
RUN chmod +x run.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=localhost

CMD ["./run.sh"]