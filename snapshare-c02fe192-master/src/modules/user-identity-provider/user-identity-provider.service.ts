import { Injectable } from '@nestjs/common';

import { IUserIdentityProviderCreate } from './interfaces/user-identity-provider.create.interface';
import { IUserIdentityProviderFind } from './interfaces/user-identity-provider.find.interface';
import { IUserIdentityProvider } from './interfaces/user-identity-provider.interface';
import { IUserIdentityProviderUpdate } from './interfaces/user-identity-provider.update.interface';
import { UserIdentityProviderRepository } from './user-identity-provider.repository';

@Injectable()
export class UserIdentityProviderService {
  constructor(private readonly userIdentityProviderRepository: UserIdentityProviderRepository) {}

  async find(data: IUserIdentityProviderFind): Promise<IUserIdentityProvider | undefined> {
    const userIdentityProvider = await this.userIdentityProviderRepository.find(data);
    return userIdentityProvider;
  }

  async findById(id: string): Promise<IUserIdentityProvider | undefined> {
    const userIdentityProvider = await this.userIdentityProviderRepository.findById(id);
    return userIdentityProvider;
  }

  async create(data: IUserIdentityProviderCreate): Promise<IUserIdentityProvider> {
    const userIdentityProvider = await this.userIdentityProviderRepository.create(data);
    return userIdentityProvider;
  }

  async update(id: string, data: IUserIdentityProviderUpdate): Promise<IUserIdentityProvider> {
    const userIdentityProvider = await this.userIdentityProviderRepository.update(id, data);
    return userIdentityProvider;
  }
}
