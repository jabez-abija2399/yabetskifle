export interface GithubStats {
  yearlyCommits: { year: string; count: number }[];
  totalCommits: number;
  totalPRs: number;
  totalStars: number;
  topLanguages: { name: string; color: string; size: number }[];
}

export async function fetchGithubStats(username: string): Promise<GithubStats | null> {
  const token = process.env.GITHUB_TOKEN;
  
  // If the user hasn't generated their private token yet, fail gracefully
  if (!token) {
    console.warn("GITHUB_TOKEN is profoundly missing from .env.local. Suspending GitHub connection.");
    return null;
  }

  // 📡 The GraphQL query specifically formulated to extract exact architectural metrics
  const query = `
    query($username: String!) {
      user(login: $username) {
        pullRequests(first: 1) {
          totalCount
        }
        y2026: contributionsCollection(from: "2026-01-01T00:00:00Z", to: "2026-12-31T23:59:59Z") { contributionCalendar { totalContributions } }
        y2025: contributionsCollection(from: "2025-01-01T00:00:00Z", to: "2025-12-31T23:59:59Z") { contributionCalendar { totalContributions } }
        y2024: contributionsCollection(from: "2024-01-01T00:00:00Z", to: "2024-12-31T23:59:59Z") { contributionCalendar { totalContributions } }
        y2023: contributionsCollection(from: "2023-01-01T00:00:00Z", to: "2023-12-31T23:59:59Z") { contributionCalendar { totalContributions } }
        y2022: contributionsCollection(from: "2022-01-01T00:00:00Z", to: "2022-12-31T23:59:59Z") { contributionCalendar { totalContributions } }
        y2021: contributionsCollection(from: "2021-01-01T00:00:00Z", to: "2021-12-31T23:59:59Z") { contributionCalendar { totalContributions } }
        y2020: contributionsCollection(from: "2020-01-01T00:00:00Z", to: "2020-12-31T23:59:59Z") { contributionCalendar { totalContributions } }
        y2019: contributionsCollection(from: "2019-01-01T00:00:00Z", to: "2019-12-31T23:59:59Z") { contributionCalendar { totalContributions } }
        y2018: contributionsCollection(from: "2018-01-01T00:00:00Z", to: "2018-12-31T23:59:59Z") { contributionCalendar { totalContributions } }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
          nodes {
            stargazerCount
            languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
      // 🔥 Aggressive Edge Caching (Only triggers the API once per hour)
      next: { revalidate: 3600 } 
    });

    const root = await res.json();
    
    if (root.errors) {
      console.error("GraphQL Error:", root.errors);
      return null;
    }

    const user = root.data.user;

    // 🧮 Process Languages
    const languageMap = new Map<string, { size: number, color: string }>();
    let totalStars = 0;

    user.repositories.nodes.forEach((repo: any) => {
      totalStars += repo.stargazerCount;
      repo.languages.edges.forEach((edge: any) => {
        const existing = languageMap.get(edge.node.name) || { size: 0, color: edge.node.color };
        existing.size += edge.size;
        languageMap.set(edge.node.name, existing);
      });
    });

    // Sort languages by byte size
    const topLanguages = Array.from(languageMap.entries())
      .map(([name, data]) => ({ name, color: data.color, size: data.size }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 3); // Top 3 Languages

    // 🔥 Calculate immense lifetime contributions historically
    const yearlyCommitsRaw = [
      { year: "2026", count: user.y2026?.contributionCalendar.totalContributions || 0 },
      { year: "2025", count: user.y2025?.contributionCalendar.totalContributions || 0 },
      { year: "2024", count: user.y2024?.contributionCalendar.totalContributions || 0 },
      { year: "2023", count: user.y2023?.contributionCalendar.totalContributions || 0 },
      { year: "2022", count: user.y2022?.contributionCalendar.totalContributions || 0 },
      { year: "2021", count: user.y2021?.contributionCalendar.totalContributions || 0 },
      { year: "2020", count: user.y2020?.contributionCalendar.totalContributions || 0 },
      { year: "2019", count: user.y2019?.contributionCalendar.totalContributions || 0 },
      { year: "2018", count: user.y2018?.contributionCalendar.totalContributions || 0 },
    ];

    // Remove empty years to keep the UI tabs pristine
    const yearlyCommits = yearlyCommitsRaw.filter(y => y.count > 0);
    const lifetimeCommits = yearlyCommits.reduce((acc, y) => acc + y.count, 0);

    return {
      yearlyCommits,
      totalCommits: lifetimeCommits,
      totalPRs: user.pullRequests.totalCount,
      totalStars,
      topLanguages
    };

  } catch (error) {
    console.error("Failed to fetch Github Stats:", error);
    return null;
  }
}
