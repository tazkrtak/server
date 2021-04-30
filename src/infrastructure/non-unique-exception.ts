import { HttpException, HttpStatus } from '@nestjs/common';
import { IFieldValidationError } from './validation-exception';

export class NonUniqueException extends HttpException {
  constructor(public fields: string[]) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `Unique Constraint Failed`,
        validationErrors: fields.map((field) => {
          return {
            field: field,
            error: `${field} is already used`,
          } as IFieldValidationError;
        }),
      },
      HttpStatus.CONFLICT,
    );
  }
}
