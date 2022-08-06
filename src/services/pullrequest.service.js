class PullrequestService {
  #client;

  constructor(client) {
    if (!client) {
      throw new Error('client is required');
    }

    this.#client = client;
  }

  static validatePullrequestConfig(owner, repo, pullNumber) {
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
  }

  async getPullrequest(owner, repo, pullNumber) {
    PullrequestService.validatePullrequestConfig(owner, repo, pullNumber);

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
    PullrequestService.validatePullrequestConfig(owner, repo, pullNumber);

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

  async setLabels(owner, repo, pullNumber, labels) {
    PullrequestService.validatePullrequestConfig(owner, repo, pullNumber);

    if (!labels) {
      throw new Error('labels is required, can\'t be empty');
    }

    if (!Array.isArray(labels)) {
      throw new Error('labels should be a string array');
    }

    const response = await this.#client.request('PUT /repos/{owner}/{repo}/issues/{pullNumber}/labels', {
      owner,
      repo,
      pullNumber,
      labels,
    });
    if (response.status !== 200) {
      throw new Error(`set labels failed with ${response.status} status`);
    }
    return response.data;
  }
}

module.exports = PullrequestService;
