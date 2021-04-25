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

### Request DTOs' Validation Guidelines

Annotate DTO class properties you want to validate with [class-validator decorators](https://github.com/typestack/class-validator#usage).

#### Example

```(typescript)
import {
  IsString,
  Length,
  IsEmail
} from 'class-validator';

export class FooRequestDto {
  @IsString()
  @Length(10, 20) // match with database scheme
  name: string;

  @IsEmail()
  email: string;
}
```

### [OpenApi (Swagger)](https://swagger.io/) Guidelines

1. Follow the convention `\*.dto.ts` for DTO classes so they can be recognized by Swagger.

2. Annotate controllers with @ApiTags('CONTROLLER_NAME') for better categorization.

3. Annotate controller methods with:

   - Multiple `@Api(Type)Response({ description })` decorators according to the possible responses.

   ```(typescript)
       @ApiCreatedResponse({ description: 'The user has been successfully created.' })
       @ApiBadRequestResponse({ description: 'Invalid Request.' })
       @Post()
       async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<UserDto>
   ```

   - `@ApiOperation({ summary })` decorator describing the method's purpose.

   ```(typescript)
       @ApiOperation({ summary: 'Creates a new user' })
   ```
