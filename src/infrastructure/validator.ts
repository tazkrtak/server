import { PipeTransform, ArgumentMetadata, Type } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  IFieldValidationError,
  ValidationException,
} from './validation-exception';

export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errorsDetails = await validate(object, {
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    });
    if (errorsDetails.length > 0) {
      const errors = errorsDetails.map((e) => {
        return {
          field: e.property,
          error: Object.values(e.constraints)[0],
        } as IFieldValidationError;
      });

      throw new ValidationException(errors);
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
