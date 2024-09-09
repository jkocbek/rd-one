import { Reflector } from '@nestjs/core';

import { UserRole } from '~modules/user/enums/user.role.enum';

export const AllowedUserRoles = Reflector.createDecorator<UserRole[]>();
