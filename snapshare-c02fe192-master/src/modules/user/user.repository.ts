import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { IPaginatedList } from '~common/interfaces/paginated-list.interface';
import { IPaginatedListQuery } from '~common/interfaces/paginated-list.query.interface';

import { PrismaService } from '~vendors/prisma/prisma.service';
import { generatePaginationOrderByPrisma } from '~vendors/prisma/utils/generate-pagination-order-by.prisma.util';

import { IUserCreate } from './interfaces/user.create.interface';
import { IUserFilter } from './interfaces/user.filter.interface';
import { IUser } from './interfaces/user.interface';
import { IUserUpdate } from './interfaces/user.update.interface';
import { UserHelper } from './user.helper';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(query: IPaginatedListQuery<IUserFilter>): Promise<IPaginatedList<IUser, IUserFilter>> {
    const { page, limit } = query;
    const where: Prisma.UserWhereInput = {
      id: query.filter?.ids ? { in: query.filter.ids } : undefined,
      email: query.filter?.search ? { contains: query.filter.search, mode: 'default' } : undefined,
    };

    const orderBy = generatePaginationOrderByPrisma(query.order);

    const offset = (page - 1) * limit;
    const userModels = await this.prismaService.user.findMany({ where, skip: offset, take: limit, orderBy });
    const count = await this.prismaService.user.count({ where });

    const items = userModels.map((user) => UserHelper.fromUser(user));

    return {
      items,
      page,
      filter: query.filter,
      order: query.order,
      limit,
      totalItems: count,
    };
  }

  async findById(id: string): Promise<IUser | undefined> {
    const entity = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!entity) {
      return undefined;
    }

    return UserHelper.fromUser(entity);
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const entity = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!entity) {
      return undefined;
    }

    return UserHelper.fromUser(entity);
  }

  async create(data: IUserCreate): Promise<IUser> {
    const user = await this.prismaService.user.create({
      data: {
        email: data.email,
        password: data.password,
        roles: data.roles,
      },
    });

    return UserHelper.fromUser(user);
  }

  async update(userId: string, data: IUserUpdate): Promise<IUser> {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        email: data.email,
        password: data.password,
        roles: data.roles,
      },
    });

    return UserHelper.fromUser(user);
  }
}
