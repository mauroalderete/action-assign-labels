/* eslint-disable class-methods-use-this */
const fs = require('fs');
const yaml = require('yamljs');
const StringActionInput = require('./stringActionInput');

class YAMLActionInput extends StringActionInput {
  #source;

  #value;

  constructor(value) {
    super(value);

    this.#validate(value);
    this.#parse(value);
  }

  get source() {
    return this.#source;
  }

  get sourceFile() {
    return this.#source.file;
  }

  get sourceContent() {
    return this.#source.content;
  }

  get value() {
    return this.#value;
  }

  #validate(value) {
    if (value.trim() === '') {
      throw new Error("yaml input can't be empty");
    }
  }

  #parse(value) {
    if (/^([./]?.*)?(\/.*)?\.((yml)|(yaml))$/.test(value)) {
      const workdir = process.env.GITHUB_EVENT_PATH ?? '';

      try {
        const content = fs.readFileSync(`${workdir}${value}`, { encoding: 'utf8' });

        if (!content) {
          throw new Error(`Content fo the file '${value}' int '${workdir}' folder is undefined`);
        }

        this.#source = {
          file: value,
          content,
        };
      } catch (error) {
        throw new Error(`Failed to read the file '${value}' in '${workdir}' folder: ${error}`);
      }
    } else {
      this.#source = {
        file: null,
        content: value,
      };
    }

    try {
      this.#value = yaml.parse(this.#source.content);
    } catch (error) {
      throw new Error(`Failed to parse YAML content: ${error}`);
    }
  }
}

module.exports = YAMLActionInput;
