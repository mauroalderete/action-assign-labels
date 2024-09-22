/**
 * It contains a single function that manages the resources to run the assignment of the labels.
 * @module src/app/app
 */

import fs from 'fs';

import * as core from '@actions/core';
import { Octokit } from '@octokit/action';

import makeAssignerLabelsApp from './assigner-labels.app.js';
import makeInputLoader from './input-loader.app.js';
import { makeYAMLLoader } from '../lib/yaml-loader/yaml-loader.js';
import { changeLabels } from '../lib/label-updater/label-updater.js';
import { getTypesInCommits } from '../lib/conventional-commits/conventional-commits.js';
import makePullRequestService from '../services/pullrequest.service.js';
import makeContexter from '../services/context.service.js';
import { ActionStatus } from '../lib/action-status/action-status.js';

/**
 * Instances all dependencies needed to execute the assignment of the labels.
 * Verifies the availability of the context and recovers it.
 * Initializes output and handles the action state.
 *
 * @async
 * @return {void}
 */
export default async () => {
  const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);

  try {
    core.setOutput('labels-previous', '');
    core.setOutput('labels-assigned', '');
    core.setOutput('labels-removed', '');
    core.setOutput('labels-next', '');
    core.setOutput('action-message', '');

    actionStatus.status = 'LOAD_DEPENDENCIES';

    const yamlLoader = makeYAMLLoader(fs.readFileSync);

    const loadInput = makeInputLoader(
      core.getInput,
      core.getBooleanInput,
      yamlLoader,
    );

    const assignLabels = makeAssignerLabelsApp(
      loadInput,
      changeLabels,
      getTypesInCommits,
      Octokit,
      makePullRequestService,
    );

    actionStatus.status = 'LOAD_CONTEXT';
    const context = makeContexter(fs.readFileSync)(process.env.GITHUB_EVENT_PATH);

    actionStatus.status = 'PARSE_AND_ASSIGN';
    const result = await assignLabels(context);

    actionStatus.status = 'OUTPUT';
    const [previous, added, removed, current] = result;

    actionStatus.status = 'END';

    actionStatus.summaryConsole({
      'labels-previous': previous,
      'labels-assigned': added,
      'labels-removed': removed,
      'labels-next': current,
    });

    actionStatus.summaryAction({
      'labels-previous': previous,
      'labels-assigned': added,
      'labels-removed': removed,
      'labels-next': current,
    });

    core.setOutput('labels-previous', previous);
    core.setOutput('labels-assigned', added);
    core.setOutput('labels-removed', removed);
    core.setOutput('labels-next', current);
    core.setOutput('action-message', '');
    core.setOutput('action-status', 'END');
  } catch (error) {
    actionStatus.message = error.message;
    actionStatus.summaryConsole();
    actionStatus.summaryAction();
    throw new Error(`action failed: ${error}`);
  }
};
