# CommitKings AI Agent Instructions

## Project Overview
CommitKings is a GitHub-based "Hot or Not" rating platform built with Next.js 14, TanStack Query, and Supabase. Users rate GitHub profiles/repositories with "Hotty" 🔥 or "Notty" 🧊 votes, creating community-driven leaderboards.

## Development Principles

### Analysis Process
Before making changes, always:
1. **Request Analysis**: Understand the task type, frameworks involved, and explicit/implicit requirements
2. **Solution Planning**: Break down into logical steps, consider modularity and reusability
3. **Implementation Strategy**: Choose appropriate patterns, consider performance and error handling

### Code Standards
- **Package Manager**: Always use `pnpm` (never npm/yarn)
- **TypeScript**: Use TypeScript for all code with proper type safety
- **Naming**: Descriptive names with auxiliary verbs (`isLoading`, `hasError`), prefix event handlers with "handle"
- **Error Handling**: Use early returns, guard clauses, and proper error boundaries
- **Component Structure**: Place exports, subcomponents, helpers, types logically

## Core Architecture Patterns

### Priority-Based Content System
- **Priority Lists**: `PRIORITY_PROFILES` and `PRIORITY_REPOS` in `src/lib/github.ts` contain curated high-quality content
- **Queue Management**: `useItemQueue` hook manages content flow using priority lists instead of random GitHub searches
- **Smart Caching**: TanStack Query with localStorage persistence (`src/lib/queryClient.ts`) caches GitHub API responses for 24h
- **Prefetching**: `useSmartPrefetch` backgrounds loads priority content to eliminate loading delays

### Database Schema & Storage Layer
- **Drizzle ORM**: Type-safe database operations in `src/shared/schema.ts` and `src/lib/storage.ts`
- **Key Tables**: `users`, `ratings`, `leaderboard_cache`, `priority_list`
- **Storage Pattern**: Abstract `IStorage` interface with `DbStorage` implementation for easy testing/mocking

### GitHub Integration
- **Rate Limit Handling**: `useGitHubErrorHandler` provides user-friendly error messages for API limits
- **Image Optimization**: `AvatarWithLoading` component bypasses Next.js optimization for GitHub avatars (`unoptimized: true`)
- **API Abstraction**: `GitHubAPI` class in `src/lib/github.ts` centralizes all GitHub API calls

## Development Workflows

### Essential Commands
```bash
# Development (always use pnpm)
pnpm dev                    # Start Next.js with Turbopack
pnpm build                  # Production build
pnpm db:generate           # Generate Drizzle migrations
pnpm db:push              # Push schema changes to database
pnpm db:studio            # Open Drizzle Studio for database inspection


### Component Patterns
- **shadcn/ui Components**: Use existing components from `src/components/ui/` before creating new ones
- **Loading States**: Implement skeleton loading patterns (see `AvatarWithLoading`)
- **Optimistic Updates**: TanStack Query handles optimistic rating submissions
- **Error Boundaries**: Centralized error handling with `useGitHubErrorHandler`
- **Functional Components**: Use functional components with TypeScript interfaces
- **Client Components**: Minimize 'use client' directives, use only for Web API access

### State Management
- **TanStack Query**: All GitHub API data fetching with smart caching and persistence
- **Local State**: React hooks for UI state, avoid global state unless necessary
- **Queue State**: `useItemQueue` manages content queuing with transition animations
- **Auth State**: Supabase Auth integration (currently simplified for development)
- **URL State**: Consider 'nuqs' for URL state management when needed

## Critical Integration Points

### Next.js App Router Structure
```
src/app/(protected)/        # Authenticated routes
src/app/(public)/          # Public routes (waitlist)
src/app/api/               # API routes for database operations
```

### Component Communication
- **Props drilling**: Preferred over context for simple state passing
- **Callback patterns**: `onProfileSelect`, `onRepositorySelect` for component communication
- **Query invalidation**: Use `queryClient.invalidateQueries()` after mutations

### GitHub Avatar Handling
- **Direct Loading**: Set `unoptimized: true` in `next.config.ts` to bypass 504 timeouts
- **Fallback Strategy**: Show Lucide icons (User, Building2, Users) when images fail
- **Size Optimization**: Manually append `?s=size&v=4` to GitHub avatar URLs

### UI Development
- **Styling**: Tailwind CSS with mobile-first approach, consistent spacing
- **Accessibility**: Proper ARIA attributes, keyboard navigation, WCAG 2.1 compliance
- **Performance**: Optimize images, implement code splitting, use `next/font`

## Debug & Development
- **Debug Logging**: Use `debugLog` utility from `src/utils/debugLog.ts` for development-only logging
- **Cache Inspection**: TanStack Query DevTools available in development
- **Database**: Use Drizzle Studio for database inspection: `pnpm db:studio`
- **Error Handling**: Model expected errors as return values, use error boundaries for unexpected errors

## Common Pitfalls
- **GitHub API Limits**: Always use `handleGitHubError` for API calls
- **Image Loading**: Never rely on Next.js optimization for GitHub avatars
- **Queue State**: Don't modify queue directly, use `useItemQueue` methods
- **Type Safety**: Import types from `src/shared/schema.ts` for database entities
- **Package Manager**: Never use npm/yarn, always use `pnpm`

## Performance Considerations
- **Prefetching**: Background prefetch priority content to maintain smooth UX
- **Caching Strategy**: 24h cache for GitHub data, 7-day localStorage persistence
- **Avatar Preloading**: `preloadGitHubAvatar` utility improves transition smoothness
- **Database**: Leaderboard caching table reduces computation for frequent queries
- **Core Web Vitals**: Monitor LCP, CLS, FID for optimal user experience
