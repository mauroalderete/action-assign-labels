/* eslint-disable class-methods-use-this */
const fs = require('fs');
const yaml = require('yamljs');
const StringActionInput = require('./stringActionInput');

class YAMLActionInput extends StringActionInput {
  #source;

  #value;

  #config;

  constructor(value, config) {
    super(value, config);

    this.#config = super.config;

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
      throw new Error(`yaml input ${this.#config.id} can't be empty`);
    }
  }

  #parse(value) {
    if (/^([./]?.*)?(\/.*)?\.((yml)|(yaml))$/.test(value)) {
      const workdir = process.env.GITHUB_EVENT_PATH ?? '';

      try {
        const content = fs.readFileSync(`${workdir}${value}`, { encoding: 'utf8' });

        if (!content) {
          throw new Error(`yaml input ${this.#config.id} failed to parse content from the file '${value}' in '${workdir}' folder because is undefined`);
        }

        this.#source = {
          file: value,
          content,
        };
      } catch (error) {
        throw new Error(`yaml input ${this.#config.id} failed to read the file '${value}' in '${workdir}' folder: ${error}`);
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
      throw new Error(`yaml input ${this.#config.id} failed to parse YAML content: ${error}`);
    }
  }
}

module.exports = YAMLActionInput;
