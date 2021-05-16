import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedQuery } from './paginated-query';
import { PaginatedDto } from './paginated-dto';

/**
 * A decorator for paginated endpoints
 *
 * @param filter the filter used in `PaginatedQuery`
 * @param model the model used in `PaginatedDto`
 */
export const ApiPaginated = <TFilter extends Type, TModel extends Type>(
  filter: TFilter,
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(filter, model),
    ApiBody({
      schema: {
        title: 'PaginatedQuery',
        allOf: [
          { $ref: getSchemaPath(PaginatedQuery) },
          {
            properties: {
              filter: {
                $ref: getSchemaPath(filter),
              },
            },
          },
        ],
      },
    }),
    ApiOkResponse({
      schema: {
        title: 'PaginatedDto',
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
