# replit.md

## Overview

CommitKings is a full-stack web application that allows users to rate GitHub profiles and repositories using a "Hotty" or "Notty" voting system. The application features a React frontend with shadcn/ui components, an Express.js backend, and PostgreSQL database with Drizzle ORM. Users can authenticate via GitHub OAuth, search for profiles/repos, vote on them, and view leaderboards of the most popular developers and repositories.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React 18 with TypeScript, using Vite for development and building
- **Backend**: Express.js server with TypeScript, serving both API endpoints and static files
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: GitHub OAuth integration (currently simulated in demo mode)
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using functional components and hooks
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query for server state, React Context for auth and theme
- **Styling**: Tailwind CSS with CSS variables for theming, shadcn/ui component system
- **Build Tool**: Vite with hot module replacement for development

### Backend Architecture
- **Server**: Express.js with TypeScript, using ES modules
- **API Design**: RESTful endpoints under `/api` prefix
- **Database**: Drizzle ORM with Neon serverless PostgreSQL connection
- **Development**: tsx for TypeScript execution, esbuild for production builds
- **Static Serving**: Serves built React app in production, Vite dev server in development

### Database Schema
- **users**: Stores GitHub user information (id, github_id, username, avatar_url)
- **ratings**: Stores user votes with composite primary key (user_id, github_id, type)
- **leaderboard_cache**: Cached aggregated vote counts for performance
- **priority_list**: Curated list of profiles/repos to feature prominently

### Authentication System
- Supabase Auth with GitHub OAuth provider integration
- Real GitHub OAuth flow with proper session management
- User sessions managed by Supabase with localStorage fallback
- Protected routes and API endpoints based on user authentication state
- Auth state synchronization between Supabase and local application state

## Data Flow

1. **User Authentication**: GitHub OAuth flow creates/retrieves user from database
2. **Content Discovery**: Users can search GitHub API or browse featured/priority content
3. **Rating System**: Authenticated users vote "Hotty" or "Notty" on profiles/repos
4. **Leaderboard Generation**: Vote aggregation creates ranked lists of popular content
5. **Real-time Updates**: TanStack Query provides optimistic updates and cache invalidation

## External Dependencies

### Core Framework Dependencies
- React 18 ecosystem (react, react-dom, @types/react)
- Express.js server framework
- TypeScript for type safety across the stack

### Database & ORM
- Drizzle ORM for type-safe database operations
- @neondatabase/serverless for PostgreSQL connection
- drizzle-kit for migrations and schema management

### UI Components & Styling
- @radix-ui/* primitives for accessible component foundations
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- shadcn/ui component system built on Radix primitives

### State Management & Data Fetching
- @tanstack/react-query for server state management
- Wouter for lightweight client-side routing

### Development Tools
- Vite for fast development builds and HMR
- tsx for TypeScript execution in Node.js
- esbuild for production bundling
- @replit/* plugins for Replit integration

### GitHub Integration
- Direct GitHub API calls for profile/repo data
- GitHub OAuth for authentication (simulated in current implementation)

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for backend TypeScript execution
- Environment variable configuration for database connection
- Replit-specific tooling for development environment

### Production Build Process
1. Frontend: Vite builds React app to `dist/public`
2. Backend: esbuild bundles server code to `dist/index.js`
3. Database: Drizzle migrations applied via `db:push` script
4. Static serving: Express serves built frontend files

### Environment Configuration
- `DATABASE_URL` required for PostgreSQL connection
- `NODE_ENV` controls development vs production behavior
- GitHub OAuth credentials would be required for production authentication

### Performance Considerations
- Leaderboard caching to reduce database load
- TanStack Query caching for GitHub API responses
- Static asset serving optimized for production
- Serverless-ready architecture with Neon PostgreSQL