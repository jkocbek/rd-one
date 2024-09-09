import { Transform } from 'class-transformer';

import { ValidationException } from '~common/exceptions';

export interface ITransformInputToArrayOptions {
  transformer?: (value: string) => any;
  separator?: string;
  removeDuplicates?: boolean;
  defaultToEmpty?: boolean;
}

export function transformInputToArrayFn(
  validator: (value: any) => boolean,
  options: ITransformInputToArrayOptions = {},
) {
  const { separator = ',', removeDuplicates = true, defaultToEmpty, transformer } = options;

  return (payload: { value: any; key: string }): any[] | undefined => {
    const { value, key } = payload;

    if (!value) {
      if (defaultToEmpty) {
        return [];
      }

      return undefined;
    }

    let array: any[] = [];

    if (typeof value === 'string') {
      array = value.split(separator).map((element) => element.trim());
    } else if (Array.isArray(value)) {
      array = value;
    } else {
      throw ValidationException.fromValidationErrors({ property: key, value }, `Invalid ${key} format.`);
    }

    const transformedAndValidatedArray = array
      .map((element) => (transformer ? transformer(element) : element))
      .filter((element, index, self) => {
        const isValid = validator(element);
        if (!isValid) {
          throw ValidationException.fromValidationErrors(
            { property: key, value: element },
            `Invalid ${key} format: ${element} failed validation.`,
          );
        }
        return removeDuplicates ? self.indexOf(element) === index : true;
      });

    return transformedAndValidatedArray;
  };
}

export function TransformInputToArray(
  validator: (value: any) => boolean,
  options?: ITransformInputToArrayOptions,
): PropertyDecorator {
  return Transform(transformInputToArrayFn(validator, options));
}
