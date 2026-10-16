/**
 * test_pipeline.js
 *
 * Synthetic test suite for verifying the Evidence Extraction, Prompt Generation,
 * Response Validation, and Mapper Adaptation stages of the refactored architecture.
 */

import { normalizeRepositories } from './src/evidence/repositoryNormalizer.js';
import { extractTechnologySignals } from './src/evidence/technologySignalExtractor.js';
import { extractSkillSignals } from './src/evidence/skillSignalExtractor.js';
import { buildProjectFactSheet } from './src/evidence/projectFactSheet.js';
import { buildProfileEvidence } from './src/evidence/profileEvidence.js';
import { buildEvidence } from './src/evidence/evidenceBuilder.js';
import { buildMasterAnalysisPrompt } from './src/prompts/masterAnalysis.prompt.js';
import { validateAndSanitizeAnalysis, AnalysisValidationError } from './src/validation/analysisValidator.js';
import { toAnalysisRecord } from './src/mappers/llmAnalysisToAnalysisRecord.mapper.js';
import { mapProfileAnalysisResponse } from './src/mappers/profileAnalysis.mapper.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

// ── Mock Data ─────────────────────────────────────────────────────────────
const mockProfile = {
  username: 'octocat-engineer',
  name: 'Alex Developer',
  bio: 'Building scalable distributed systems & full-stack web applications',
  company: 'TechCorp',
  blog: 'https://alexdev.io',
  location: 'San Francisco, CA',
  followers: 120,
  following: 45,
  public_repos: 4,
  created_at: '2021-01-15T10:00:00Z'
};

const mockRepos = [
  {
    name: 'ecommerce-microservices-api',
    description: 'Scalable microservices backend with Docker, Redis caching, and Jest testing',
    language: 'JavaScript',
    stars: 35,
    forks: 8,
    watchers: 35,
    size_kb: 4500,
    has_readme: true,
    homepage: 'https://api.ecommerce.example.com',
    topics: ['nodejs', 'express', 'docker', 'redis', 'jest', 'microservice', 'jwt'],
    pushed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2023-03-01T12:00:00Z',
    is_fork: false
  },
  {
    name: 'developer-portfolio-v3',
    description: 'Modern frontend interface built with React and Tailwind CSS',
    language: 'TypeScript',
    stars: 12,
    forks: 2,
    watchers: 12,
    size_kb: 1800,
    has_readme: true,
    homepage: 'https://portfolio.alexdev.io',
    topics: ['react', 'typescript', 'tailwind', 'vite', 'frontend'],
    pushed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2024-01-10T12:00:00Z',
    is_fork: false
  },
  {
    name: 'python-data-pipeline',
    description: 'Automated data ingestion with PostgreSQL and Docker',
    language: 'Python',
    stars: 5,
    forks: 1,
    watchers: 5,
    size_kb: 3200,
    has_readme: true,
    homepage: null,
    topics: ['python', 'postgres', 'docker', 'github-actions'],
    pushed_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2023-08-20T12:00:00Z',
    is_fork: false
  },
  {
    name: 'upstream-library-fork',
    description: 'Personal fork of popular logging tool',
    language: 'JavaScript',
    stars: 2,
    forks: 0,
    watchers: 2,
    size_kb: 800,
    has_readme: true,
    homepage: null,
    topics: [],
    pushed_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2022-05-10T12:00:00Z',
    is_fork: true
  }
];

console.log('\n=== RUNNING BACKEND PIPELINE UNIT VERIFICATION ===\n');

// ── Test 1: Repository Normalizer ──────────────────────────────────────────
console.log('1. Testing repositoryNormalizer.js');
const normalized = normalizeRepositories(mockRepos);
assert(normalized.length === 4, 'Normalized exact count of 4 repos');
assert(normalized[0].name === 'ecommerce-microservices-api', 'Correct repo name preserved');
assert(normalized[0].hasReadme === true, 'README flag correctly extracted');
assert(normalized[0].tokenizedText.includes('docker'), 'Tokenized search set includes "docker"');
assert(normalized[0].tokenizedText.includes('microservices'), 'Tokenized set includes "microservices"');

// ── Test 2: Technology Signal Extractor ────────────────────────────────────
console.log('\n2. Testing technologySignalExtractor.js');
const signals = extractTechnologySignals(normalized);
assert(signals.aggregate.dockerRepoCount >= 2, 'Detected Docker across >= 2 repos');
assert(signals.aggregate.testingRepoCount >= 1, 'Detected Testing across >= 1 repo');
assert(signals.aggregate.ciCdRepoCount >= 1, 'Detected CI/CD across >= 1 repo');
assert(signals.perRepo[0].signals.testing === true, 'Per-repo signal correctly flagged testing for microservices');

// ── Test 3: Skill Signal Extractor ─────────────────────────────────────────
console.log('\n3. Testing skillSignalExtractor.js');
const extractedSkills = extractSkillSignals(normalized);
assert(extractedSkills.length > 0, 'Extracted non-empty skills array');
const nodeSkill = extractedSkills.find(s => s.skill === 'Node.js');
assert(Boolean(nodeSkill), 'Canonicalized and extracted Node.js skill');
if (nodeSkill) {
  assert(nodeSkill.supportingRepoCount > 0, 'Node.js has supporting repository count');
  assert(nodeSkill.confidence > 0, 'Node.js has positive confidence score');
}

// ── Test 4: Project Fact Sheet & Profile Evidence ──────────────────────────
console.log('\n4. Testing projectFactSheet.js & profileEvidence.js');
const factSheet = buildProjectFactSheet(normalized, signals);
assert(factSheet.length === 4, 'Compiled fact sheet for all repositories');
assert(factSheet[0].isFork === false, 'First project in fact sheet is an original project (not a fork)');

const profileEv = buildProfileEvidence(mockProfile, normalized);
assert(profileEv.username === 'octocat-engineer', 'Profile evidence preserves username');
assert(profileEv.followers === 120, 'Followers correctly recorded');
assert(profileEv.ownRepoCount === 3, 'Calculated own repos = 3');
assert(profileEv.forkCount === 1, 'Calculated forks = 1');

// ── Test 5: Master Evidence Builder ────────────────────────────────────────
console.log('\n5. Testing master evidenceBuilder.js');
const evidence = buildEvidence(mockProfile, mockRepos);
assert(Boolean(evidence.profile), 'Master evidence contains profile block');
assert(Array.isArray(evidence.skills), 'Master evidence contains skills array');
assert(Boolean(evidence.technologySignals), 'Master evidence contains technology signals');
assert(Array.isArray(evidence.projects), 'Master evidence contains projects array');

// ── Test 6: Prompt Builder ────────────────────────────────────────────────
console.log('\n6. Testing masterAnalysis.prompt.js');
const prompt = buildMasterAnalysisPrompt(evidence);
assert(typeof prompt === 'string' && prompt.length > 500, 'Master prompt generated with high factual density');
assert(prompt.includes('octocat-engineer'), 'Prompt contains candidate username');
assert(prompt.includes('ecommerce-microservices-api'), 'Prompt contains repository facts');
assert(prompt.includes('OUTPUT CONSTRAINTS'), 'Prompt contains JSON output constraints');

// ── Test 7: Analysis Response Validator ───────────────────────────────────
console.log('\n7. Testing analysisValidator.js');
const mockLLMOutput = {
  developerType: {
    developerType: 'Full Stack Developer',
    confidence: 0.85,
    reasons: ['Strong backend microservice evidence', 'Modern React & TypeScript UI exposure']
  },
  careerScore: {
    score: 74,
    breakdown: {
      documentation: 16,
      diversity: 14,
      deployment: 14,
      techBreadth: 12,
      activity: 12,
      openSource: 6
    },
    label: 'Strong'
  },
  executiveSummary: 'Alex is a capable full-stack developer with demonstrable experience building containerized Node.js services and TypeScript web applications.',
  strengths: ['Multi-service architecture awareness', 'Containerization with Docker', 'Consistent documentation'],
  weaknesses: ['Limited automated test coverage on frontend', 'Low open source star traction'],
  hiringRecommendation: 'Strong Hire for Mid-Level Full Stack Role',
  recruiterSummary: 'Alex presents a balanced engineering profile with demonstrable full-stack capabilities, clean docs, and live deployment experience.',
  resumeEvidence: {
    backend: {
      claim: 'Backend & Microservices',
      evidence: ['Built scalable Node.js/Express API with Redis caching and Docker containerization']
    },
    frontend: {
      claim: 'Frontend Development',
      evidence: ['Developed responsive UI with React, TypeScript, and Tailwind CSS']
    }
  },
  topProjects: [
    {
      repoName: 'ecommerce-microservices-api',
      score: 88,
      breakdown: { stars: 20, readme: 20, description: 15, activity: 15, size: 18 },
      language: 'JavaScript',
      stars: 35,
      repoUrl: 'https://github.com/octocat-engineer/ecommerce-microservices-api'
    }
  ],
  portfolioShowcase: {
    resumeProject: {
      repoName: 'ecommerce-microservices-api',
      repoUrl: 'https://github.com/octocat-engineer/ecommerce-microservices-api',
      language: 'JavaScript',
      stars: 35,
      reason: 'Best demonstration of backend architecture, caching, and containerization.',
      score: 88
    },
    technicalProject: {
      repoName: 'ecommerce-microservices-api',
      repoUrl: 'https://github.com/octocat-engineer/ecommerce-microservices-api',
      language: 'JavaScript',
      stars: 35,
      reason: 'Combines microservice architecture, Redis caching, and automated testing.',
      score: 88
    },
    recruiterProject: {
      repoName: 'developer-portfolio-v3',
      repoUrl: 'https://github.com/octocat-engineer/developer-portfolio-v3',
      language: 'TypeScript',
      stars: 12,
      reason: 'Polished live web interface showcasing modern frontend stack.',
      score: 80
    },
    architectureProject: {
      repoName: 'ecommerce-microservices-api',
      repoUrl: 'https://github.com/octocat-engineer/ecommerce-microservices-api',
      language: 'JavaScript',
      stars: 35,
      reason: 'Features modular microservice architecture and container integration.',
      score: 88
    }
  },
  portfolioGaps: [
    { area: 'Cloud Deployment', severity: 'medium', advice: 'Deploy backend microservices to AWS or Railway with a public URL.' },
    { area: 'Testing', severity: 'high', advice: 'Expand unit test coverage across frontend components.' }
  ],
  recommendations: [
    { priority: 'high', recommendation: 'Set up end-to-end GitHub Actions CI/CD pipeline.' }
  ],
  learningRoadmap: {
    month1: { focus: 'Advanced Testing & CI/CD', tasks: ['Add integration tests', 'Configure GitHub Actions'] },
    month2: { focus: 'Cloud Infrastructure', tasks: ['Deploy containerized stack to AWS ECS', 'Set up CloudWatch logs'] },
    month3: { focus: 'Open Source & System Design', tasks: ['Publish npm package', 'Document system design architecture'] },
    goal: 'Advance to Senior Full Stack Engineer level with production-grade cloud deployment mastery.'
  }
};

const validated = validateAndSanitizeAnalysis(mockLLMOutput, evidence);
assert(validated.careerScore.score === 74, 'Validated career score matches');
assert(validated.developerType.developerType === 'Full Stack Developer', 'Validated developer type matches');
assert(validated.topProjects.length === 1, 'Validated top projects list');
assert(Boolean(validated.portfolioShowcase.resumeProject), 'Validated portfolio showcase');

// Test validation error throwing on corrupt payload
let threwError = false;
try {
  validateAndSanitizeAnalysis({ corrupt: 'incomplete data' });
} catch (e) {
  if (e instanceof AnalysisValidationError) {
    threwError = true;
  }
}
assert(threwError, 'Validator successfully caught and threw AnalysisValidationError on corrupt schema');

// ── Test 8: Record Mapper Adaptation ──────────────────────────────────────
console.log('\n8. Testing llmAnalysisToAnalysisRecord.mapper.js');
const dbRecord = toAnalysisRecord(validated, evidence);
assert(dbRecord.careerScore.score === 74, 'DB Record contains career score');
assert(dbRecord.totalStars === 54, 'DB Record calculated total stars across own repos');
assert(dbRecord.executiveSummary.length > 20, 'DB Record includes executive summary');
assert(dbRecord.recruiter.strengths.length === 3, 'DB Record adapts strengths for legacy recruiter shape');
assert(dbRecord.gaps.gaps.length === 2, 'DB Record adapts gaps for legacy shape');

// ── Test 9: Profile Analysis Response Mapper ──────────────────────────────
console.log('\n9. Testing profileAnalysis.mapper.js');
const mockDbRow = {
  career_score: dbRecord.careerScore.score,
  score_documentation: dbRecord.careerScore.breakdown.documentation,
  score_diversity: dbRecord.careerScore.breakdown.diversity,
  score_deployment: dbRecord.careerScore.breakdown.deployment,
  score_tech_breadth: dbRecord.careerScore.breakdown.techBreadth,
  score_activity: dbRecord.careerScore.breakdown.activity,
  score_open_source: dbRecord.careerScore.breakdown.openSource,
  developer_type: dbRecord.developerType.developerType,
  developer_confidence: dbRecord.developerType.confidence,
  developer_reasons: JSON.stringify(dbRecord.developerType.reasons),
  strengths: JSON.stringify(dbRecord.recruiter.strengths),
  concerns: JSON.stringify(dbRecord.recruiter.concerns),
  highlights: JSON.stringify(dbRecord.recruiter.highlights),
  gaps: JSON.stringify(dbRecord.gaps.gaps),
  recommendations: JSON.stringify(dbRecord.recommendations),
  top_projects: JSON.stringify(dbRecord.topProjects),
  executive_summary: dbRecord.executiveSummary,
  hiring_recommendation: dbRecord.hiringRecommendation,
  recruiter_summary: dbRecord.recruiterSummary,
  resume_evidence: JSON.stringify(dbRecord.resumeEvidence),
  portfolio_showcase: JSON.stringify(dbRecord.portfolioShowcase),
  learning_roadmap: JSON.stringify(dbRecord.learningRoadmap)
};

const apiResponse = mapProfileAnalysisResponse({
  profile: mockProfile,
  skills: extractedSkills,
  analysis: mockDbRow,
  repositories: mockRepos
});

assert(apiResponse.careerScore.score === 74, 'API response mapper preserved careerScore.score');
assert(apiResponse.developerType.developerType === 'Full Stack Developer', 'API response mapper preserved developerType');
assert(apiResponse.executiveSummary === dbRecord.executiveSummary, 'API response mapper exposed executiveSummary');
assert(Boolean(apiResponse.portfolioShowcase.resumeProject), 'API response mapper exposed portfolioShowcase');
assert(Boolean(apiResponse.learningRoadmap.month1), 'API response mapper exposed learningRoadmap');

console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL ARCHITECTURAL COMPONENTS PASSED VERIFICATION!\n');
}
