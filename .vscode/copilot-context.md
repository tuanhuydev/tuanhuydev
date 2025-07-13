# VS Code Copilot Context & Preferences

## Project Overview

- **Project**: tuanhuydev - Full-stack TypeScript application with modern architecture
- **Tech Stack**: Next.js 15+ (App Router), React 19, TypeScript, MongoDB, Material-UI v7, TailwindCSS
- **Architecture**: Server/Client component separation, Repository pattern, Server Actions, Permission system
- **State Management**: React Query (TanStack) for server state, React Hook Form + Zod for forms
- **Styling**: Material-UI v7 components with TailwindCSS utilities, SCSS for custom styles
- **Database**: MongoDB with Repository pattern and Server Actions for data fetching
- **Current Branch**: dev

## Development Preferences & Standards

### Code Organization

- **HOCs**: Store Higher-Order Components in `app/components/commons/hocs/` folder (WithCopy, LocalizationParser)
- **withSearchFilter**: Main filter HOC located at `app/components/commons/withSearchFilter.tsx` for URL-synchronized search
- **Shared Utilities**: Place reusable hooks and utilities in `app/_utils/` (useDebounce, constants, helper functions)
- **FormV2 System**: Dynamic form components in `app/components/commons/FormV2/` with type-safe configuration
- **Component Structure**: Clear separation between server/client components with explicit "use client" directives
- **File Naming**: PascalCase for components, camelCase for utilities, kebab-case for API routes

### Next.js 15+ App Router Patterns

- **Server Components**: Prefer async server components for data fetching when possible (dashboard pages)
- **Client Components**: Use "use client" directive explicitly for client-side functionality (forms, interactions)
- **Server Actions**: Implement in `server/actions/` following established patterns with Repository calls
- **Component Boundaries**: Maintain clear server/client separation, avoid mixing server/client logic
- **URL State Management**: Use Next.js searchParams for filtering with URL synchronization

### Performance & Code Quality

- **Debouncing**: Use `useDebounce` utility from `_utils/` (500ms delay) for search/filter operations
- **React Query**: Use `createStableQueryKey` for consistent cache keys, stable query patterns
- **Code Reusability**: Create HOCs (`withSearchFilter`) and shared components to eliminate duplication
- **Type Safety**: Full TypeScript coverage with proper interfaces in `lib/interfaces/`
- **Form Validation**: React Hook Form + Zod for type-safe form validation
- **Error Handling**: Always validate implementations and fix linting errors, use BaseError for API errors

### UI/UX Standards

- **Styling**: Material-UI v7 components with TailwindCSS utilities, SCSS for complex styling
- **Component System**: FormV2 for dynamic forms, BaseSelect/BaseInput for consistent form controls
- **Responsive Design**: Mobile-first approach with proper breakpoints using Material-UI Grid/Box
- **Modern UI**: Clean, intuitive interfaces with consistent spacing and typography
- **Accessibility**: Follow Material-UI accessibility guidelines and best practices
- **Permission System**: Components support `allowCreate`, `allowEdit` props for access control

## Current Project Structure Context

### Key Directories

```
app/
├── _components/           # Shared reusable components
├── _queries/             # React Query hooks (useProjectsQuery, useTasksQuery, etc.)
├── _utils/               # Shared utilities (useDebounce, constants, helper functions)
├── components/
│   └── commons/
│       ├── hocs/         # Higher-Order Components (WithCopy, LocalizationParser)
│       ├── FormV2/       # Dynamic form system with type-safe configuration
│       └── withSearchFilter.tsx  # Main filter HOC with URL synchronization
├── dashboard/            # Dashboard pages (server-side rendered with async components)
└── api/                  # API routes

server/
├── actions/              # Server actions for data fetching (getProjects, getTasks, etc.)
├── repositories/         # Database access layer (MongoDB repositories)
└── services/             # Business logic services

lib/
├── interfaces/           # TypeScript definitions (base.d.ts, shared.ts)
└── utils/                # Server-side utilities
```

### Established Patterns

#### Server-Side Page Pattern

```tsx
// app/dashboard/[module]/page.tsx
import { getModuleData } from "@server/actions/moduleActions";

export default async function ModulePage({ searchParams }) {
  const data = await getModuleData(searchParams);

  return (
    <div>
      <ModuleFilter />
      <ModuleList data={data} />
    </div>
  );
}
```

#### withSearchFilter HOC Pattern

```tsx
// app/components/commons/withSearchFilter.tsx
export function withSearchFilter(config: FilterConfig) {
  return function SearchFilterComponent(props) {
    // URL-synchronized search with debouncing
    // Automatic state management for search params
    // Integration with PageFilter component
  };
}

// Usage in filter components:
// app/components/ProjectModule/ProjectsFilter.tsx
const ProjectsFilter = withSearchFilter({
  basePath: "/dashboard/projects",
  searchPlaceholder: "Find your project",
  createLabel: "New project",
  createPath: "/dashboard/projects/create",
});
```

#### React Query Pattern

```tsx
// app/_queries/projectQueries.ts
export const useProjectsQuery = (filter: ObjectType = {}) => {
  const { fetch } = useFetch();
  const queryKey = createStableQueryKey([QUERY_KEYS.PROJECTS, "list"], filter);

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      // Fetch implementation with proper error handling
    },
  });
};
```

#### FormV2 Dynamic Form Pattern

```tsx
// Using FormV2 system for type-safe forms
const TaskFormConfig: DynamicFormV2Config = {
  fields: [
    {
      name: "title",
      type: "text",
      options: { placeholder: "Task Title" },
      validate: { required: true },
    },
    {
      name: "status",
      type: "select",
      options: { options: TaskStatusOptions },
    },
  ],
};
```

## Development Workflow Expectations

### Before Making Changes

1. **Read Context**: Always check existing file structure and patterns
2. **Validate Imports**: Ensure proper import paths and component boundaries
3. **Check Dependencies**: Verify all required packages and utilities exist
4. **Follow Patterns**: Use established architectural patterns
5. **SEO Considerations**: For public content, consider sitemap and metadata impact

### During Implementation

1. **Group Changes**: Organize edits by file and functionality
2. **Type Safety**: Maintain TypeScript compliance throughout
3. **Error Checking**: Validate changes with get_errors tool
4. **Incremental Approach**: Make small, focused changes
5. **SEO Compliance**: Ensure public pages have proper metadata and are included in sitemap

### After Implementation

1. **Lint Validation**: Run `npm run lint` to ensure code quality
2. **Error Resolution**: Fix any compilation or runtime errors
3. **Documentation**: Update comments and documentation as needed
4. **SEO Validation**: Verify sitemap generation and robots.txt compliance

## SEO Optimization Implementation

### Sitemap Strategy

- **Dynamic Generation**: `app/sitemap.ts` automatically includes published blog posts
- **Prioritization**: Homepage (1.0), Posts listing (0.9), Individual posts (0.7), Privacy (0.3)
- **Change Frequency**: Daily for homepage/posts listing, weekly for individual posts, monthly for static pages
- **Content Filtering**: Only published posts with valid slugs are included
- **Error Handling**: Graceful fallback to basic sitemap if data fetching fails

### Robots.txt Configuration

- **Public Access**: Only `/posts/` and `/privacy/` are publicly accessible
- **Private Areas**: `/dashboard/`, `/api/`, `/auth/`, `/projects/` are blocked from crawlers
- **Crawl Rate**: 1-second delay to be respectful to search engines
- **Multi-Bot Support**: Explicit configurations for Google, Bing, Yandex, Baidu crawlers

### Metadata Enhancement

- **Blog Posts**: Rich OpenGraph and Twitter card metadata with clean descriptions
- **Content Processing**: HTML tags stripped from descriptions, proper length limits (155 chars)
- **Structured Data**: Article metadata with publication dates, author, and section information
- **Canonical URLs**: Proper canonical URL implementation to prevent duplicate content
- **Image Optimization**: Proper alt text and sizing for social media sharing (1200x630)

### Next.js Configuration

- **Security Headers**: HSTS, XSS protection, content type options for all pages
- **Performance**: Compression enabled, DNS prefetch control, optimized caching
- **SEO Headers**: Proper cache control and security headers that don't interfere with crawling

### Content Strategy

- **Focus**: Blog-centric SEO with projects kept private
- **Quality**: Only published, valid content included in public discovery
- **Performance**: Optimized loading and caching strategies for public pages

## Common Tasks & Preferences

### Component Migration

- **Client to Server**: Follow established server component patterns for dashboard pages
- **Shared Logic**: Extract common functionality into HOCs (withSearchFilter) or utilities (\_utils/)
- **Search Implementation**: Use withSearchFilter HOC for consistent URL-synchronized search patterns
- **Form Migration**: Use FormV2 system for dynamic, type-safe forms with validation

### Code Organization

- **Filter Components**: Use withSearchFilter HOC pattern for all search/filter functionality
- **Reusability**: Create shared components in commons/ folder, utilities in \_utils/
- **React Query**: Use stable query keys with createStableQueryKey utility
- **Cleanup**: Remove duplicate code, optimize imports, maintain consistent patterns

### Permission System

- **Access Control**: Add `allowCreate`, `allowEdit` props for permission-based access control
- **Extensible**: Design components to accommodate permission checks from useCurrentUserPermission
- **Future-Ready**: Components should gracefully handle permission changes

## Quick Reference Commands

### File Operations

- Read large contexts instead of small chunks
- Use absolute paths for all file operations
- Group related changes in single tool calls

### Terminal Commands

- Prefer tool-based operations over manual terminal commands
- Always validate with linting after changes
- Use background processes for long-running tasks

### Error Resolution

- Check get_errors for compilation issues
- Validate Next.js component boundaries (server vs client)
- Ensure proper "use client" directives for interactive components
- Fix React Query key stability issues with createStableQueryKey
- Validate FormV2 configuration types and validation schemas

---

## Usage Instructions

When starting a new chat session, reference this document to understand:

1. Project architecture and established patterns
2. Code organization preferences and standards
3. Development workflow expectations
4. Common tasks and implementation approaches

This context ensures consistent, high-quality implementations that align with project standards and personal preferences.
