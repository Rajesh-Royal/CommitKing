<div align="center">
  <img src="commit-kings-logo.png" alt="CommitKings Logo" width="180"/>
  <h1>CommitKings 👑</h1>
  <p>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
    <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript"></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white" alt="Next.js"></a>
    <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" alt="Contributions Welcome"></a>
  </p>
</div>

## Overview

CommitKings is an open source "Hot or Not" rating platform for GitHub profiles and repositories. Users can vote "Hotty" 🔥 or "Notty" 🧊 on GitHub profiles/repos, creating community-driven leaderboards to discover the most popular developers and projects.

**🚀 Built with modern web technologies:**

- Next.js 15 with App Router & TypeScript
- TanStack Query for smart data fetching
- Supabase for authentication & database
- shadcn/ui components with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and pnpm
- Supabase account
- GitHub OAuth App (optional for development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rajesh-Royal/CommitKing.git
   cd CommitKing
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Set up the database**

   ```bash
   pnpm db:push
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Authentication**: Supabase Auth with GitHub OAuth

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (protected)/       # Authenticated routes
│   ├── (public)/          # Public routes
│   └── api/               # API routes
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   └── ...
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and configurations
├── providers/              # Context providers
└── shared/                 # Shared schemas and types
```

### Key Features

- **Priority-Based Content**: Curated profiles/repos for better user experience
- **Smart Caching**: 24h GitHub API cache with localStorage persistence
- **Optimistic Updates**: Instant UI feedback with TanStack Query
- **Rate Limit Handling**: Graceful GitHub API error handling
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
pnpm db:generate  # Generate database migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

### Database Management

The project uses Drizzle ORM with Supabase PostgreSQL:

- **Schema**: Defined in `src/shared/schema.ts`
- **Migrations**: Auto-generated with `pnpm db:generate`

### API Integration

- **GitHub API**: Centralized in `src/lib/github.ts`
- **Rate Limiting**: Built-in error handling for API limits
- **Caching**: 24-hour cache with smart invalidation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contributing Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write TypeScript with proper types
- Use `pnpm` for package management
- Test your changes thoroughly
- Update documentation as needed

## 📋 Roadmap

- [ ] Enhanced search and filtering
- [ ] User profiles and history
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] API rate limiting
- [ ] Advanced analytics

## 🐛 Issues

Found a bug? Have a feature request? Please check our [Issues](https://github.com/Rajesh-Royal/CommitKing/issues) page or create a new one.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Supabase](https://supabase.com) for backend infrastructure
- [GitHub API](https://docs.github.com/en/rest) for profile/repo data

## 📞 Support

- **Documentation**: Check our [docs](docs/)
- **Issues**: [GitHub Issues](https://github.com/Rajesh-Royal/CommitKing/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Rajesh-Royal/CommitKing/discussions)

---

Made with ❤️ by the CommitKings community
