interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
}

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubAPI {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CommitKings',
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Parse error response to get detailed GitHub error info
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      // Create error object with GitHub-specific properties
      const error = new Error(errorData.message || `GitHub API error: ${response.status} ${response.statusText}`) as Error & {
        status: number;
        documentation_url?: string;
      };

      error.status = response.status;
      if (errorData.documentation_url) {
        error.documentation_url = errorData.documentation_url;
      }

      throw error;
    }

    return response.json();
  }

  async getUser(username: string): Promise<GitHubUser> {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/users/${username}`);
  }

  async getRepo(owner: string, repo: string): Promise<GitHubRepo> {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
  }

  async searchUsers(query: string, page = 1, perPage = 10): Promise<{ items: GitHubUser[] }> {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&sort=followers&order=desc`);
  }

  async searchRepos(query: string, page = 1, perPage = 10): Promise<{ items: GitHubRepo[] }> {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&sort=stars&order=desc`);
  }

  // Generate contribution graph data (simplified version)
  // In production, this would use GitHub's GraphQL API or scrape the contributions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateContributionData(_username: string): ContributionDay[] {
    const contributions: ContributionDay[] = [];
    const today = new Date();

    // Generate 365 days of contribution data
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Generate realistic contribution patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Lower activity on weekends
      const baseActivity = isWeekend ? 0.3 : 0.7;
      const randomFactor = Math.random();

      let count = 0;
      let level = 0;

      if (randomFactor < baseActivity) {
        // Generate contribution count with realistic distribution
        const intensity = Math.random();
        if (intensity < 0.6) {
          count = Math.floor(Math.random() * 5) + 1; // 1-5 contributions
          level = 1;
        } else if (intensity < 0.85) {
          count = Math.floor(Math.random() * 10) + 6; // 6-15 contributions
          level = 2;
        } else if (intensity < 0.95) {
          count = Math.floor(Math.random() * 15) + 16; // 16-30 contributions
          level = 3;
        } else {
          count = Math.floor(Math.random() * 20) + 31; // 31+ contributions
          level = 4;
        }
      }

      contributions.push({
        date: date.toISOString().split('T')[0],
        count,
        level,
      });
    }

    return contributions;
  }

  async getContributions(username: string): Promise<ContributionDay[]> {
    // For now, return generated data
    // In production, implement proper GitHub contributions API
    return this.generateContributionData(username);
  }
}

export const githubAPI = new GitHubAPI();

// Priority lists from PRD
export const PRIORITY_PROFILES = [
  'Rajesh-Royal',
  'aidenybai',
  'mazeincoding',
  'ahmetskilinc',
  'nizzyabi',
  'BlankParticle',
  'nyzss',
  't3dotgg',
  'PeerRich',
  'emrysal',
  'zomars',
  'Udit-takkar',
  'pumfleet',
  'izadoesdev',
  'StarKnightt',
  'anwarulislam',
  'MrgSub',
  'retrogtx',
  'nikitadrokin',
  'DevloperAmanSingh',
  'mezotv',
  'hbjORbj',
  'keithwillcode',
  'aashishparuvada',
  'San-77x',
  'simonorzel26',
  'ayush18pop',
  'taqui-786',
  'joschan21',
  'AntonioErdeljac',
  'adrianhajdin',
  'payloadcms',
  'shadcn',
  'OpenPipe',
  'vinta',
  'kentcdodds',
  'Balastrong',
  'tannerlinsley',
];

export const PRIORITY_REPOS = [
  'Rajesh-Royal/Broprint.js',
  'calcom/cal.com',
  'Mail-0/Zero',
  'OpenCut-app/OpenCut',
  't3-oss/create-t3-app',
  'StarKnightt/prasendev',
  'twitter/the-algorithm',
  'saadeghi/daisyui',
  'TanStack/query',
  'twitter/twemoji',
  'TabbyML/Tabby',
  'DIYgod/RSSHub',
  'imputnet/cobalt',
  'FFmpeg/FFmpeg',
  'yt-dlp/yt-dlp',
  'shadcn-ui/ui',
  'Tyrrrz/YoutubeDownloader',
  'taqui-786/Portfolio',
  'joschan21/digitalhippo',
  'AntonioErdeljac/next13-discord-clone',
  'adrianhajdin/ecommerce',
  'payloadcms/payload',
  'shadcn/taxonomy',
  'OpenPipe/ART',
  'vinta/awesome-python',
];
