/**
 * Maps raw GitHub API profile data into the internal
 * profile structure used by the application.
 */
const mapGitHubProfile = (raw) => ({
  login: raw.login,
  name: raw.name || null,
  bio: raw.bio || null,
  location: raw.location || null,
  email: raw.email || null,
  blog: raw.blog || null,
  company: raw.company || null,

  public_repos: raw.public_repos ?? 0,
  followers: raw.followers ?? 0,
  following: raw.following ?? 0,

  avatar_url: raw.avatar_url || null,
  html_url: raw.html_url || null,
  created_at: raw.created_at || null,
});

/**
 * Maps raw GitHub repository data into the internal
 * repository structure used by the application.
 */
const mapGitHubRepo = (raw) => ({
  name: raw.name,

  description: raw.description || null,

  language: raw.language || null,

  stars: raw.stargazers_count ?? 0,

  forks: raw.forks_count ?? 0,

  watchers: raw.watchers_count ?? 0,

  size_kb: raw.size ?? 0,

  // Updated later if README detection is performed.
  has_readme: false,

  topics: Array.isArray(raw.topics)
    ? raw.topics
    : [],

  html_url: raw.html_url || null,

  homepage: raw.homepage || null,

  is_fork: Boolean(raw.fork),

  pushed_at: raw.pushed_at || null,
});

export {
  mapGitHubProfile,
  mapGitHubRepo,
};