export interface PullRequestCommentsType {
  count: 50
  value: {
    commitId: string
    author: {
      name: string
      email: string
      date: string
    }
    committer: {
      name: string
      email: string
      date: string
    }
    comment: string
    url: string
  }[]
}
