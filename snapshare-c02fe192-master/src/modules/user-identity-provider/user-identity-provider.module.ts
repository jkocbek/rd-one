import { Module } from '@nestjs/common';

import { UserIdentityProviderRepository } from './user-identity-provider.repository';
import { UserIdentityProviderService } from './user-identity-provider.service';

@Module({
  providers: [UserIdentityProviderRepository, UserIdentityProviderService],
  exports: [UserIdentityProviderService],
})
export class UserIdentityProviderModule {}
