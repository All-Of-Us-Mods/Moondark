FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/types/package.json ./packages/types/

RUN bun install

COPY apps/dashboard/ ./apps/dashboard/
COPY packages/types/src ./packages/types/src

RUN cd apps/dashboard && bun run build

EXPOSE 3000
CMD ["bun", "run", "--cwd", "apps/dashboard", "preview"]
