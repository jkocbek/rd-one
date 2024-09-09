import { ClassConstructor, ClassTransformOptions, plainToInstance } from 'class-transformer';
import { validate, validateSync, ValidationError, ValidatorOptions } from 'class-validator';

import { ValidationException } from '~common/exceptions/validation.exception';

export { TransformInputToArray, transformInputToArrayFn } from './transformers/input-to-array.transform';
export { TransformInputToBoolean, transformInputToBooleanFn } from './transformers/input-to-boolean.transform';

/**
 * Converts a data object to a class-validated instance
 *  using strict options and default values
 */
export function plainToValidatedInstance<T extends object>(
  cls: ClassConstructor<T>,
  data: T,
  transformOptions?: ClassTransformOptions,
  validateOptions?: ValidatorOptions,
): T {
  const instance =
    data instanceof cls
      ? data
      : plainToInstance(cls, data, {
          exposeDefaultValues: true, // setting this to true ensures that if instance has default value specified & plain is undefined, the the default value is used (eg. `page: number = appConstants.pagination.page.default`)
          exposeUnsetFields: false, // setting this to false will make plain properties with value "undefined" be omitted from the instance.
          strategy: 'excludeAll', // by default, exclude everything from plain unlesss "Instance" has that property and its decorated with `@Expose()`.
          ...(transformOptions ? transformOptions : {}),
        });

  const issues = validateSync(instance, {
    whitelist: true, // settings this to true will strip validated object of any properties that do not have any decorators
    forbidNonWhitelisted: true, // setting this to true will throw an error instead of stripping non-whitelisted properties
    ...(validateOptions ? validateOptions : {}),
  });

  if (issues.length) {
    throw issues;
  }

  return instance;
}

/**
 * Converts a data object to a class-validated instance provider
 *  using strict options and default values
 */
export function plainToValidatedInstanceProvider<T extends object>(
  cls: ClassConstructor<T>,
  data: T,
  transformOptions?: ClassTransformOptions,
  validateOptions?: ValidatorOptions,
) {
  return {
    provide: cls,
    useFactory: () => plainToValidatedInstance(cls, data, transformOptions, validateOptions),
  };
}

// @deprecated
export interface FieldError {
  id?: string;
  message: string;
  constraints?: { [key: string]: string };
}

// @deprecated
export interface FieldErrors {
  [key: string]: FieldError;
}

/**
 * @deprecated
 * @param validationErrors
 * @param prefix
 */
export function flatten(validationErrors: ValidationError[], prefix = ''): FieldErrors {
  let fieldErrors: FieldErrors = {};
  for (const { property, children, constraints, value } of validationErrors) {
    // use slug instead of index number
    // slug should be unique in all lists
    const name = property && property.match(/^[0-9]+$/) && typeof value.slug === 'string' ? value.slug : property;
    if (constraints) {
      fieldErrors[`${prefix}${name}`] = {
        constraints,
        message: Object.values(constraints).join(', '),
      };
    }
    if (children) {
      fieldErrors = {
        ...fieldErrors,
        ...flatten(children, `${prefix}${name}.`),
      };
    }
  }
  return fieldErrors;
}

/**
 * @deprecated
 * @param object
 * @param validatorOptions
 * @param prefix
 */
export async function validateFields(
  object: object,
  validatorOptions?: ValidatorOptions,
  prefix?: string,
): Promise<FieldErrors> {
  return flatten(await validate(object, validatorOptions), prefix);
}

/**
 * @deprecated
 * @param object
 * @param validatorOptions
 * @param prefix
 */
export function validateFieldsSyncOrThrow(object: object, validatorOptions?: ValidatorOptions, prefix?: string): void {
  const fieldErrors = flatten(validateSync(object, validatorOptions), prefix);
  if (Object.keys(fieldErrors).length > 0) {
    throw ValidationException.fromFieldErrors(fieldErrors);
  }
}

/**
 * @deprecated
 * @param object
 * @param validatorOptions
 * @param prefix
 */
export async function validateFieldsOrThrow(
  object: object,
  validatorOptions?: ValidatorOptions,
  prefix?: string,
): Promise<void> {
  const fieldErrors = await validateFields(object, validatorOptions, prefix);
  if (Object.keys(fieldErrors).length > 0) {
    throw ValidationException.fromFieldErrors(fieldErrors);
  }
}
