/**
 * Skill Extraction Engine — weighted multi-source evidence.
 *
 * Evidence weights per signal source:
 *   primary language  → 4  (GitHub sets this; highly reliable)
 *   topics            → 3  (developer curated)
 *   description       → 2  (developer written)
 *   repo name         → 1  (weakest signal; "docker-learning" ≠ Docker skill)
 *
 * Confidence = clamped weighted hits / (totalRepos * maxWeightPerRepo)
 */

export const ALIAS_MAP = {
  // JavaScript / Node ecosystem
  'react':               'React',
  'react.js':            'React',
  'reactjs':             'React',
  'react js':            'React',
  'react native':        'React Native',
  'react-native':        'React Native',
  'node':                'Node.js',
  'nodejs':              'Node.js',
  'node.js':             'Node.js',
  'node js':             'Node.js',
  'expressjs':           'Express',
  'express.js':          'Express',
  'express js':          'Express',
  'express':             'Express',
  'nextjs':              'Next.js',
  'next.js':             'Next.js',
  'next js':             'Next.js',
  'nuxtjs':              'Nuxt.js',
  'nuxt.js':             'Nuxt.js',
  'nuxt':                'Nuxt.js',
  'vue.js':              'Vue.js',
  'vuejs':               'Vue.js',
  'vue':                 'Vue.js',
  'nestjs':              'NestJS',
  'nest.js':             'NestJS',
  'fastify':             'Fastify',
  'fastifyjs':           'Fastify',
  'hapi':                'Hapi.js',
  'hapi.js':             'Hapi.js',
  'koa':                 'Koa.js',
  'koajs':               'Koa.js',
  'koa.js':              'Koa.js',
  'redux':               'Redux',
  'redux.js':            'Redux',
  'reduxjs':             'Redux',
  'vite':                'Vite',
  'vite.js':             'Vite',

  // TypeScript / JavaScript
  'ts':                  'TypeScript',
  'typescript':          'TypeScript',
  'js':                  'JavaScript',
  'javascript':          'JavaScript',
  'vanilla-js':          'JavaScript',
  'es6':                 'JavaScript',
  'es2015':              'JavaScript',

  // CSS frameworks & tools
  'tailwind':            'Tailwind CSS',
  'tailwindcss':         'Tailwind CSS',
  'tailwind css':        'Tailwind CSS',
  'bootstrap':           'Bootstrap',
  'bootstrap4':          'Bootstrap',
  'bootstrap5':          'Bootstrap',

  // Python & AI
  'py':                  'Python',
  'python':              'Python',
  'python3':             'Python',
  'fastapi':             'FastAPI',
  'flask':               'Flask',
  'django':              'Django',
  'tensorflow':          'TensorFlow',
  'pytorch':             'PyTorch',
  'keras':               'Keras',

  // Backend / Cloud / DB
  'java':                'Java',
  'spring-boot':         'Spring Boot',
  'springboot':          'Spring Boot',
  'spring':              'Spring Boot',
  'mysql':               'MySQL',
  'postgres':            'PostgreSQL',
  'postgresql':          'PostgreSQL',
  'mongodb':             'MongoDB',
  'mongo':               'MongoDB',
  'redis':               'Redis',
  'docker':              'Docker',
  'kubernetes':          'Kubernetes',
  'k8s':                 'Kubernetes',
  'aws':                 'AWS',
  'graphql':             'GraphQL',
  'rest-api':            'REST API',
  'ci-cd':               'CI/CD',
  'golang':              'Go',
  'go':                  'Go',
  'rust':                'Rust',
  'flutter':             'Flutter'
};

export const SKILL_MAP = {
  'Node.js':      { keywords: ['node', 'nodejs', 'node.js', 'express', 'fastify', 'koa', 'hapi', 'nestjs'], language: 'JavaScript' },
  'Express':      { keywords: ['express', 'expressjs'] },
  'React':        { keywords: ['react', 'reactjs', 'react.js', 'create-react-app', 'cra', 'vite'] },
  'Next.js':      { keywords: ['next', 'nextjs', 'next.js'] },
  'Vue.js':       { keywords: ['vue', 'vuejs', 'nuxt', 'nuxtjs'] },
  'Angular':      { keywords: ['angular', 'angularjs'] },
  'TypeScript':   { keywords: ['typescript'], language: 'TypeScript' },
  'JavaScript':   { keywords: ['javascript', 'vanilla-js', 'es6', 'es2015'], language: 'JavaScript' },
  'Python':       { keywords: ['python', 'flask', 'django', 'fastapi', 'uvicorn'], language: 'Python' },
  'TensorFlow':   { keywords: ['tensorflow', 'keras', 'ml', 'machine-learning', 'deep-learning', 'pytorch', 'scikit'] },
  'Java':         { keywords: ['java', 'maven', 'gradle'], language: 'Java' },
  'Spring Boot':  { keywords: ['spring-boot', 'springboot', 'spring'] },
  'MySQL':        { keywords: ['mysql', 'mariadb'] },
  'PostgreSQL':   { keywords: ['postgres', 'postgresql'], language: 'PLpgSQL' },
  'MongoDB':      { keywords: ['mongo', 'mongodb', 'mongoose'] },
  'Redis':        { keywords: ['redis'] },
  'Docker':       { keywords: ['docker', 'docker-compose', 'containerization', 'dockerfile'] },
  'Kubernetes':   { keywords: ['kubernetes', 'k8s', 'helm', 'kubectl'] },
  'AWS':          { keywords: ['aws', 's3', 'ec2', 'lambda', 'cloudfront', 'dynamodb', 'amplify'] },
  'GraphQL':      { keywords: ['graphql', 'apollo', 'gql'] },
  'REST API':     { keywords: ['rest-api', 'restful', 'openapi', 'swagger'] },
  'CI/CD':        { keywords: ['github-actions', 'jenkins', 'circleci', 'travis', 'ci-cd', 'pipeline'] },
  'Go':           { keywords: ['golang'], language: 'Go' },
  'Rust':         { keywords: ['rust', 'cargo'], language: 'Rust' },
  'PHP':          { keywords: ['php', 'laravel', 'symfony'], language: 'PHP' },
  'Ruby':         { keywords: ['ruby', 'rails', 'sinatra'], language: 'Ruby' },
  'Tailwind CSS': { keywords: ['tailwind', 'tailwindcss'] },
  'Bootstrap':    { keywords: ['bootstrap'] },
  'React Native': { keywords: ['react-native', 'expo', 'mobile'] },
  'Flutter':      { keywords: ['flutter', 'dart'], language: 'Dart' },
  'C':            { keywords: ['gnu-c'], language: 'C' },
  'C++':          { keywords: ['cpp'], language: 'C++' },
  'Shell':        { keywords: ['shell', 'bash', 'sh'], language: 'Shell' },
  'Perl':         { keywords: ['perl'], language: 'Perl' },
  'Assembly':     { keywords: ['assembly', 'asm'], language: 'Assembly' },
  'Makefile':     { keywords: ['makefile', 'cmake'], language: 'Makefile' },
};

const WEIGHTS = { language: 4, topics: 3, description: 2, name: 1 };
const MAX_WEIGHT_PER_REPO = Object.values(WEIGHTS).reduce((a, b) => a + b, 0); // 10

/**
 * Tokenizes text into lowercase words.
 */
function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase().replace(/[^a-z0-9-]/g, ' ').split(/\s+/).filter(Boolean);
}

/**
 * Extract skills from an array of repository objects.
 * @param {Array} repos
 * @returns {Array<{skill: string, confidence: number, supportingRepoCount: number, supportingRepos: string[]}>}
 */
const extractSkills = (repos) => {
  if (!repos || !repos.length) return [];

  const skillScores = {};
  const skillRepos = {};

  for (const repo of repos) {
    if (!repo) continue;
    const repoName = repo.name || repo.repoName || repo.repo_name || 'unknown';

    for (const [skill, def] of Object.entries(SKILL_MAP)) {
      let matched = false;

      // Signal: primary language (exact match, title-case safe)
      if (def.language && repo.language === def.language) {
        skillScores[skill] = (skillScores[skill] || 0) + WEIGHTS.language;
        matched = true;
      }

      // Signal: topics (developer-curated — high trust)
      const topicsList = Array.isArray(repo.topics)
        ? repo.topics
        : (typeof repo.topics === 'string' ? repo.topics.split(',') : []);
      if (topicsList.length) {
        const topicTokens = topicsList.map(t => (t || '').toLowerCase().trim());
        if (def.keywords.some(kw => topicTokens.includes(kw))) {
          skillScores[skill] = (skillScores[skill] || 0) + WEIGHTS.topics;
          matched = true;
        }
      }

      // Signal: description (developer-written — medium trust)
      if (repo.description) {
        const descTokens = tokenize(repo.description);
        if (def.keywords.some(kw => descTokens.includes(kw))) {
          skillScores[skill] = (skillScores[skill] || 0) + WEIGHTS.description;
          matched = true;
        }
      }

      // Signal: repo name (low trust)
      const nameStr = repo.name || repo.repoName || repo.repo_name;
      if (nameStr) {
        const nameTokens = tokenize(nameStr);
        if (def.keywords.some(kw => nameTokens.includes(kw))) {
          skillScores[skill] = (skillScores[skill] || 0) + WEIGHTS.name;
          matched = true;
        }
      }

      if (matched) {
        if (!skillRepos[skill]) skillRepos[skill] = new Set();
        skillRepos[skill].add(repoName);
      }
    }
  }

  const maxPossible = repos.length * MAX_WEIGHT_PER_REPO;

  return Object.entries(skillScores)
    .map(([skill, raw]) => {
      const supporting = Array.from(skillRepos[skill] || []);
      return {
        skill,
        confidence: Math.min(parseFloat((raw / maxPossible).toFixed(2)), 1.0),
        supportingRepoCount: supporting.length,
        supportingRepos: supporting
      };
    })
    .filter(s => s.confidence > 0)
    .sort((a, b) => {
      if (b.confidence !== a.confidence) return b.confidence - a.confidence;
      return a.skill.localeCompare(b.skill);
    });
};

export { extractSkills };
export default extractSkills;