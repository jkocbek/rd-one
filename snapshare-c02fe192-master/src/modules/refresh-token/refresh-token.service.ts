import { Injectable } from '@nestjs/common';

import { IRefreshTokenCreate } from './interfaces/refresh-token.create.interface';
import { IRefreshToken } from './interfaces/refresh-token.interface';
import { IRefreshTokenUpdate } from './interfaces/refresh-token.update.interface';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async create(data: IRefreshTokenCreate): Promise<IRefreshToken> {
    const refreshToken = await this.refreshTokenRepository.create(data);
    return refreshToken;
  }

  async updateByUserSessionId(userSessionId: string, data: IRefreshTokenUpdate): Promise<IRefreshToken> {
    const refreshToken = await this.refreshTokenRepository.updateByUserSessionId(userSessionId, data);
    return refreshToken;
  }

  async findById(id: string): Promise<IRefreshToken | undefined> {
    const refreshToken = await this.refreshTokenRepository.findById(id);
    return refreshToken;
  }

  async findByUserSessionId(userSessionId: string): Promise<IRefreshToken | undefined> {
    const refreshToken = await this.refreshTokenRepository.findByUserSessionId(userSessionId);
    return refreshToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.refreshTokenRepository.deleteById(id);
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteAllForUser(userId);
  }
}
