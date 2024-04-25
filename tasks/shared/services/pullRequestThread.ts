import {
  CommentThreadStatus,
  CommentType,
  GitPullRequestCommentThread,
} from 'azure-devops-node-api/interfaces/GitInterfaces'

import { AzureConnectionType } from '../models'

export const createPullRequestThreadService = async (
  { gitApi, repositoryId, pullRequest }: AzureConnectionType,
  comment: string
) => {
  const thread: GitPullRequestCommentThread = {
    comments: [
      {
        commentType: CommentType.Text,
        content: comment,
      },
    ],
    lastUpdatedDate: new Date(),
    publishedDate: new Date(),
    status: CommentThreadStatus.Closed,
  }
  const threadResponse = await gitApi.createThread(
    thread,
    repositoryId,
    pullRequest.pullRequestId
  )
  return threadResponse
}
