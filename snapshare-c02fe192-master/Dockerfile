FROM node:20.11.0-slim

WORKDIR /app

ARG RELEASE=unknown
ENV RELEASE=$RELEASE
ENV NODE_OPTIONS="--max-old-space-size=1024"

# install dependencies, use local cache
COPY package.json yarn.lock .yarnrc.yml /app/
COPY .yarn /app/.yarn

# Copy workspaces (adminjs-components, adminjs-express)
COPY adminjs-components/ /app/adminjs-components/
COPY adminjs-express/ /app/adminjs-express/

RUN yarn install --immutable

# Prisma requires libssl-dev to build nad procps to have at least ps available in the container.
RUN apt -y update && \
    apt -y install openssl libssl-dev procps ca-certificates && \
    apt-get autoclean && apt-get clean && rm -rf /var/lib/apt && rm -rf /var/cache/apt

# copy sources
COPY . /app

# build the application
RUN yarn build:adminjs
RUN yarn build

EXPOSE 80

# run the application
ENTRYPOINT ["./entrypoint.sh"]
