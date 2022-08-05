class PullrequestService {
  #client;

  constructor(client) {
    if (!client) {
      throw new Error('client is required');
    }

    this.#client = client;
  }

  async getPullrequest(owner, repo, pullNumber) {
    if (!owner) {
      throw new Error('owner is required, can\'t be empty');
    }

    if (!repo) {
      throw new Error('repository is required, can\'t be empty');
    }

    if (!pullNumber) {
      throw new Error('number is required, can\'t be empty');
    }

    if (pullNumber <= 0) {
      throw new Error('\'number\' should be positive');
    }

    const response = await this.#client.request('GET /repos/{owner}/{repo}/pulls/{pullNumber}', {
      owner,
      repo,
      pullNumber,
    });
    if (response.status !== 200) {
      throw new Error(`get pull-request info return ${response.status} status`);
    }
    return response.data;
  }

  async getCommits(owner, repo, pullNumber) {
    if (!owner) {
      throw new Error('owner is required, can\'t be empty');
    }

    if (!repo) {
      throw new Error('repository is required, can\'t be empty');
    }

    if (!pullNumber) {
      throw new Error('number is required, can\'t be empty');
    }

    if (pullNumber <= 0) {
      throw new Error('\'number\' should be positive');
    }

    const response = await this.#client.request('GET /repos/{owner}/{repo}/pulls/{pullNumber}/commits', {
      owner,
      repo,
      pullNumber,
    });
    if (response.status !== 200) {
      throw new Error(`get pull-request' commits return ${response.status} status`);
    }
    return response.data;
  }
}

module.exports = PullrequestService;
