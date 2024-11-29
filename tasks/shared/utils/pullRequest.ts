import { AzureConnectionType } from '../models'
import { getAllPullRequestCommitsService } from '../services/commitInformation'

/**
 * The function `getPullRequestCommits` retrieves all the commits in the current pull request and
 * returns them as a string.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It represents the connection to the Azure DevOps service.
 * @returns a string that represents the comments of all the commits in the current pull request.
 */
export const getPullRequestCommits = async (
  azureConnection: AzureConnectionType
) => {
  const commits = await getAllPullRequestCommitsService(azureConnection)
  const commitsInString =
    commits && commits.value && commits.value.length
      ? commits.value
          .map((item) => `${item.commitId} ${item.comment}`)
          .join('\n')
      : ''
  console.log(
    `Commits in the current pull request: ${JSON.stringify(commitsInString)}`
  )
  return commitsInString
}
