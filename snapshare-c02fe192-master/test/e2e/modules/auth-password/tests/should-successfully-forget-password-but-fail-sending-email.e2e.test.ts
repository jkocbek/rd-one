import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { e2eMockEmailSpyOnSendEmail } from 'test~e2e/mocks/email.e2e.mock';
import { UserFixture } from 'test~fixtures/user.fixture';

import { AuthPasswordForgotDto } from '~modules/auth-password/dtos/auth-password.forgot.dto';

export async function __e2eShouldSuccessfullyForgetPasswordButFailSendingEmail(app: INestApplication): Promise<void> {
  const email = 'auth-password.forgot.success.butFailSendingEmail@example.com';

  await UserFixture.createUser(app, email);

  const body: AuthPasswordForgotDto = {
    email,
  };

  const spySendEmail = e2eMockEmailSpyOnSendEmail(app);
  spySendEmail.mockImplementationOnce(() => {
    throw new Error();
  });

  const response = await request(app.getHttpServer()).post('/auth-password/forgot').send(body);

  expect(response.statusCode).toBe(HttpStatus.CREATED);
  expect(spySendEmail).toHaveBeenCalledTimes(1);
  expect(spySendEmail).toHaveReturnedTimes(0);
}
