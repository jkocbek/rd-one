import { getConfig } from '~common/config';

import { DatabaseConfig } from '~database/database.config';

const prismaConfig = getConfig(DatabaseConfig);

/**
 * Get the database URL from the Prisma configuration
 *  and print it to the console
 *
 *  Used in prisma-cli-wrapper.sh
 */

// eslint-disable-next-line no-console
console.log(prismaConfig.databaseUrl);
