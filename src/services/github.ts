export interface GithubStats {
  totalCommits: number;
  totalPRs: number;
  totalStars: number;
  topLanguages: { name: string; color: string; size: number }[];
}

export async function fetchGithubStats(username: string): Promise<GithubStats | null> {
  const token = process.env.GITHUB_TOKEN;
  
  // If the user hasn't generated their private token yet, fail gracefully
  if (!token) {
    console.warn("GITHUB_TOKEN is profoundly missing from .env.local. Suspending telemetry.");
    return null;
  }

  // 📡 The GraphQL query specifically formulated to extract exact architectural metrics
  const query = `
    query($username: String!) {
      user(login: $username) {
        pullRequests(first: 1) {
          totalCount
        }
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
        contributionsCollection {
          contributionCalendar {
            totalContributions
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

    return {
      totalCommits: user.contributionsCollection.contributionCalendar.totalContributions,
      totalPRs: user.pullRequests.totalCount,
      totalStars,
      topLanguages
    };

  } catch (error) {
    console.error("Failed to fetch Github Stats:", error);
    return null;
  }
}
