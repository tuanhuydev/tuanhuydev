# Copilot Development Guide

## Quick Start for New Chat Sessions

When starting a new GitHub Copilot chat, use this prompt:

```
Hi GitHub Copilot! Please read the context file at .vscode/copilot-context.md to understand my project structure, development preferences, and established patterns before making any changes.

This is a modern full-stack TypeScript application with:
- Next.js 15+ (App Router) with React Server Components
- MongoDB with Repository pattern and Server Actions
- Material-UI v7 + TailwindCSS for styling
- React Query (TanStack) for client state management
- React Hook Form + Zod for form validation
- Custom HOC patterns for reusable UI logic
- Debounced search with URL synchronization (500ms delay)
- Permission-based access control system
- SEO-optimized with enhanced sitemap and metadata

Please follow the established architecture patterns, component organization, and code quality standards outlined in the context file.
```

## Project Context

- **Tech Stack**: Next.js 15+ (App Router), TypeScript, React Server Components, MongoDB, Material-UI v7, TailwindCSS
- **Architecture**: Server/Client component separation, Repository pattern, Server Actions, Permission system
- **State Management**: React Query (TanStack) for server state, React Hook Form for forms
- **Organization**: withSearchFilter HOC pattern, shared utilities in `_utils/`, FormV2 component system
- **SEO**: Optimized sitemap, robots.txt, metadata, and Next.js configuration for search engines

## Key Patterns

- Debounced search with URL synchronization (500ms delay) using `useDebounce` utility
- Server-side rendering for dashboard pages with async server components
- `withSearchFilter` HOC for consistent filter components with URL state management
- FormV2 component system for dynamic forms with validation
- React Query stable key patterns with `createStableQueryKey` utility
- Repository pattern with MongoDB for data access layer
- Permission-based access control with `allowCreate`, `allowEdit` props
- Proper "use client" directives for client-only components
- SEO-optimized metadata generation for blog posts with rich OpenGraph and Twitter cards

## SEO Implementation

- **Sitemap**: Dynamic sitemap generation focusing on published blog posts only
- **Robots.txt**: Optimized with proper disallow/allow directives for security and crawling
- **Metadata**: Enhanced blog post metadata with OpenGraph, Twitter cards, and structured data
- **Performance**: Security headers, compression, and optimized caching in Next.js config

## Workflow

1. Always check `.vscode/copilot-context.md` for full context
2. Follow established patterns and file organization
3. Maintain TypeScript safety and run linting
4. Group changes by file and validate after editing
5. Consider SEO implications for any public-facing content
