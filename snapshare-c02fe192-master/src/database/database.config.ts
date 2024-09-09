import { ConfigDecorator } from '~common/config';

import { PrismaConfig } from '~vendors/prisma/prisma.config';

@ConfigDecorator('database')
export class DatabaseConfig extends PrismaConfig {}
