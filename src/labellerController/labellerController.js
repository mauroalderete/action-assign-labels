const labellerController = {
  changeLabels(current, changeBy, config) {
    try {
      this.validateLabelsList(current);
    } catch (error) {
      throw new Error(`failed to validate currentLabels: ${error}`);
    }

    try {
      this.validateLabelsList(changeBy);
    } catch (error) {
      throw new Error(`failed to validate changeByLabels: ${error}`);
    }

    try {
      this.validateConfig(config);
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
        if (index !== -1) {
          next.splice(index, 1);
        }
      });
    }

    return [next, added, removed];
  },

  validateLabelsList(labels) {
    if (!labels) {
      throw new Error('is required');
    }

    if (!Array.isArray(labels)) {
      throw new Error('should be a string array with labels');
    }
  },

  validateConfig(config) {
    if (!config) {
      throw new Error('config is required');
    }

    if (config.maintainLabelsNotFound === undefined || config.maintainLabelsNotFound === null) {
      throw new Error('field maintainLabelsNotFound in config is required');
    }

    if (typeof config.maintainLabelsNotFound !== 'boolean') {
      throw new Error(`field maintainLabelsNotFound with value '${config.maintainLabelsNotFound}' should be a boolean data type`);
    }

    if (!config.conventionalCommitsScheme) {
      throw new Error('field conventionalCommitsScheme in config is required');
    }
  },
};

module.exports = labellerController;
