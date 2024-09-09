import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { FieldErrors, flatten } from '~vendors/class-validator';

import { BaseExceptionAbstract } from './base-exception';

export class ValidationException extends BaseExceptionAbstract {
  public meta: FieldErrors = {};

  constructor(fieldErrors: FieldErrors = {}, detail?: string) {
    super(HttpStatus.BAD_REQUEST, {
      message: 'Validation Exception',
      detail: detail || `${ValidationException._makeMessageFromFieldErrors(fieldErrors)}`,
      code: 'validationException',
      severity: 'log',
      meta: fieldErrors,
    });
  }

  public static _makeMessageFromFieldErrors(fieldError: FieldErrors): string {
    return Object.entries(fieldError)
      .reduce((m: string[], [k, v]) => {
        m.push(`'${k}' ${v.message}`);
        return m;
      }, [] as string[])
      .join(', ');
  }

  public static fromFieldErrors(fieldError: FieldErrors, detail?: string): ValidationException {
    return new ValidationException(fieldError, detail);
  }

  public static fromValidationErrors(
    validationErrors: ValidationError | ValidationError[],
    detail: string,
  ): ValidationException {
    const fieldErrors = flatten(Array.isArray(validationErrors) ? validationErrors : [validationErrors]);
    return new ValidationException(fieldErrors, detail);
  }
}
