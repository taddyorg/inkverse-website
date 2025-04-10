FROM node:20.17

# Create and use /app
WORKDIR /app

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install apt-utils -y
RUN apt-get install apt-transport-https ca-certificates -y 

# Install yarn from the local .tgz
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Copy package files first
COPY package.json yarn.lock ./

# Install dependencies
RUN $HOME/.yarn/bin/yarn install

# Copy the rest of the application (after deps)
COPY . .

# Build the application during the Docker build phase
RUN $HOME/.yarn/bin/yarn build

ENV NODE_ENV=production

EXPOSE 3000

# Only run the server in the CMD, not the build
CMD ["yarn", "start"]