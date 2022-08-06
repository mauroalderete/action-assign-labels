/* eslint-disable no-unused-vars */
const fs = require('fs');
const core = require('@actions/core');

const { Octokit } = require('@octokit/action');
const BoolActionInput = require('./actionInputs/boolActionInput');
const IntegerActionInput = require('./actionInputs/integerActionInput');
const StringActionInput = require('./actionInputs/stringActionInput');
const YAMLActionInput = require('./actionInputs/YAMLActionInput');
const PullrequestService = require('./services/pullrequest.service');
const concom = require('./conventionalCommits/conventionalCommits');
const AssignLabelsApp = require('./app/assignlabels.app');

const inputPullRequestNumber = 'pull-request-number';
const inputGithubToken = 'github-token';
const inputMaintainLabelsNotFound = 'maintain-labels-not-matched';
const inputApplyChanges = 'apply-changes';
const inputConventionalCommits = 'conventional-commits';

const validEvents = ['pull_request'];

async function main() {
  try {
    core.setOutput('labels-before-update', '');
    core.setOutput('labels-assigned', '');
    core.setOutput('labels-removed', '');
    core.setOutput('labels-current', '');
    core.setOutput('action-message', '');
    core.setOutput('action-status', 'STARTED');

    const githubToken = new StringActionInput(
      core.getInput(inputGithubToken),
      { id: inputGithubToken },
    );
    const maintainLabelsNotFound = new BoolActionInput(
      core.getInput(inputMaintainLabelsNotFound),
      { id: inputMaintainLabelsNotFound },
    );
    const applyChanges = new BoolActionInput(
      core.getInput(inputApplyChanges),
      { id: inputApplyChanges },
    );
    const conventionalCommits = new YAMLActionInput(
      core.getInput(inputConventionalCommits),
      { id: inputConventionalCommits },
    );

    let pullrequestNumber;
    if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
      const contextStream = fs.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' });
      if (!contextStream) {
        throw new Error('failed to load context');
      }
      const context = JSON.parse(contextStream);
      pullrequestNumber = context.pull_request.number;
    } else {
      const tmpPullRequestNumber = new IntegerActionInput(
        core.getInput(inputPullRequestNumber),
        { id: inputPullRequestNumber },
      );
      pullrequestNumber = tmpPullRequestNumber.value;
    }

    process.env.GITHUB_TOKEN = githubToken.value;
    const octokit = new Octokit();
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

    core.setOutput('action-status', 'VALIDATED');
    let assignLabelsApp;
    try {
      assignLabelsApp = new AssignLabelsApp(
        octokit,
        {
          owner,
          repo,
          number: pullrequestNumber,
        },
        {
          conventionalCommitsScheme: conventionalCommits.value,
          maintainLabelsNotFound: maintainLabelsNotFound.value,
          applyChanges: applyChanges.value,
        },
      );
    } catch (error) {
      throw new Error(`failed to try instance assign labels process: ${error}`);
    }

    let result;
    try {
      result = await assignLabelsApp.exec();
    } catch (error) {
      throw new Error(`failed to execute assign labels process: ${error}`);
    }

    core.setOutput('action-status', 'PARSED');

    const [previous, added, removed, current] = result;

    core.setOutput('labels-before-update', previous);
    core.setOutput('labels-assigned', added);
    core.setOutput('labels-removed', removed);
    core.setOutput('labels-current', current);
    core.setOutput('action-message', '');
    core.setOutput('action-status', 'ENDED');
  } catch (error) {
    core.setOutput('action-message', error.message);
    core.setFailed(error.message);
  }
}

main();
