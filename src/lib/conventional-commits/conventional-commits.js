function getTypesInCommits(commitMessages, conventionalCommitsScheme) {
  if (typeof commitMessages !== 'string' && !Array.isArray(commitMessages)) {
    throw new Error('commitMessage must be a string or Array of string');
  }

  if (!conventionalCommitsScheme) {
    throw new Error('conventionalCommitsScheme is required');
  }

  const commits = (typeof commitMessages === 'string') ? [commitMessages] : commitMessages;

  const typesRecognized = [];

  commits.forEach((c) => {
    const header = /^([\w\s]*)(?:\(([\w$.\-* ]*)\))?: (.*)$/;

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
}

module.exports = { getTypesInCommits };
