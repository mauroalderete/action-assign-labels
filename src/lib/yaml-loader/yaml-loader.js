/**
 * Expose {@link makeYAMLLoader `makeYAMLLoader`}
 * a function that makes a parser yaml to javascript object
 * @module src/lib/yaml-loader
 */
const yamljs = require('yamljs');

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
 * Parses a yaml object or a yaml file into a javascript json.
 *
 * The function expects to receive a yaml object or a yaml filename with a yaml object defined.
 *
 * If the yaml parameter is a filename, the function combines it
 * with the path passed to access the filer and get its content.
 *
 * If the yaml parameter is a string,
 * the function expects to find in this string a yaml object defined.
 *
 * In both cases, it will try to parse and return a javascript object.
 * @callback yamlLoaderFunc
 * @param {string} yaml A filename with a path or a yaml object.
 * @returns {Object} A javascript object that represents the yaml object parsed.
 */

/**
 * Use the readerSync callback to construct an instance of a function
 * that allows to parsing a yaml object into a javascript object.
 * @param {readerSyncFunc} readerSync - A readerSync function
 * @returns {yamlLoaderFunc}
 */
module.exports.makeYAMLLoader = (readerSync) => (yaml) => {
  let content = yaml;

  if (/^([./]?.*)?(\/.*)?\.((yml)|(yaml))$/.test(yaml)) {
    try {
      content = readerSync(yaml, { encoding: 'utf8' });
    } catch (error) {
      throw new Error(`failed to parse yaml content from the file '${yaml}': ${error}`);
    }
  }

  try {
    const res = yamljs.parse(content);
    if (res === undefined || res === null) {
      throw new Error('content is null');
    }
    return res;
  } catch (error) {
    throw new Error(`yaml input failed to parse YAML content: ${error}`);
  }
};
