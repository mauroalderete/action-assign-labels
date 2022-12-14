/**
 * Contains functions to handle conventional commits parse.
 * @module src/lib/convnetional-commits
 */

/**
 * Take identify the commits type into a list of the commits
 * according to a conventional-commits scheme.
 * @param {string[]} commitMessages A list with the commits to parse.
 * Each item in the list correspond with a single commits,
 * no matter if its content is multiline or not.
 * @param {conventionalCommitsType} conventionalCommitsScheme
 * See {@link conventionalCommitsType `conventionalCommitsType`}
 * @returns {string[]} A list with the conventional-commits types,
 * defined in the conventional-commits scheme, is recognized in the commits list.
 *
 * If there aren't any matches the list returned will is empty.
 */
module.exports.getTypesInCommits = (commitMessages, conventionalCommitsScheme) => {
  if (typeof commitMessages !== 'string' && !Array.isArray(commitMessages)) {
    throw new Error('commitMessage must be a string or Array of string');
  }

  if (!conventionalCommitsScheme) {
    throw new Error('conventionalCommitsScheme is required');
  }

  const commits = (typeof commitMessages === 'string') ? [commitMessages] : commitMessages;

  const typesRecognized = [];

  commits.forEach((c) => {
    /**
     * Regexp recovery from {@link https://www.npmjs.com/package/conventional-commits-parser}
     */
    const header = /^([\w\s]*)(?:\(([\w$.\-* ]*)\))?: (.*)$/m;

    const matched = header.exec(c);
    if (matched) {
      const noun = matched[1];
      const type = conventionalCommitsScheme['conventional-commits'].find((cc) => cc.nouns.includes(noun));

      if (type) {
        if (!typesRecognized.includes(type)) {
          typesRecognized.push(type);
        }
      }
    }
  });

  return typesRecognized;
};

/** @typedef {object} conventionalCommitsType
 * @property {object[]} conventional-commits Object, A conventional commits scheme.
 * @property {string} conventional-commits.type `string` Type of conventional-commit rule
 * @property {string[]} conventional-commits.nouns
 * `string[]` List of the nouns used as prefixes for the commit message
 * and identify a conventional-commit type
 * @property {string[]} conventional-commits.labels
 * `string[]` List of the labels that match with a conventional-commit type.
 */
