/**
 * masterAnalysis.prompt.js
 *
 * Phase 5 — AI Recruiter Evaluation Prompt
 * LLM acts as Senior Staff Engineer, Engineering Manager, Technical Recruiter,
 * and Hiring Committee Member. Evaluates technical depth, architecture,
 * specialization, scale, and real-world engineering without simplistic heuristics.
 */

/**
 * Builds the comprehensive AI Recruiter prompt from the unified portfolio context.
 * @param {object} portfolioContext - Output from portfolioContext.service.js
 * @returns {string} Highly structured, token-efficient prompt
 */
export function buildMasterAnalysisPrompt(portfolioContext) {
  const { profile, repositories, selectedRepositories, otherRepositories, languageStatistics, activityStatistics, communityMetrics, skills } = portfolioContext;

  // The balanced, README-enriched set chosen by the two-phase selection
  // pipeline (repoSelection.js) — falls back to a plain top-10 slice if
  // that pipeline wasn't run (e.g. an older caller still using this
  // function directly against a bare repositories[] list).
  const topRepos = (selectedRepositories && selectedRepositories.length)
    ? selectedRepositories
    : (repositories || []).slice(0, 10);

  const reposSummary = topRepos.map((r, idx) => `
Repo #${idx + 1}: ${r.name}${r.isFork ? ' [FORK]' : ' [ORIGINAL]'}
- Purpose: ${r.purpose || r.description || 'N/A'}
- Primary Language: ${r.languages?.join(', ') || 'N/A'} | Stars: ${r.stars} | Forks: ${r.forks} | Size: ${r.sizeKb}KB
- Architecture: ${(r.architecture || []).join(', ')}
- Technical Features: ${(r.interestingFeatures || []).join(', ')}
- Deployment: ${r.deployment || 'None'} | Documentation: ${r.documentation || 'N/A'}
- README Excerpt: ${r.readmeExcerpt ? r.readmeExcerpt.slice(0, 500).replace(/\s+/g, ' ').trim() + (r.readmeExcerpt.length > 500 ? '...' : '') : 'Not available'}
- Complexity: ${r.complexity} | Community Impact: ${r.communityImpact}
- URL: ${r.htmlUrl || `https://github.com/${profile.username}/${r.name}`}`).join('\n');

  // Compact, one-line-per-repo breadth context: repos that were surveyed
  // and scored but not deep-dived above, so the model sees the full shape
  // of the portfolio without paying full token cost per repo.
  const otherReposList = (otherRepositories || []).slice(0, 15);
  const otherReposSummary = otherReposList.length
    ? otherReposList.map(r => `- ${r.name}${r.isFork ? ' [fork]' : ''} — ${r.languages?.join(', ') || 'N/A'}, ${r.stars}★, pushed ${r.daysSinceLastPush ?? '?'}d ago`).join('\n')
    : 'None — the repositories above are the candidate\'s full portfolio.';

  const topSkillsText = (skills || []).slice(0, 15).map(
    s => `${s.skill} (confidence: ${s.confidence}, repos: ${s.supportingRepoCount})`
  ).join(', ');

  return `
You are a Senior Staff Engineer, Engineering Manager, Technical Recruiter, and Hiring Committee Member evaluating this candidate's GitHub engineering portfolio.

EVALUATION PRINCIPLES:
1. Do NOT use simplistic heuristics (e.g., counting lines of code or requiring specific web frameworks).
2. Evaluate technical depth, problem complexity, engineering maturity, architecture, software design, ownership, open-source impact, community influence, production readiness, leadership, and code craftsmanship.
3. FAIRNESS TO SPECIALISTS: Kernel engineers, Compiler developers, Game developers, Embedded engineers, ML/AI engineers, Security researchers, Distributed Systems engineers, and Backend developers must be evaluated strictly according to their domain standards.
4. Output MUST be strictly valid JSON conforming to the requested schema. Return JSON ONLY without markdown formatting or preamble.

CANDIDATE PORTFOLIO EVIDENCE:

PROFILE:
- Username: ${profile.username}${profile.name ? ` (${profile.name})` : ''}
- Bio: ${profile.bio || 'None'}
- Location: ${profile.location || 'Unknown'} | Company: ${profile.company || 'None'}
- Account Age: ${profile.accountAgeYears || 0} years (${profile.accountAgeDays || 0} days)
- Public Repos: ${profile.publicRepos} (Original: ${activityStatistics.originalRepositories}, Forks: ${activityStatistics.forkedRepositories})
- Community Footprint: ${communityMetrics.totalStars} Stars, ${communityMetrics.totalForks} Forks, ${profile.followers} Followers

LANGUAGES & TECHNICAL STACK:
- Most Used Language: ${languageStatistics.mostUsedLanguage}
- Language Distribution: ${JSON.stringify(languageStatistics.distribution || {})}
- Verified Skills: ${topSkillsText || 'None extracted'}

TOP REPOSITORIES INTELLIGENCE (deep-dived, selected for balance across languages and project types — not just by star count):
${reposSummary || 'No repositories found.'}

ADDITIONAL REPOSITORIES (breadth context only — surveyed and scored but not deep-dived above):
${otherReposSummary}

TASK:
Produce a comprehensive AI Hiring Intelligence Evaluation containing EXACTLY these JSON keys:

1. careerScore: number (0-100) — holistic senior engineering assessment.
2. confidence: number (0-100) — assessment confidence based on depth/breadth of evidence.
3. confidenceReason: string (1-2 sentences explaining why this confidence score was assigned).
4. developerType: string — specific primary specialization (e.g. "Kernel / Systems Engineer", "Senior Backend Architect", "Full Stack Developer", "ML Systems Engineer").
5. seniority: string — ("Principal Engineer" | "Staff Engineer" | "Senior Engineer" | "Mid-Level Engineer" | "Junior Engineer").
6. recommendedRole: string — specific target role title (e.g. "Staff Systems Engineer", "Lead Backend Architect").
7. recommendedTeam: string — ideal team placement (e.g. "Operating Systems & Kernel", "Platform Infrastructure", "Core Backend").
8. hireDecision: string — ("Strong Hire" | "Hire" | "Leaning Hire" | "Leaning No Hire" | "No Hire").
9. scoreBreakdown: array of 4-6 items [{ "category": string, "score": number (0-100), "reason": string }] covering dimensions like Technical Depth, Open Source Impact, Architecture & System Design, Engineering Scale, Leadership & Community, Production Readiness.
10. roleFit: array of 4-6 items [{ "role": string, "fit": number (0-100), "reason": string }] ranking suitability across candidate target roles.
11. teamFit: array of 4-6 strings listing suited engineering team areas (e.g. ["Kernel", "Platform", "Infrastructure", "Backend", "Compiler"]).
12. executiveSummary: string (max 100 words) — high-level evaluation for VP of Engineering and Leadership.
13. technicalSummary: string (max 100 words) — in-depth technical analysis of code, architecture, and systems depth.
14. hiringRecommendation: string (2-3 sentences) — actionable recommendation for the Hiring Committee.
15. interviewFocus: string (1-2 sentences) — high-priority technical domains to probe in on-site interviews.
16. riskAreas: string (1-2 sentences) — potential technical gaps, lack of test coverage, or unverified skills.
17. strengths: array of 4 strings citing real repositories and technical achievements.
18. concerns: array of 2-3 strings highlighting genuine areas for improvement.
19. portfolioGaps: array of 2-4 items [{ "area": string, "severity": "high"|"medium"|"low", "advice": string }].
20. recommendations: array of 2-4 items [{ "priority": "high"|"medium"|"low", "recommendation": string }].
21. interviewPlan: array of 3-5 items [{ "topic": string, "reason": string, "sampleQuestion": string }].
22. interviewQuestions: array of 3-5 items [{ "question": string, "category": string, "difficulty": "hard"|"medium"|"easy", "rationale": string }].
23. resumeHighlights: array of 3-5 strings — punchy, metrics-driven resume bullet points showcasing flagship achievements.
24. resumeEvidence: object mapping 2-4 domains (e.g. systems, backend, devops) to { "claim": string, "evidence": string[] }.
25. portfolioShowcase: object with keys {
      "resumeProject": { "repoName": string, "repoUrl": string, "language": string, "stars": number, "reason": string, "score": number },
      "technicalProject": { "repoName": string, "repoUrl": string, "language": string, "stars": number, "reason": string, "score": number },
      "recruiterProject": { "repoName": string, "repoUrl": string, "language": string, "stars": number, "reason": string, "score": number },
      "architectureProject": { "repoName": string, "repoUrl": string, "language": string, "stars": number, "reason": string, "score": number }
    }.
26. candidateRoadmap: object {
      "nextCareerStep": string (e.g. "Staff Systems Architect"),
      "skillsToExpand": string[] (3-5 high-leverage technologies),
      "timeline": {
        "month1": { "focus": string, "tasks": string[] },
        "month2": { "focus": string, "tasks": string[] },
        "month3": { "focus": string, "tasks": string[] },
        "goal": string
      }
    }.
`.trim();
}

export default {
  buildMasterAnalysisPrompt
};
