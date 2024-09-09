import { INestApplication } from '@nestjs/common';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { testConstants } from 'test~test.constants';

import { PrismaService } from '~vendors/prisma/prisma.service';

import { AuthService } from '~modules/auth/auth.service';
import { UserRole } from '~modules/user/enums/user.role.enum';
import { makeUUID } from '~utils/uuid';

export class UserFixture {
  static async findUserByEmail(app: INestApplication, email: string): Promise<User> {
    const prisma = app.get<PrismaService>(PrismaService);

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    return user;
  }

  static async createUser(app: INestApplication, email: string, password?: string, roles?: UserRole[]): Promise<User> {
    const prisma = app.get<PrismaService>(PrismaService);

    let hashedPassword: string | undefined;
    if (password) {
      const authService = app.get<AuthService>(AuthService);
      hashedPassword = await authService.encryptPassword(password);
    }

    const id = makeUUID();
    const user = await prisma.user.create({ data: { id, email, roles, password: hashedPassword } });

    await prisma.userIdentityProvider.create({ data: { sub: user.id, userId: user.id } });

    return user;
  }

  static async createUserWithoutProvider(
    app: INestApplication,
    email: string,
    password?: string,
    roles?: UserRole[],
  ): Promise<User> {
    const prisma = app.get<PrismaService>(PrismaService);

    let hashedPassword: string | undefined;
    if (password) {
      const authService = app.get<AuthService>(AuthService);
      hashedPassword = await authService.encryptPassword(password);
    }

    const id = makeUUID();
    const user = await prisma.user.create({ data: { id, email, roles, password: hashedPassword } });

    return user;
  }

  static async createAdminUser(app: INestApplication, email: string, password: string): Promise<User> {
    const user = await this.createUser(app, email, password, [UserRole.ADMIN]);
    return user;
  }

  static async createUserAccessToken(app: INestApplication, userId: string): Promise<string> {
    const prisma = app.get<PrismaService>(PrismaService);
    const authService = app.get<AuthService>(AuthService);

    const identityProvider = await prisma.userIdentityProvider.findFirstOrThrow({ where: { userId } });
    const jti = makeUUID();
    const authResponse = await authService.createAuthSession(userId, identityProvider.id, jti);

    return authResponse.accessToken;
  }

  static async createRandomAccessToken(): Promise<string> {
    const token = jwt.sign({}, testConstants.signingKey);
    return token;
  }

  static async createMalformedAccessToken(): Promise<string> {
    const validToken = jwt.sign({}, testConstants.signingKey);

    const parts = validToken.split('.');
    const malformedToken = `${parts[0]}.${parts[1]}`;

    return malformedToken;
  }

  static async createNoClaimsAccessToken(): Promise<string> {
    const header = { alg: 'HS256', typ: 'JWT' };
    const claims = {};

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');
    const encodedClaims = Buffer.from(JSON.stringify(claims)).toString('base64');
    const signature = jwt.sign(`${encodedHeader}.${encodedClaims}`, testConstants.signingKey);

    const tokenWithNoClaims = `${encodedHeader}.${signature}`;

    return tokenWithNoClaims;
  }

  static async expireAccessToken(accessToken: string): Promise<string> {
    const decoded = jwt.decode(accessToken) as jwt.JwtPayload;

    if (!decoded.exp) {
      throw new Error("Cannot expire access token because access token does not contain 'exp'.");
    }

    decoded.exp = DateTime.now().minus({ second: 1 }).toSeconds();

    const expiredToken = jwt.sign(decoded, testConstants.signingKey);

    return expiredToken;
  }

  static async getAccessTokenJwt(accessToken: string): Promise<string> {
    const decoded = jwt.decode(accessToken) as jwt.JwtPayload;

    const jti = decoded.jti;

    if (!jti) {
      throw new Error("Cannot get 'jti' from access token because it does not contain it.");
    }

    return jti;
  }
}
