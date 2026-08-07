/**
 * repoIntelligence.service.js
 *
 * Phase 3 — Repository Intelligence Builder
 * Summarizes every repository objectively into factual intelligence sheets.
 * Collects architectural patterns, technical features, deployment signals,
 * documentation levels, complexity, and community impact without subjective quality scoring.
 */

import { normalizeRepository } from '../evidence/repositoryNormalizer.js';

// Objective architecture signal indicators
const ARCHITECTURE_RULES = [
  { signal: 'Kernel / Operating System', match: /\b(kernel|operating[\s_-]?system|os|bootloader|firmware|hypervisor)\b/i },
  { signal: 'Memory Management / Systems', match: /\b(memory|allocator|gc|garbage[\s_-]?collector|virtual[\s_-]?memory|paging|dma)\b/i },
  { signal: 'Drivers / Low-Level', match: /\b(driver|device[\s_-]?driver|pci|usb|i2c|spi|embedded|hardware|microcontroller)\b/i },
  { signal: 'Compiler / Interpreter / AST', match: /\b(compiler|interpreter|parser|ast|lexer|transpiler|bytecode|vm|jit|llvm)\b/i },
  { signal: 'Distributed Systems / Consensus', match: /\b(distributed|consensus|raft|paxos|kafka|grpc|rpc|cluster|load[\s_-]?balancer)\b/i },
  { signal: 'Microservices / Backend API', match: /\b(microservice|api|backend|rest|graphql|server|express|fastapi|spring|django|nest)\b/i },
  { signal: 'Cloud Native / Infrastructure', match: /\b(kubernetes|k8s|docker|terraform|ansible|helm|aws|gcp|azure|devops|ci[\s_-]?cd)\b/i },
  { signal: 'Machine Learning / AI Pipeline', match: /\b(machine[\s_-]?learning|deep[\s_-]?learning|neural|transformer|llm|pytorch|tensorflow|onnx|rag|nlp|computer[\s_-]?vision)\b/i },
  { signal: 'Security / Cryptography', match: /\b(security|cryptography|crypto|cipher|auth|jwt|oauth|ssl|tls|vulnerability|exploit)\b/i },
  { signal: 'Database / Storage Engine', match: /\b(database|storage[\s_-]?engine|sql|nosql|postgres|redis|mongodb|btree|lsm|indexing)\b/i },
  { signal: 'Frontend UI / Web Application', match: /\b(frontend|ui|react|nextjs|vue|angular|svelte|tailwind|html|css|web[\s_-]?app)\b/i },
  { signal: 'CLI Tool / Developer Utility', match: /\b(cli|terminal|command[\s_-]?line|utility|tool|devtools|script)\b/i },
  { signal: 'Library / SDK / Framework', match: /\b(library|sdk|framework|module|package|crate|gem|npm[\s_-]?package)\b/i },
  { signal: 'Game Development / Graphics', match: /\b(game|graphics|opengl|vulkan|directx|webgl|shaders|rendering|physics[\s_-]?engine)\b/i }
];

// Objective technical feature indicators
const FEATURE_RULES = [
  { feature: 'Scheduler & Concurrency', match: /\b(scheduler|concurrency|multithreading|async|coroutine|thread[\s_-]?pool|mutex|lock|semaphore)\b/i },
  { feature: 'Filesystem & Storage', match: /\b(filesystem|ext4|btrfs|zfs|vfs|storage|blob|disk|io|block[\s_-]?device)\b/i },
  { feature: 'Networking & Protocols', match: /\b(networking|tcp|udp|http|http2|http3|websocket|socket|ip|packet|routing)\b/i },
  { feature: 'Virtual Memory & Paging', match: /\b(virtual[\s_-]?memory|mmu|paging|swap|address[\s_-]?space|page[\s_-]?table)\b/i },
  { feature: 'Containerization & Isolation', match: /\b(docker|container|cgroup|namespace|chroot|sandbox|wasm|containerd)\b/i },
  { feature: 'CI/CD Automation', match: /\b(github[\s_-]?actions|gitlab[\s_-]?ci|travis|jenkins|workflow|automation)\b/i },
  { feature: 'Automated Testing', match: /\b(test|unit[\s_-]?test|e2e|integration[\s_-]?test|pytest|jest|mocha|cypress)\b/i },
  { feature: 'Authentication & Authorization', match: /\b(auth|authentication|rbac|oauth|jwt|session|permission)\b/i },
  { feature: 'Caching & State Management', match: /\b(cache|caching|redis|memcached|redux|zustand|state[\s_-]?management)\b/i },
  { feature: 'Data Processing & ETL', match: /\b(etl|pipeline|stream|streaming|spark|flink|batch|ingestion|analytics)\b/i }
];

/**
 * Objective complexity rating based on codebase size, systems architecture, and features.
 */
function inferComplexity(repo, architectureSignals) {
  const sizeKb = repo.sizeKb || 0;
  const isSystemsOrKernel = architectureSignals.some(s =>
    s.includes('Kernel') || s.includes('Low-Level') || s.includes('Compiler') || s.includes('Distributed')
  );

  if (isSystemsOrKernel || sizeKb > 50000) return 'Extremely High';
  if (sizeKb > 5000 || architectureSignals.length >= 3) return 'High';
  if (sizeKb > 500 || architectureSignals.length >= 1) return 'Moderate';
  return 'Standard';
}

/**
 * Objective community impact based on real public engagement metrics.
 */
function inferCommunityImpact(stars, forks) {
  if (stars >= 5000 || forks >= 1000) return 'Exceptional';
  if (stars >= 1000 || forks >= 200) return 'Very High';
  if (stars >= 100 || forks >= 30) return 'High';
  if (stars >= 10 || forks >= 5) return 'Notable';
  if (stars >= 1) return 'Emerging';
  return 'Personal / Niche';
}

/**
 * Objective deployment detection.
 */
function inferDeployment(repo, allText) {
  const deployments = [];
  if (repo.hasHomepage) deployments.push('Live Production / Demo Site');
  if (/\b(docker|dockerfile|docker-compose)\b/i.test(allText)) deployments.push('Docker / Container');
  if (/\b(k8s|kubernetes|helm)\b/i.test(allText)) deployments.push('Kubernetes');
  if (/\b(github-actions|workflow|ci\/cd|vercel|netlify|render|railway|aws|heroku)\b/i.test(allText)) deployments.push('CI/CD Pipeline');
  return deployments.length ? deployments.join(', ') : 'Local / Library';
}

/**
 * Objective documentation assessment.
 */
function inferDocumentation(repo) {
  if (!repo.hasReadme) return 'None';
  if (repo.sizeKb > 100 && repo.hasHomepage) return 'Comprehensive with Live Docs';
  if (repo.description && repo.description.length > 30) return 'Structured README with Description';
  return 'Standard README';
}

/**
 * Summarizes a raw or normalized repository into an objective intelligence record.
 * @param {object} rawRepo
 * @param {number} [now=Date.now()]
 * @returns {object} Objective repository intelligence
 */
export function buildRepoIntelligence(rawRepo, now = Date.now()) {
  const repo = normalizeRepository(rawRepo, now);
  if (!repo) return null;

  const allText = [
    repo.name,
    repo.description || '',
    repo.homepage || '',
    ...(repo.topics || [])
  ].join(' ');

  // Identify architecture signals
  const architecture = ARCHITECTURE_RULES
    .filter(rule => rule.match.test(allText))
    .map(rule => rule.signal);

  // Identify interesting technical features
  const interestingFeatures = FEATURE_RULES
    .filter(rule => rule.match.test(allText))
    .map(rule => rule.feature);

  // Collect languages
  const languages = repo.language ? [repo.language] : [];

  const complexity = inferComplexity(repo, architecture);
  const communityImpact = inferCommunityImpact(repo.stars, repo.forks);
  const deployment = inferDeployment(repo, allText);
  const documentation = inferDocumentation(repo);

  return {
    name: repo.name,
    repository: repo.name,
    purpose: repo.description || 'Software repository',
    description: repo.description,
    languages,
    stars: repo.stars,
    forks: repo.forks,
    watchers: repo.watchers,
    sizeKb: repo.sizeKb,
    architecture: architecture.length ? architecture : ['General Software Engineering'],
    interestingFeatures: interestingFeatures.length ? interestingFeatures : ['Core Logic Implementation'],
    deployment,
    documentation,
    complexity,
    communityImpact,
    topics: repo.topics || [],
    isFork: repo.isFork,
    daysSinceLastPush: repo.daysSinceLastPush,
    createdAt: repo.createdAt,
    pushedAt: repo.pushedAt,
    htmlUrl: repo.htmlUrl,
    homepage: repo.homepage
  };
}

/**
 * Builds intelligence summaries for an array of repositories.
 * @param {Array<object>} rawRepos
 * @param {number} [now=Date.now()]
 * @returns {Array<object>}
 */
export function buildAllRepoIntelligence(rawRepos = [], now = Date.now()) {
  if (!Array.isArray(rawRepos)) return [];
  return rawRepos
    .map(r => buildRepoIntelligence(r, now))
    .filter(Boolean);
}

export default {
  buildRepoIntelligence,
  buildAllRepoIntelligence
};
