import { Provider } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { Test, TestingModule } from '@nestjs/testing';

import { logger } from '~common/logging';

export async function createTestingModule(
  imports: (Type | DynamicModule | Promise<DynamicModule> | ForwardReference)[],
  providers?: (Type | Provider)[],
  controllers?: any[],
): Promise<TestingModule> {
  const mb = Test.createTestingModule({
    imports,
    providers,
    controllers,
  });
  mb.setLogger(logger);
  return await mb.compile();
}
