#!/bin/bash -e

# This script is a warpper around `prisma cli` commands to get "prisma.databaseUrl" from config.yml file
# and export it to the shell where prisma cli commands are going to be executed.

# By default "local" stage from config.yml will be used. To change this, export STAGE env to your shell
# and set it to the desired stage (i.e "test").

# Usage:
#   1. Create a npm script "prisma:cli": "bash ./src/vendors/prisma/scripts/prisma-cli-wrapper.sh"
#   2. Execute a desired prisma cli command like "yarn prisma:cli migrate dev"

# Export stage to script
export STAGE="${STAGE:-"local"}"

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

DATABASE_URL=$(yarn ts-node -r tsconfig-paths/register "$SCRIPTS_DIR/prisma-database-url.run.ts")

# Rest of the passed in commands, concatenated
COMMAND="$*"

if [[ -z "${COMMAND}" ]]; then
  COMMAND=" --help"
fi

eval DATABASE_URL=$DATABASE_URL yarn prisma $COMMAND
