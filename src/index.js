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
    console.log('main: start');
    core.setOutput('labels-before-update', '');
    core.setOutput('labels-assigned', '');
    core.setOutput('labels-removed', '');
    core.setOutput('labels-current', '');
    core.setOutput('action-message', '');
    core.setOutput('action-status', 'STARTED');

    console.log('main: 1');
    const githubToken = new StringActionInput(
      core.getInput(inputGithubToken),
      { id: inputGithubToken },
    );
    const maintainLabelsNotFound = new BoolActionInput(
      core.getInput(inputMaintainLabelsNotFound),
      { id: inputMaintainLabelsNotFound },
    );
    console.log('main: 2');
    const applyChanges = new BoolActionInput(
      core.getInput(inputApplyChanges),
      { id: inputApplyChanges },
    );
    const conventionalCommits = new YAMLActionInput(
      core.getInput(inputConventionalCommits),
      { id: inputConventionalCommits },
    );

    console.log('main: 3');
    let pullrequestNumber;
    if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
      const context = fs.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' });
      console.log('context: ', context);
      console.log('NUMBER1: ', context.number);
      console.log('NUMBER2: ', context.pull_request.number);
      pullrequestNumber = context.pull_request.number;
      console.log('finNUMBER: ', pullrequestNumber);
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
    console.log('main: antes');
    console.log('main: number', pullrequestNumber);
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
          maintainLabelsNotFound,
          applyChanges,
        },
      );
    } catch (error) {
      throw new Error(`failed to try instance assign labels process: ${error}`);
    }

    console.log('main: app end');

    let result;
    try {
      result = await assignLabelsApp.exec();
    } catch (error) {
      throw new Error(`failed to execute assign labels process: ${error}`);
    }

    console.log('main: result end');
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
