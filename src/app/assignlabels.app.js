const concom = require('../conventionalCommits/conventionalCommits');
const labellerController = require('../labellerController/labellerController');
const PullrequestService = require('../services/pullrequest.service');

class AssignLabelsApp {
  #githubClient;

  #pullrequestConfig;

  #inputs;

  constructor(githubClient, pullrequestConfig, inputs) {
    if (!githubClient) {
      throw new Error('githubClient is required');
    }

    if (!pullrequestConfig) {
      throw new Error('pullrequestConfig is required');
    }

    if (!inputs) {
      throw new Error('inputs is required');
    }

    this.#githubClient = githubClient;
    this.#pullrequestConfig = pullrequestConfig;
    this.#inputs = inputs;
  }

  async exec() {
    const pullrequestService = new PullrequestService(this.#githubClient);

    console.log('app::exec: prconfig', this.#pullrequestConfig);

    const pullrequest = await pullrequestService.getPullrequest(
      this.#pullrequestConfig.owner,
      this.#pullrequestConfig.repo,
      this.#pullrequestConfig.number,
    );

    const labelsBefore = pullrequest.labels;
    const labelsBeforeName = labelsBefore.map((l) => l.name);

    const commits = await pullrequestService.getCommits(
      this.#pullrequestConfig.owner,
      this.#pullrequestConfig.repo,
      this.#pullrequestConfig.number,
    );

    const types = concom.getTypesInCommits(
      commits.map((c) => c.commit.message),
      this.#inputs.conventionalCommitsScheme,
    );

    const labelsToChange = types.map((t) => t.labels).reduce((tp, tc) => tp.concat(tc));

    const result = labellerController.changeLabels(
      labelsBeforeName,
      labelsToChange,
      {
        maintainLabelsNotFound: this.#inputs.maintainLabelsNotFound,
        conventionalCommitsScheme: this.#inputs.conventionalCommitsScheme,
      },
    );

    const [next, added, removed] = result;

    if (this.#inputs.applyChanges) {
      pullrequestService.setLabels(
        this.#pullrequestConfig.owner,
        this.#pullrequestConfig.repo,
        this.#pullrequestConfig.number,
        next,
      );
    }

    return [labelsBeforeName, added, removed, next];
  }
}

module.exports = AssignLabelsApp;
