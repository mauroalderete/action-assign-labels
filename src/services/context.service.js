/**
 * Contains functions to handle github context
 * @module src/services/context.service
 */

/**
 * An method like {@link https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/ `fs.readerFileSync()`} sign. It must return a string content of the a source.
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
 * @returns {object} Github Action's context
 */

/**
 * Construct a function that allow get a Github Action's context from a source file.
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
