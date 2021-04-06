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
