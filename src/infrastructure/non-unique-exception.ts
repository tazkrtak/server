import { HttpException, HttpStatus } from '@nestjs/common';
import { IFieldValidationError } from './validation-exception';

export class NonUniqueException extends HttpException {
  constructor(public validationErrors: IFieldValidationError[]) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `Unique Constraint Failed on ${validationErrors['meta']['target']} field.`,
        validationErrors,
      },
      HttpStatus.CONFLICT,
    );
  }
}
