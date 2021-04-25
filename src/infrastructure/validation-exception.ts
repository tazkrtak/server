import { HttpException, HttpStatus } from '@nestjs/common';

export interface IFieldValidationError {
  field: string;
  error: string;
}

export class ValidationException extends HttpException {
  constructor(public validationErrors: IFieldValidationError[]) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation Failed',
        validationErrors,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
