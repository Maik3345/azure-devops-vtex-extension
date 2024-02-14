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
export const DEVELOP_TARGET_REF_BRANCH = 'refs/heads/develop'
