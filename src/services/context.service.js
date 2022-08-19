/**
 * Contains functions to handle github context.
 * @module src/services/context.service
 */

/**
 * An method like {@link https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/ `fs.readerFileSync()`} sign. It must return a string content of a source.
 * @callback readerSyncFunc
 * @param {string} path It takes the relative path of the text file.
 * The path can be of URL type. The file can also be a file descriptor.
 * If both the files are in the same folder just give the filename in quotes.
 * @param {object} [options] It is an optional parameter which contains the encoding and flag,
 * the encoding contains data specification.
 * It’s default value is null which returns raw buffer and
 * the flag contains indication of operations in the file. It’s default value is ‘r’
 * @param {string} [options.encoding] The encoding contains data specification, for example 'utf8'
 */

/**
 * Get a Github Action's context from a source file.
 * @callback getContextFunc
 * @param {path} path - Path to the source file.
 * @returns {actionContext} Github Action's context
 */

/**
 * Construct a function that allows getting a Github Action's context from a source file.
 * @param {readerSyncFunc} readerSync - A readerSync function
 * @returns {getContextFunc} Getter Github Action's context function
 */
module.exports.makeContexter = (readerSync) => (path) => {
  try {
    const context = readerSync(path, { encoding: 'utf8' });
    return JSON.parse(context);
  } catch (error) {
    throw new Error(`failed to load context: ${error}`);
  }
};

/**
 * @typedef {object} actionContext
 * @property {string} token
 * @property {string} job
 * @property {string} ref
 * @property {string} sha
 * @property {string} repository
 * @property {string} repository_owner
 * @property {string} repositoryUrl
 * @property {string} run_id
 * @property {string} run_number
 * @property {string} retention_days
 * @property {string} run_attempt
 * @property {string} actor
 * @property {string} workflow
 * @property {string} head_ref
 * @property {string} base_ref
 * @property {string} event_name
 * @property {string} server_url
 * @property {string} api_url
 * @property {string} graphql_url
 * @property {string} ref_name
 * @property {boolean} ref_protected
 * @property {string} ref_type
 * @property {string} secret_source
 * @property {string} workspace
 * @property {string} action
 * @property {string} event_path
 * @property {string} action_repository
 * @property {string} action_ref
 * @property {string} path
 * @property {string} env
 */
