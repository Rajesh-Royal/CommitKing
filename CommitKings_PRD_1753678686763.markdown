# CommitKings Product Requirements Document (PRD)

## 1. Overview

### 1.1 Purpose
CommitKings is a web application that allows users to rate GitHub profiles and repositories as "Hotty" (🔥) or "Notty" (🧊), inspired by the "Hot or Not" concept. It aims to gamify the exploration of GitHub profiles and repositories, fostering community engagement and showcasing developer talent. The project will be open-source to encourage contributions and transparency.

### 1.2 Scope
- Frontend built with Next.js, Tailwind CSS, and shadcn/ui.
- Backend powered by Supabase for authentication, database, and API management.
- Users can browse random GitHub profiles/repos, rate them, view leaderboards, and contribute to the open-source codebase.
- Comprehensive documentation for setup and contribution.

### 1.3 Goals
- Create an engaging platform for rating GitHub profiles and repositories.
- Build a scalable, maintainable, and open-source codebase.
- Enable seamless contributions with clear setup and development guides.
- Ensure a responsive and intuitive UI/UX with Tailwind CSS and shadcn/ui.

## 2. Target Audience
- Developers and tech enthusiasts familiar with GitHub.
- Open-source contributors looking to explore or showcase GitHub profiles/repos.
- Users interested in a fun, gamified way to discover developer talent.

## 3. Features

### 3.1 Core Features
1. **User Authentication**:
   - Sign in with GitHub OAuth via Supabase Auth.
   - Optional anonymous browsing (limited features, e.g., no rating or leaderboard access).
2. **Profile/Repo Rating**:
   - Display a random GitHub profile or repository, with priority given to profiles/repos from the predefined list when no other algorithmic data is available.
   - Show a contribution graph for the past year, including public and private contributions (similar to the provided image) for profiles.
   - For repositories, highlight key metrics (total PRs, closed PRs, open pull requests, issues, stars, contributors) in an eye-catching manner using bold colors (e.g., green for stars, red for open issues).
   - Two buttons: 🔥 Hotty (positive rating) and 🧊 Notty (negative rating).
   - Store ratings in Supabase database.
   - Prevent duplicate ratings from the same user for the same profile/repo.
3. **Leaderboard**:
   - Display top-rated profiles and repos based on Hotty/Notty scores.
   - Separate leaderboards for profiles and repositories.
   - Filterable by time (e.g., all-time, weekly).
   - Highlight "Profile/Repo of the Week" on the landing page once sufficient traffic and ratings are available, showcasing top leaderboard entries with visually appealing designs.
4. **Profile/Repo Details**:
   - Show basic GitHub info (e.g., username, bio, repo name, description, stars, forks).
   - Include a contribution graph for profiles (932 contributions in the last year as an example).
   - For repos, display total PRs, closed PRs, open pull requests, issues, stars, and contributors count with bold, colorful styling to draw attention.
   - Link to the original GitHub profile/repo.
5. **Open-Source Contribution**:
   - Public GitHub repository with clear documentation.
   - CONTRIBUTING.md, README.md, and setup guides for local development.
   - Issue templates and pull request guidelines.
6. **Priority Rating and Search**:
   - Implement an algorithm to prioritize displaying profiles and repos from the predefined list (see Section 3.3) when insufficient rating data is available to drive algorithmic suggestions.
   - Allow users to search for profiles by GitHub username or repos by name, with priority given to the predefined list.
   - Landing page will feature prioritized profiles and repos from the predefined list, transitioning to top leaderboard entries (e.g., Profile/Repo of the Week) as traffic and ratings increase, ensuring eye-catching and visually appealing presentation.

### 3.2 Additional Features
- **Search Functionality**: Allow users to search for specific profiles/repos to rate.
- **User Dashboard**: View personal rating history and contributions.
- **Responsive Design**: Mobile and desktop-friendly UI using Tailwind CSS.
- **Dark/Light Mode**: Theme toggle using shadcn/ui components.

### 3.3 Predefined Priority List
The following profiles and repositories will be prioritized for display on the landing page and in random selections when insufficient rating data is available to drive algorithmic suggestions. As traffic and ratings increase, the landing page will transition to showcasing top leaderboard entries (e.g., Profile/Repo of the Week) with visually appealing designs.

**Profiles**:
- https://github.com/Rajesh-Royal
- https://github.com/mazeincoding
- https://github.com/ahmetskilinc
- https://github.com/nizzyabi
- https://github.com/BlankParticle
- https://github.com/nyzss
- https://github.com/t3dotgg
- https://github.com/PeerRich
- https://github.com/emrysal
- https://github.com/zomars
- https://github.com/Udit-takkar
- https://github.com/pumfleet
- https://github.com/izadoesdev
- https://github.com/StarKnightt
- https://github.com/anwarulislam
- https://github.com/MrgSub
- https://github.com/retrogtx
- https://github.com/nikitadrokin
- https://github.com/DevloperAmanSingh
- https://github.com/mezotv
- https://github.com/hbjORbj
- https://github.com/keithwillcode
- https://github.com/aashishparuvada
- https://github.com/San-77x
- https://github.com/simonorzel26
- https://github.com/ayush18pop

**Repositories**:
- https://github.com/Rajesh-Royal/Broprint.js
- https://github.com/calcom/cal.com
- https://github.com/Mail-0/Zero
- https://github.com/OpenCut-app/OpenCut
- https://github.com/t3-oss/create-t3-app
- https://github.com/StarKnightt/prasendev
- https://github.com/twitter/the-algorithm
- https://github.com/twitter/twemoji
- https://github.com/TabbyML/Tabby
- https://github.com/DIYgod/RSSHub
- https://github.com/imputnet/cobalt
- https://github.com/FFmpeg/FFmpeg
- https://github.com/yt-dlp/yt-dlp
- https://github.com/Tyrrrz/YoutubeDownloader

## 4. Technical Requirements

### 4.1 Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui.
- **Backend**: Supabase (PostgreSQL for database, Authentication, and Storage).
- **APIs**: GitHub API for fetching profile/repo data (including contribution graphs and repo metrics), Supabase API for ratings and user data.
- **Hosting**: Vercel for frontend deployment, Supabase for backend services.
- **Version Control**: GitHub for source code and contributions.

### 4.2 Database Schema (Supabase)
- **Users**:
  ```sql
  id: uuid (primary key, auto-generated by Supabase Auth)
  github_id: string (GitHub user ID)
  username: string
  created_at: timestamp
  ```
- **Ratings**:
  ```sql
  id: uuid (primary key)
  user_id: uuid (foreign key to Users)
  github_id: string (GitHub profile/repo ID)
  type: string (enum: 'profile', 'repo')
  rating: string (enum: 'hotty', 'notty')
  created_at: timestamp
  ```
- **Leaderboard Cache** (optional for performance):
  ```sql
  id: uuid (primary key)
  github_id: string
  type: string (enum: 'profile', 'repo')
  hotty_count: integer
  notty_count: integer
  updated_at: timestamp
  ```
- **Priority List** (for prioritized profiles/repos):
  ```sql
  id: uuid (primary key)
  github_id: string
  type: string (enum: 'profile', 'repo')
  priority_score: integer (default: 0)
  created_at: timestamp
  ```

### 4.3 APIs
- **GitHub API**:
  - `GET /users/{username}`: Fetch profile details.
  - `GET /users/{username}/events`: Fetch contribution data for the graph.
  - `GET /repos/{owner}/{repo}`: Fetch repository details (total PRs, closed PRs, open PRs, issues, stars, contributors).
  - Rate limiting: Handle GitHub API limits with caching or Supabase Edge Functions.
- **Supabase API**:
  - Authentication: GitHub OAuth integration.
  - Database: CRUD operations for ratings, user data, and priority list.
  - Realtime: Update leaderboards in real-time (optional).

### 4.4 File Structure
```
commit-kings/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── components/         # Reusable components (shadcn/ui)
│   ├── pages/              # Page components
│   ├── styles/             # Tailwind CSS config
├── public/                 # Static assets
├── supabase/               # Supabase migrations and schemas
├── docs/                   # Documentation
│   ├── setup.md            # Local setup guide
│   ├── contributing.md     # Contribution guidelines
├── README.md               # Project overview
├── package.json            # Dependencies
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
```

## 5. User Flow
1. **Landing Page**:
   - Welcome message, sign-in button (GitHub OAuth), and option for anonymous browsing.
   - Showcase prioritized profiles/repos from the predefined list with contribution graphs (profiles) or key metrics (repos). Transition to top leaderboard entries (e.g., Profile/Repo of the Week) as ratings increase, with eye-catching designs.
2. **Rating Flow**:
   - User sees a random profile/repo with details (e.g., username, bio, repo description, contribution graph for profiles, or repo metrics for repos), prioritizing the predefined list initially.
   - Clicks 🔥 Hotty or 🧊 Notty to rate.
   - After rating, a new profile/repo loads (prioritized or random).
3. **Leaderboard**:
   - Accessible via navigation bar.
   - Displays top profiles/repos with Hotty/Notty counts.
4. **User Dashboard** (authenticated users):
   - View rating history and contributions.
   - Link to GitHub repo for contributions.
5. **Search**:
   - Search bar to find profiles by username or repos by name.
   - Prioritized results from the predefined list appear first.

## 6. UI/UX Requirements
- **Design System**: Use shadcn/ui components for consistency (e.g., buttons, cards, modals).
- **Styling**: Tailwind CSS for responsive layouts and theme support (dark/light mode).
- **Components**:
  - Profile/Repo Card: Displays GitHub info, contribution graph for profiles, and eye-catching metrics (total PRs, closed PRs, open PRs, issues, stars, contributors) for repos using bold colors (e.g., green for stars, red for open issues).
  - Leaderboard Table: Sortable table with profile/repo rankings.
  - Navigation Bar: Links to Home, Leaderboard, Dashboard, and GitHub repo.
  - Search Bar: Input field with autocomplete for usernames and repo names.
- **Accessibility**: Ensure ARIA labels and keyboard navigation support.

## 7. Open-Source Documentation

### 7.1 README.md
```
# CommitKings

A fun app to rate GitHub profiles and repositories as 🔥 Hotty or 🧊 Notty.

## Features
- Rate GitHub profiles and repos with contribution graphs or key metrics.
- View leaderboards for top-rated profiles/repos.
- Open-source with easy contribution setup.

## Setup
1. Clone the repo: `git clone https://github.com/<org>/commit-kings.git`
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`).
4. Run locally: `npm run dev`
5. Set up Supabase (see `docs/setup.md`).

## Contributing
See `docs/contributing.md` for guidelines.

## License
MIT License
```

### 7.2 docs/setup.md
```
# Local Setup Guide

## Prerequisites
- Node.js 18+
- Supabase CLI
- GitHub OAuth app credentials
- Vercel CLI (optional for deployment)

## Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/<org>/commit-kings.git
   cd commit-kings
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Supabase**
   - Install Supabase CLI: `npm install -g @supabase/supabase`
   - Login: `supabase login`
   - Initialize Supabase: `supabase init`
   - Apply migrations: `supabase db push`

4. **Environment Variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

5. **Run Locally**
   ```bash
   npm run dev
   ```

6. **Deploy to Vercel**
   ```bash
   vercel
   ```
```

### 7.3 docs/contributing.md
```
# Contributing to CommitKings

We welcome contributions! Follow these steps to contribute:

## Getting Started
1. Fork the repository.
2. Clone your fork: `git clone https://github.com/<your-username>/commit-kings.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Follow the setup guide in `docs/setup.md`.

## Code Style
- Follow ESLint and Prettier rules.
- Use TypeScript for type safety.
- Adhere to shadcn/ui and Tailwind CSS conventions.

## Submitting Changes
1. Commit changes: `git commit -m "Add feature X"`
2. Push to your fork: `git push origin feature/your-feature-name`
3. Open a pull request with a clear description.

## Issue Templates
Use the provided issue templates for bugs or feature requests.

## Code of Conduct
Be respectful and inclusive.
```

## 8. Non-Functional Requirements
- **Performance**: Optimize API calls with caching (e.g., SWR or React Query).
- **Security**:
  - Secure GitHub OAuth flow via Supabase.
  - Sanitize user inputs to prevent XSS.
  - Rate limit API endpoints to prevent abuse.
- **Scalability**: Use Supabase for scalable database operations and Vercel for frontend scaling.
- **Testing**: Include unit tests for components and API routes (using Jest or Vitest).

## 9. Milestones
1. **MVP (Minimum Viable Product)**:
   - GitHub OAuth login.
   - Random profile/repo rating with Hotty/Notty buttons, contribution graphs for profiles, and key metrics for repos.
   - Basic leaderboard.
   - Documentation for setup and contribution.
2. **Phase 2**:
   - Search functionality with prioritized list.
   - User dashboard.
   - Dark/light mode.
3. **Phase 3**:
   - Realtime leaderboard updates.
   - Advanced filtering and analytics.

## 10. Risks and Mitigations
- **Risk**: GitHub API rate limits.
  - **Mitigation**: Cache API responses and use Supabase Edge Functions for batch processing.
- **Risk**: Supabase free-tier limitations.
  - **Mitigation**: Optimize queries and monitor usage; upgrade plan if needed.
- **Risk**: Low community contributions.
  - **Mitigation**: Provide clear documentation and engage community via GitHub issues.

## 11. Deployment
- **Frontend**: Deploy on Vercel with automatic scaling.
- **Backend**: Supabase hosted services for database and authentication.
- **CI/CD**: GitHub Actions for linting, testing, and deployment to Vercel.

## 12. License
- MIT License to encourage open-source contributions.