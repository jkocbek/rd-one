import * as crypto from 'crypto';

export function testGenerateRandomForgotPasswordCode() {
  const codeLength = 32;

  const result = crypto.randomBytes(codeLength).toString('hex');

  return result;
}
