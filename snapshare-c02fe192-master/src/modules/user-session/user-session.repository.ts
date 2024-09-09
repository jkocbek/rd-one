import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { IPaginatedList } from '~common/interfaces/paginated-list.interface';
import { IPaginatedListQuery } from '~common/interfaces/paginated-list.query.interface';

import { PrismaService } from '~vendors/prisma/prisma.service';
import { generatePaginationOrderByPrisma } from '~vendors/prisma/utils/generate-pagination-order-by.prisma.util';

import { IUserSessionCreate } from './interfaces/user-session.create.interface';
import { IUserSessionFilter } from './interfaces/user-session.filter.interface';
import { IUserSession } from './interfaces/user-session.interface';
import { IUserSessionUpdate } from './interfaces/user-session.update.interface';
import { UserSessionHelper } from './user-session.helper';

@Injectable()
export class UserSessionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async listForUser(
    userId: string,
    query: IPaginatedListQuery<IUserSessionFilter>,
  ): Promise<IPaginatedList<IUserSession, IUserSessionFilter>> {
    const { page, limit } = query;
    const where: Prisma.UserSessionWhereInput = {
      userId,
      id: query.filter?.ids ? { in: query.filter.ids } : undefined,
    };

    const orderBy = generatePaginationOrderByPrisma(query.order);

    const offset = (page - 1) * limit;
    const userSessionModels = await this.prismaService.userSession.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy,
    });
    const count = await this.prismaService.userSession.count({ where });

    const items = userSessionModels.map((userSession) => UserSessionHelper.fromIUserSession(userSession));

    return {
      items,
      page,
      filter: query.filter,
      order: query.order,
      limit,
      totalItems: count,
    };
  }

  async findForUserById(userId: string, id: string): Promise<IUserSession | undefined> {
    const entity = await this.prismaService.userSession.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!entity) {
      return undefined;
    }

    return UserSessionHelper.fromIUserSession(entity);
  }

  async findForUserByJti(userId: string, jti: string): Promise<IUserSession | undefined> {
    const entity = await this.prismaService.userSession.findUnique({
      where: {
        jti,
        userId,
      },
    });

    if (!entity) {
      return undefined;
    }

    return UserSessionHelper.fromIUserSession(entity);
  }

  async create(data: IUserSessionCreate): Promise<IUserSession> {
    const userSession = await this.prismaService.userSession.create({
      data: {
        jti: data.jti,
        expireAt: data.expireAt,
        userId: data.userId,
        userIdentityProviderId: data.userIdentityProviderId,
      },
    });

    return UserSessionHelper.fromIUserSession(userSession);
  }

  async updateById(id: string, data: IUserSessionUpdate): Promise<IUserSession> {
    const userSession = await this.prismaService.userSession.update({
      where: {
        id,
      },
      data: {
        expireAt: data.expireAt,
        jti: data.jti,
      },
    });

    return UserSessionHelper.fromIUserSession(userSession);
  }

  async deleteForUserById(userId: string, id: string): Promise<void> {
    await this.prismaService.userSession.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.prismaService.userSession.deleteMany({
      where: {
        userId,
      },
    });
  }
}
