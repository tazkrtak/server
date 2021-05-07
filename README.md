# Server

## Version Control Guidelines

### Commits Convention

The [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/)
should be followed using the following types:

| Type       | Related Changes                                               |
| :--------- | :------------------------------------------------------------ |
| `test`     | Adding or updating unit tests                                 |
| `feat`     | Introducing new feature                                       |
| `fix`      | Fixing a bug                                                  |
| `refactor` | Code change that neither fixes a bug nor adds a feature       |
| `ci`       | Updating GitHub Actions workflow or adding new one            |
| `chore`    | Changes not related to application code, like updating README |

### Merging Workflow

- The [GitHub Workflow](https://guides.github.com/introduction/flow/) should be followed.
- PRs should be [Squashed and Merged](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-request-merges#squash-and-merge-your-pull-request-commits) into master.
- It's preferred to enable auto merge on your PRs.

## Coding Guidelines

### Data Transfer Objects

DTO stands for Data Transfer Object, keep in mind that they're the interface to the Api.

1. Request DTO: Make sure you to receive exactly what you expect, no more or less.

2. Response DTO: Expose only the set of attributes needed from persistence entities.

#### Request DTOs' Data Structure

As we use [Prisma](https://www.prisma.io/), every model from Prisma schema is translated into a dedicated TypeScript type, so we can derive our DTOs from those types using [Utility Types feature](https://www.typescriptlang.org/docs/handbook/utility-types.html) in Typescript

Example

```typescript
import { User } from '@prisma/client';

export class LoginUserDto implements Pick<User, 'email' | 'password'> {}

export class RegisterUserDto implements Omit<User, 'id'> {}
```

#### Request DTOs' Validation Guidelines

- Annotate DTO class properties you want to validate with [class-validator decorators](https://github.com/typestack/class-validator#usage).
- Extend DTOs from each other when it's possible; to minimize duplication of boilerplate code used for validation.

Example

```typescript
import { IsString, Length, IsEmail, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

export class UserRegisterDto extends UserLoginDto {
  @IsString()
  @Length(10, 20) // match with database scheme
  name: string;

  @IsPhoneNumber()
  phone_number: string;
}
```

### [OpenApi (Swagger)](https://swagger.io/) Guidelines

1. Follow the convention `.*.dto.ts` for DTO **classes** so they can be recognized by Swagger.

2. Annotate controllers with `@ApiTags('CONTROLLER_NAME')` for better categorization.

3. Annotate controller methods with:

   - `@ApiOperation({ summary })` decorator describing the method's purpose.
   - Multiple `@ApiResponse({ status, description, type (if exist and not an exception response) })` decorators according to the possible responses.
   - `@ApiResponse({ status: HttpStatus, description: '[Response Description]' })` on all controller methods as we have a [Pipe](https://docs.nestjs.com/pipes) that validates all request bodies.
   - All Swagger decorators must be put after the HTTP request method decorator [e.g. `@Post()`]

Example

```typescript
    @Post()
    @ApiOperation({ summary: 'Creates a new user' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The user has been successfully created.',
        type: UserDto,
     })
    @ApiResponse({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'Validation Failed',
    })
    async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<UserDto>
```
