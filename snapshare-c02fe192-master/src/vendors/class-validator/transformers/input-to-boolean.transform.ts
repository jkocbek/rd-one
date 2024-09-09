import { Transform } from 'class-transformer';

import { ValidationException } from '~common/exceptions';

export function transformInputToBooleanFn(payload: { value: any; key: string }): boolean | undefined {
  const { value, key } = payload;

  if (!value) {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1 ? true : false;
  }

  if (typeof value !== 'string') {
    throw ValidationException.fromValidationErrors(
      {
        property: key,
        value,
      },
      `Invalid ${key} format.`,
    );
  }

  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }

  return undefined;
}

export function TransformInputToBoolean(): PropertyDecorator {
  return Transform(transformInputToBooleanFn);
}
