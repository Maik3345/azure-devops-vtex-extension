## Description

### `pullRequest/release`

This task works in the existing pull request only, this process merge the pull request to the target branch and create the release version with the tag, this process use the cli `projex` to create the release with the command `projex git release`, to determine the type of release the task use the pull request title to determine the type of release, the title must have the following format: `[minor]`, `[major]` or `[patch]`.
