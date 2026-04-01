FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

RUN bun install

COPY apps/api/src ./apps/api/src
COPY packages/types/src ./packages/types/src

EXPOSE 3001
CMD ["bun", "run", "--cwd", "apps/api", "dev"]
