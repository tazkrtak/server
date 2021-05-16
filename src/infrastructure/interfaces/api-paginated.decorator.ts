import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationBody } from './pagination-body.interface';
import { PaginationResponse } from './pagination-response.interface';

/**
 * A decorator for paginated endpoints.
 * 
 * @param filter the filter used in `PaginationBody`
 * @param model the model used in `PaginationResponse`
 */
export const ApiPaginated = <TFilter extends Type, TModel extends Type>(
  filter: TFilter,
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(filter, model),
    ApiBody({
      schema: {
        title: 'PaginationBody',
        allOf: [
          { $ref: getSchemaPath(PaginationBody) },
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
        title: 'PaginationResponse',
        allOf: [
          { $ref: getSchemaPath(PaginationResponse) },
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
