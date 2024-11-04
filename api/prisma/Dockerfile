FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Install prisma for the migration
RUN yarn global add prisma

# Copy schema and migration folder

RUN addgroup --system --gid 1001 prisma && \
  adduser --system --uid 1001 prisma

USER prisma

ADD ./ ./

CMD [ "prisma", "migrate", "deploy"]