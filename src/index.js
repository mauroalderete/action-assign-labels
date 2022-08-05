/* eslint-disable no-unused-vars */
const fs = require('fs');
const core = require('@actions/core');

const { Octokit } = require('@octokit/action');
const BoolActionInput = require('./actionInputs/boolActionInput');
const IntegerActionInput = require('./actionInputs/integerActionInput');
const StringActionInput = require('./actionInputs/stringActionInput');
const YAMLActionInput = require('./actionInputs/YAMLActionInput');
const PullrequestService = require('./services/pullrequest.service');

const inputPullRequestNumber = 'pull-request-number';
const inputGithubToken = 'github-token';
const inputCleanLabels = 'clear-all-labels-to-start';
const inputRemoveLabelsNotFound = 'maintain-labels-not-matched';
const inputApplyChanges = 'apply-changes';
const inputConventionalCommits = 'conventional-commits';

const validEvents = ['pull_request'];

async function main() {
  try {
    core.setOutput('labels-before-update', '');
    core.setOutput('labels-added', '');
    core.setOutput('labels-removed', '');
    core.setOutput('labels-after-update', '');
    core.setOutput('action-status', 'STARTED');
    core.setOutput('action-message', '');

    const pullRequestNumber = new IntegerActionInput(
      core.getInput(inputPullRequestNumber),
      { id: inputPullRequestNumber },
    );
    const githubToken = new StringActionInput(
      core.getInput(inputGithubToken),
      { id: inputGithubToken },
    );
    const cleanLabels = new BoolActionInput(
      core.getInput(inputCleanLabels),
      { id: inputCleanLabels },
    );
    const removeLabelsNotFound = new BoolActionInput(
      core.getInput(inputRemoveLabelsNotFound),
      { id: inputRemoveLabelsNotFound },
    );
    const ApplyChanges = new BoolActionInput(
      core.getInput(inputApplyChanges),
      { id: inputApplyChanges },
    );
    const conventionalCommits = new YAMLActionInput(
      core.getInput(inputConventionalCommits),
      { id: inputConventionalCommits },
    );

    core.setOutput('action-status', 'VALIDATED');

    const { eventName } = process.env.GITHUB_EVENT_NAME;
    const context = (() => fs.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }))();

    if (pullRequestNumber.value === 0) {
      if (eventName === 'pull_request') {
        pullRequestNumber.value = context.pull_request.number;
      } else {
        throw new Error(`The current event '${eventName}' need a valid pull_request_number`);
      }
    }

    process.env.GITHUB_TOKEN = githubToken.value;
    const octokit = new Octokit();
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const pullrequestService = new PullrequestService(octokit);

    const pullrequest = await pullrequestService.getPullrequest(
      owner,
      repo,
      pullRequestNumber.value,
    );

    const labelsBefore = pullrequest.labels;
    const labelsBeforeName = labelsBefore.map((l) => l.name);
    core.setOutput('labels-before-update', labelsBeforeName);

    // get commits

    const commits = await pullrequestService.getCommits(
      owner,
      repo,
      pullRequestNumber.value,
    );
    console.log(commits);

    const types = conventionalCommits.value.map((cc) => cc.type);

    // scan commits
    // commits.forEach((c) => {
    //   const header = /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/;
    //   const [type, scope, body] = header.exec(c.commit.message);
    //   if ( types.includes(type) )
    // });

    core.setOutput('action-status', 'PARSED');

    core.setOutput('action-status', 'ENDED');
  } catch (error) {
    core.setOutput('action-message', error.message);
    core.setFailed(error.message);
  }
}

main();
