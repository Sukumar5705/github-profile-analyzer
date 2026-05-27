const analyzeRepositories = (repos) => {
  let totalStars = 0;
  let totalForks = 0;

  const languages = {};

  repos.forEach((repo) => {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;

    if (repo.language) {
      languages[repo.language] =
        (languages[repo.language] || 0) + 1;
    }
  });

  /*
  ========================================
  FIND MOST USED LANGUAGE
  ========================================
  */

  let mostUsedLanguage = "Unknown";
  let maxCount = 0;

  for (const language in languages) {
    if (languages[language] > maxCount) {
      maxCount = languages[language];
      mostUsedLanguage = language;
    }
  }

  return {
    totalStars,
    totalForks,
    mostUsedLanguage
  };
};

module.exports = analyzeRepositories;