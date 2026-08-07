/**
 * technologySignalExtractor.js
 *
 * Stage 2 of the Evidence Extraction Pipeline.
 * Extracts objective keyword and technical presence signals across all repositories.
 * Does NOT make qualitative judgments, assign scores, or invent advice strings.
 */

export const SIGNAL_DEFINITIONS = {
  testing: {
    label: 'Testing & QA',
    keywords: ['test', 'tests', 'jest', 'mocha', 'chai', 'vitest', 'pytest', 'junit', 'spec', 'specs', 'coverage', 'cypress', 'playwright', 'selenium']
  },
  docker: {
    label: 'Docker & Containerization',
    keywords: ['docker', 'dockerfile', 'docker-compose', 'container', 'containers', 'containerization']
  },
  ciCd: {
    label: 'CI/CD & Automation',
    keywords: ['github-actions', 'circleci', 'jenkins', 'travis', 'ci-cd', 'pipeline', 'pipelines', 'workflow', 'workflows', 'gitlab-ci']
  },
  cloudDeployment: {
    label: 'Cloud & Deployment',
    keywords: ['aws', 'gcp', 'azure', 'vercel', 'netlify', 'render', 'heroku', 'railway', 'production', 'deploy', 'deployment', 'serverless', 'lambda', 'cloudflare']
  },
  authentication: {
    label: 'Authentication & Security',
    keywords: ['auth', 'jwt', 'oauth', 'passport', 'login', 'session', 'firebase', 'clerk', 'auth0', 'cognito', 'token', 'security']
  },
  systemDesign: {
    label: 'System Design & Distributed Systems',
    keywords: ['microservice', 'microservices', 'queue', 'kafka', 'rabbitmq', 'event-driven', 'distributed', 'architecture', 'pubsub', 'grpc', 'load-balancer', 'saga', 'cqrs']
  },
  apiDocumentation: {
    label: 'API Documentation & Contracts',
    keywords: ['swagger', 'openapi', 'postman', 'apidoc', 'redoc', 'graphql']
  },
  database: {
    label: 'Database & Data Storage',
    keywords: ['database', 'sql', 'postgres', 'postgresql', 'mysql', 'mariadb', 'mongodb', 'redis', 'sqlite', 'dynamodb', 'prisma', 'typeorm', 'mongoose', 'sequelize', 'sqlalchemy']
  },
  aiMl: {
    label: 'AI / Machine Learning',
    keywords: ['machine-learning', 'deep-learning', 'tensorflow', 'pytorch', 'keras', 'scikit', 'nlp', 'llm', 'langchain', 'huggingface', 'neural', 'openai', 'gemini', 'transformers']
  },
  mobile: {
    label: 'Mobile Development',
    keywords: ['react-native', 'flutter', 'android', 'ios', 'swift', 'kotlin', 'expo', 'dart']
  },
  websockets: {
    label: 'Realtime / WebSockets',
    keywords: ['websocket', 'websockets', 'socketio', 'socket.io', 'realtime', 'real-time', 'sse']
  }
};

/**
 * Extracts factual technology signals from normalized repositories.
 * @param {Array<object>} enrichedRepos - Normalized repository list from repositoryNormalizer.js
 * @returns {object} { perRepo: Array, aggregate: object }
 */
export function extractTechnologySignals(enrichedRepos = []) {
  if (!Array.isArray(enrichedRepos) || !enrichedRepos.length) {
    return {
      perRepo: [],
      aggregate: Object.keys(SIGNAL_DEFINITIONS).reduce((acc, key) => {
        acc[`${key}RepoCount`] = 0;
        return acc;
      }, { totalAnalyzedRepos: 0, totalStars: 0, reposWithReadmeCount: 0, reposWithHomepageCount: 0 })
    };
  }

  const perRepo = [];
  const counts = Object.keys(SIGNAL_DEFINITIONS).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  let totalStars = 0;
  let reposWithReadmeCount = 0;
  let reposWithHomepageCount = 0;

  for (const repo of enrichedRepos) {
    totalStars += (repo.stars || 0);
    if (repo.hasReadme) reposWithReadmeCount++;
    if (repo.hasHomepage) reposWithHomepageCount++;

    const tokenSet = new Set(repo.tokenizedText || []);
    const signals = {};
    const matchedKeywords = [];

    for (const [key, def] of Object.entries(SIGNAL_DEFINITIONS)) {
      const matched = def.keywords.filter(kw => tokenSet.has(kw));
      const hasSignal = matched.length > 0;
      signals[key] = hasSignal;

      if (hasSignal) {
        counts[key]++;
        matchedKeywords.push(...matched);
      }
    }

    perRepo.push({
      repoName: repo.name,
      signals,
      matchedKeywords: Array.from(new Set(matchedKeywords)),
      stars: repo.stars || 0,
      hasReadme: repo.hasReadme,
      hasHomepage: repo.hasHomepage,
      language: repo.language || null
    });
  }

  const aggregate = {
    totalAnalyzedRepos: enrichedRepos.length,
    totalStars,
    reposWithReadmeCount,
    reposWithHomepageCount,
    ...Object.entries(counts).reduce((acc, [key, count]) => {
      acc[`${key}RepoCount`] = count;
      return acc;
    }, {})
  };

  return {
    perRepo,
    aggregate
  };
}

export default {
  SIGNAL_DEFINITIONS,
  extractTechnologySignals
};
