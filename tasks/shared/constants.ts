export enum ReleaseType {
  minor = 'minor',
  patch = 'patch',
  major = 'major',
  changed = 'changed',
  prerelease = 'prerelease',
}

export enum ChangelogSection {
  added = 'Added',
  changed = 'Changed',
  fixed = 'Fixed',
  major = 'Major',
}

export const CHANGELOG_FILE_NAME = 'CHANGELOG.md'
export const PUBLISH_DEFAULT_COMMAND =
  'projex vtex run "vtex publish --yes --force"'
export const DEPLOY_DEFAULT_COMMAND = 'projex vtex run "vtex deploy --force"'
