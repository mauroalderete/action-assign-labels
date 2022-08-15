const parser = require('../parser/parser');

function changeLabels(current, changeBy, config) {
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
}

module.exports = { changeLabels };
