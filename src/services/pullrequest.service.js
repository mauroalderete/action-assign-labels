const makePullRequestService = (githubClient) => ({
  getPullrequest: async (owner, repository, pullRequestNumber) => {
    const response = await githubClient.request('GET /repos/{owner}/{repository}/pulls/{pullRequestNumber}', {
      owner,
      repository,
      pullRequestNumber,
    });
    if (response.status !== 200) {
      throw new Error(`get pull-request info return ${response.status} status`);
    }
    return response.data;
  },

  getCommits: async (owner, repository, pullRequestNumber) => {
    const response = await githubClient.request('GET /repos/{owner}/{repository}/pulls/{pullRequestNumber}/commits', {
      owner,
      repository,
      pullRequestNumber,
    });
    if (response.status !== 200) {
      throw new Error(`get pull-request' commits return ${response.status} status`);
    }
    return response.data;
  },

  setLabels: async (owner, repository, pullRequestNumber, labels) => {
    const response = await githubClient.request('PUT /repos/{owner}/{repository}/issues/{pullRequestNumber}/labels', {
      owner,
      repository,
      pullRequestNumber,
      labels,
    });
    if (response.status !== 200) {
      throw new Error(`set labels failed with ${response.status} status`);
    }
    return response.data;
  },
});

module.exports = { makePullRequestService };
