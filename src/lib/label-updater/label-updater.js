/**
 * Contains functions to handle the changes labels
 * @module src/lib/label-updater
 */

const parser = require('../parser/parser');

/**
 * Update a current list labels with the items includes in the other list labels
 * according to a conventional-commits scheme and maintainLabel flag.
 * <p>The conventional-commits scheme is required to identify the labels that
 * must be considereds to update. Any label that isn't in the scheme will ignored.</p>
 * The maintainLabel flag is used to determine
 * if a label of the current list that isn't in the update list must to remove or conserved.
 * @param {string[]} current List of current 'labels' that may be changed.
 * @param {string[]} changeBy List of new labels with which will update the list current labels.
 * @param {labelsConfig} config See {@link labelsConfig `labelsConfig`}
 * @returns {labelsChanged} See {@link labelsChanged `labelsChanged`}
 */
module.exports.changeLabels = (current, changeBy, config) => {
  try {
    parser(current).denyUndefined().denyNull();
  } catch (error) {
    throw new Error(`failed to validate currentLabels: ${error}`);
  }

  try {
    parser(changeBy).denyUndefined().denyNull();
  } catch (error) {
    throw new Error(`failed to validate changeByLabels: ${error}`);
  }

  try {
    // eslint-disable-next-line no-param-reassign
    config.maintainLabelsNotFound = parser(config.maintainLabelsNotFound)
      .denyUndefined()
      .denyNull()
      .toBool().value;
    parser(config.conventionalCommitsScheme).denyUndefined().denyNull();
  } catch (error) {
    throw new Error(`failed to parse configuration: ${error}`);
  }

  const next = current;
  const added = [];
  const removed = [];

  changeBy.forEach((l) => {
    if (!next.includes(l)) {
      next.push(l);
      added.push(l);
    }
  });

  if (!config.maintainLabelsNotFound) {
    const labelsConfigured = config.conventionalCommitsScheme['conventional-commits'].map((cc) => cc.labels).reduce((lp, lc) => lp.concat(lc));
    labelsConfigured.filter(
      (lc) => current.includes(lc) && !changeBy.includes(lc),
    ).forEach((toRemove) => {
      removed.push(toRemove);
    });

    removed.forEach((r) => {
      const index = next.indexOf(r);
      next.splice(index, 1);
    });
  }

  return [next, added, removed];
};

/**
 * @typedef {object} labelsConfig
 * @property {object[]} conventional_commits
 * @property {string} conventional_commits.type
 * @property {string[]} conventional_commits.nouns
 * @property {string[]} conventional_commits.labels
 * @property {boolean} maintainLabelsNotFound
 */

/**
 * @typedef {Array} labelsChanged
 * @property {string[]} next - Contains the new labels list with all changes applied.
 * @property {string[]} added - Is a list with all labels added to the old list.
 * @property {string[]} removed - Is a list with all labels removed from the old list.
 */
