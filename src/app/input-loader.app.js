/**
 * Expose a function to handle inputs value configured into the action yaml
 * @module src/app/input-loader.app
 */

const parser = require('../lib/parser/parser');

// eslint-disable-next-line no-unused-vars
const concom = require('../lib/conventional-commits/conventional-commits');
// eslint-disable-next-line no-unused-vars
const yamlLoader = require('../lib/yaml-loader/yaml-loader');

/**
 * Construct a {@link inputLoaderFunc `inputLoaderFunc`} function
 * to get, to validate and to transform the inputs defined into action yaml
 * @param {stringInputFunc} stringInput Callback to get strings inputs.
 * See {@link stringInputFunc `stringInputFunc`}
 * @param {booleanInputFunc} booleanInput Callback to get boolean inputs.
 * See {@link booleanInputFunc `booleanInputFunc`}
 * @param {yamlLoader.yamlLoaderFunc} YAMLLoader Callback to parse a yaml object.
 * See {@link yamlLoader.yamlLoaderFunc `yamlLoaderFunc`}
 * @returns {inputLoaderFunc}
 */
module.exports.makeInputLoader = (
  stringInput,
  booleanInput,
  YAMLLoader,
) => () => {
  try {
    let pullRequestNumber = stringInput('pull-request-number');
    pullRequestNumber = parser(pullRequestNumber).toInt().use((p) => {
      if (p.value < 0) {
        throw new Error(`value ${p.value} of the pull-request-number must be a positive number`);
      }
    }).value;

    const githubToken = stringInput('github-token', { required: true });
    const maintainLabelsNotFound = booleanInput('maintain-labels-not-matched');
    const applyChanges = booleanInput('apply-changes');
    let conventionalCommits = stringInput('conventional-commits');
    conventionalCommits = parser(conventionalCommits).use((p) => {
      try {
        // eslint-disable-next-line no-param-reassign
        p.value = YAMLLoader(p.value);
      } catch (error) {
        throw new Error(`failed to parse yaml from ${p.value} :${error}`);
      }
    }).denyUndefined().denyNull().value;

    return {
      pullRequestNumber,
      githubToken,
      maintainLabelsNotFound,
      applyChanges,
      conventionalCommits,
    };
  } catch (error) {
    throw new Error(`failed to load inputs: ${error}`);
  }
};

/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 * @callback stringInputFunc
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */

/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 * @callback booleanInputFunc
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */

/**
 * Allows to get, to validate and to parse all inputs defined in action yaml.
 * Return a {@link inputs `inputs`} object with all input values treated.
 * Otherwise, it trigger an exception.
 * @callback inputLoaderFunc
 * @return {inputs} See {@link inputs `inputs`}
 */

/**
 * Contains all inputs defined in action yaml.
 * @typedef {object} inputs
 * @property {number} pullRequestNumber The pull request's number where labels will be assigned
 * @property {string} githubToken The Github token.
 * @property {boolean} maintainLabelsNotFound You should keep the conventional commit tags
 * assigned to the pull-request, even though they are no longer referenced within commits.
 * @property {boolean} applyChanges
 * Should will be executing the action and save any change to the repository.
 * @property {concom.conventionalCommitsType} conventionalCommits A conventional-commits scheme.
 * See {@link concom.conventionalCommitsType `conventionalCommitsType`}
 */
