FROM docker.cache.***.ir/node:20 AS deps
WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://npm.cache.***.ir
RUN npm config set strict-ssl false

RUN npm install -f --verbose

COPY . .

RUN NODE_ENV=production npm run build:prod

FROM docker.cache.***.ir/node:20 AS prod-deps
WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://npm.cache.***.ir
RUN npm config set strict-ssl false
RUN npm install --omit=dev --no-optional -f

FROM docker.cache.***.ir/node:20-slim AS runner
ARG MODE=$MODE
ENV MODE=$MODE
ENV NODE_ENV=production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN npm install serve

COPY --from=deps /app/build ./build
COPY --from=deps /app/build-api ./build-api
COPY --from=deps /app/node_modules ./node_modules

RUN chown -R nextjs:nodejs ./

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm","run", "start:prod"]