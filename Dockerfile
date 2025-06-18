# Dockerfile
#
# This Dockerfile is used to build the application in a Docker container.
# It is used to deploy the application to Fly.io.
#
# The application is built using Bun, and the database is stored in a SQLite database file.
# The database file is stored in the /mnt/clients_db directory.
#
# The application is exposed on port 3000.

FROM oven/bun:1.2.16-slim AS base

LABEL fly_launch_runtime="Bun"

WORKDIR /app
ENV NODE_ENV="production"
ENV DB_FILE_NAME="/mnt/clients_db/clients.sqlite"

FROM base AS build
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3
# Install node modules
COPY --link bun.lock package.json ./
RUN bun install --ci
# Copy application code
COPY --link . .

FROM base
COPY --from=build /app /app
EXPOSE 3000

CMD [ "bun", "run", "fly:start" ]