# This Dockerfile uses `serve` npm package to serve the static files with node process.  
FROM refinedev/node:18 AS base  
  
FROM base as deps  
WORKDIR /app  
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./  
  
RUN \  
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \  
  elif [ -f package-lock.json ]; then npm ci; \  
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \  
  else echo "Lockfile not found." && exit 1; \  
  fi  
  
FROM base as builder  
WORKDIR /app  
ENV NODE_ENV=production  
  
COPY --from=deps /app/node_modules ./node_modules  
COPY . .  
  
RUN npm run build  
  
FROM base as runner  
WORKDIR /app  
ENV NODE_ENV=production  
  
RUN npm install -g serve  
  
COPY --from=builder /app/dist ./dist  
  
USER refine  
  
EXPOSE 3000  
  
CMD ["serve", "-s", "dist", "-l", "3000"]