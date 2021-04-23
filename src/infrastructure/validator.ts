import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Type,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

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
    });
    if (errorsDetails.length > 0) {
      const errors = errorsDetails.map((e) => {
        return {
          field: e.property,
          errors: Object.values(e.constraints),
        };
      });

      throw new BadRequestException(
        'Validation failed',
        JSON.stringify(errors),
      );
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
