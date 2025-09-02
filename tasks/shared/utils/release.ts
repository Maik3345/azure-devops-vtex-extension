import { runCommand } from './runCommand'

/**
 * Generates a release change in the `manifest.json` file for the specified tag name
 * without pushing changes to git, deploying, or performing release checks.
 *
 * @param tagName - The name of the release tag to generate.
 * @returns A promise that resolves when the release process is complete.
 */
const makeRelease = async (tagName: string) => {
  await runCommand(
    `projex git release ${tagName} --yes --no-deploy --no-check-release`,
    '.',
    'generate release change in the manifest.json file without push to git',
    false,
    0,
    false,
    true
  )
}

/**
 * Creates a new release by generating a tag and updating relevant files.
 *
 * @param beta - Indicates whether the release is a beta version. If `true`, the release will not be tagged as 'stable'.
 * @returns A promise that resolves when the release process is complete.
 */
export const createRelease = async (beta: boolean) => {
  // TagName to use in the release
  const tagName = beta ? '' : 'stable'

  // Generate the release and push the changes to git, this execution change the manifest.json file and update the changelog file with the last commits
  return makeRelease(tagName)
}
