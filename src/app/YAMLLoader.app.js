const fs = require('fs');
const yaml = require('yamljs');

const makeYAMLLoader = () => (value, workdir) => {
  let content = value;
  const wd = workdir || '';

  if (/^([./]?.*)?(\/.*)?\.((yml)|(yaml))$/.test(value)) {
    try {
      content = fs.readFileSync(`${wd}${value}`, { encoding: 'utf8' });

      if (!content) {
        throw new Error(`yaml failed to parse content from the file '${value}' in '${wd}' folder because is undefined`);
      }
    } catch (error) {
      throw new Error(`yaml input failed to read the file '${value}' in '${wd}' folder: ${error}`);
    }
  }

  try {
    return yaml.parse(content);
  } catch (error) {
    throw new Error(`yaml input failed to parse YAML content: ${error}`);
  }
};

module.exports = { makeYAMLLoader };
