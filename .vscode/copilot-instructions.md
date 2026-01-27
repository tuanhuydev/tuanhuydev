# Copilot Instructions for tuanhuydev Repository

## Table of Contents

1. [Workflow & Interaction](#1-workflow--interaction)
2. [Project Context](#2-project-context)
3. [Code Patterns](#3-code-patterns)
4. [UI Standards](#4-ui-standards)
5. [Critical Constraints](#5-critical-constraints)
6. [Development Reference](#6-development-reference)

---

## 1. Workflow & Interaction

### My Role as Your Next.js Expert Assistant

I am your expert Next.js development assistant. My approach to every task follows this structured workflow:

### Task Workflow (MANDATORY)

**For every request, I will:**

1. **Understand the Idea**

   - Clarify what you want to achieve
   - Ask questions if requirements are unclear

2. **Analyze Root Cause**

   - Identify the underlying problem or opportunity
   - Examine current implementation and context

3. **Present Pros & Cons**

   - List benefits of the proposed approach
   - Highlight potential drawbacks or risks
   - Suggest alternatives if applicable

4. **Create Action Plan**

   - Break down work into numbered, sequential steps
   - Use the todo list tool to track progress
   - Present plan for your approval

5. **Execute with Approval**
   - **CRITICAL: I will NOT modify any code until you approve the plan**
   - Execute each step in sequence
   - Wait for your approval before proceeding to next step
   - Provide progress updates after each step

**Example Interaction:**

```
You: "Add a loading spinner to the blog posts"

Me:
📋 IDEA: Add loading UI feedback for better UX when fetching blog posts

🔍 ROOT CAUSE: Users don't know data is loading, causing confusion

⚖️ PROS & CONS:
Pros:
- Improves perceived performance
- Better user experience
- Follows modern UX patterns

Cons:
- Adds component complexity
- May flash too quickly on fast connections
- Need to handle loading states in multiple places

📝 PLAN:
1. Add Spinner component using shadcn/ui
2. Update usePostsQuery to expose isLoading state
3. Modify blog listing to show spinner
4. Test loading behavior

Approve to proceed? (yes/no)
```

---

## 2. Project Context

### Overview

Personal portfolio and blog website built with Next.js 16, showcasing full-stack development expertise. Features include a blog system, project management dashboard, task tracking, and AI-powered chat.

### Tech Stack

- **Framework:** Next.js 15.5.7 (App Router, React 19, Turbopack)
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 4 + shadcn/ui (New York style) + SCSS
- **UI Components:** shadcn/ui (Radix UI primitives) + Base UI Components
- **Database:** MongoDB 6.5+ (native driver, no Mongoose)
- **State Management:** TanStack Query v5
- **Forms:** React Hook Form + Yup
- **Authentication:** Custom auth with bcrypt + jose (JWT)
- **Cloud:** AWS S3 (file storage via @aws-sdk/client-s3)
- **AI:** Google Generative AI (@google/genai)
- **Rich Text:** MDXEditor
- **Charts:** AG Charts React
- **Animation:** Framer Motion
- **Date:** date-fns & dayjs
- **i18n:** i18next & react-i18next
- **Analytics:** Vercel Analytics & Speed Insights

### Architecture

### Directory Structure

```
app/                      # Next.js App Router pages
  api/                   # API routes
    ai/                  # AI chat endpoints
    auth/                # Authentication endpoints
    backup/              # Database backup endpoints
    comments/            # Comment CRUD endpoints
    mongo/               # MongoDB utility endpoints
    permissions/         # Permission management endpoints
    posts/               # Blog post endpoints
    projects/            # Project management endpoints
    resources/           # Resource/file endpoints
    sprints/             # Sprint management endpoints
    tasks/               # Task management endpoints
    upload/              # File upload endpoints (S3)
    users/               # User management endpoints
    route.ts             # Root API route
  auth/                  # Authentication pages
    sign-in/             # Sign-in page
    layout.tsx           # Auth layout
    loading.tsx          # Auth loading state
  dashboard/             # Dashboard pages
    apps/                # Apps section
    home/                # Dashboard home
    notes/               # Notes management
    posts/               # Post management
    projects/            # Project management
    settings/            # Settings pages
    users/               # User management
    layout.tsx           # Dashboard layout
    template.tsx         # Dashboard template
  posts/                 # Public blog pages
    [slug]/              # Dynamic blog post pages
    page.tsx             # Blog listing page
  privacy/               # Privacy policy page
  projects/              # Public projects page
  resources/             # Shared resources (PRIMARY ORGANIZATION HUB)
    components/          # All reusable components
      common/            # Core UI components (shadcn/ui + custom)
        Avatar.tsx
        Badge.tsx
        Button.tsx
        Card.tsx
        Dialog.tsx
        Drawer.tsx
        DropdownMenu.tsx
        Empty.tsx
        ErrorBoundary.tsx
        Input.tsx
        Label.tsx
        Loader.tsx
        PageFilter.tsx
        Popover.tsx
        Select.tsx
        Separator.tsx
        Skeleton.tsx
        Table.tsx
        Textarea.tsx
        ThemeToggle.tsx
        Toast.tsx
        Toaster.tsx
        Tooltip.tsx
        Transition.tsx
        VisuallyHidden.tsx
        calendar.tsx
        drawers/           # Drawer components
        hocs/              # Higher-order components
        modals/            # Modal components
        providers/         # Context providers (Global, Theme, Query)
        withSearchFilter.tsx
      content/             # Content-specific components
      features/            # Feature-specific components
        Dashboard/         # Dashboard feature components
        Post/              # Post feature components
        Project/           # Project feature components
        Settings/          # Settings feature components
        Task/              # Task feature components
        User/              # User feature components
      form/                # Form components
        DynamicDatePicker.tsx
        DynamicForm.tsx
        DynamicMarkdown.tsx
        DynamicSelect.tsx
        DynamicTable.tsx
        DynamicText.tsx
        Fields/            # Form field components
        types.ts
      helpers/             # Helper components
      layout/              # Layout components
      index.ts             # Component exports
    hooks/                 # Custom React hooks
      use-toast.ts
      useDebounce.ts
      useTaskFilter.ts
      useTheme.ts
    landing/               # Landing page components
      components/          # Landing sub-components
      LandingPage.tsx      # Main landing page
    queries/               # TanStack Query hooks (ALL DATA FETCHING)
      authQueries.ts
      commentQueries.ts
      metaQueries.ts
      permissionQueries.ts
      postQueries.ts
      projectQueries.ts
      queryKeys.ts
      resourceQueries.ts
      sprintQueries.ts
      statusQueries.ts
      taskQueries.ts
      userQueries.ts
      useSession.ts
    styles/                # Global SCSS styles
    utils/                 # Helper functions and constants
    font.ts                # Font configuration (local fonts)
  support/                 # Support page
  error.tsx                # Error boundary
  layout.tsx               # Root layout
  loading.tsx              # Root loading state
  page.tsx                 # Home page
  sitemap.ts               # Sitemap generation
features/                  # Feature modules (client-side logic)
  Auth/                    # Authentication logic
    hooks/                 # Auth hooks
    models/                # Auth models
    services/              # Auth services
    types/                 # Auth types
    index.ts
  GenAI/                   # AI/LLM integration (Google Gemini)
    controllers/           # AI controllers
    dto/                   # Data transfer objects
    hooks/                 # AI hooks
    models/                # AI models
    prompts/               # AI prompts
    repositories/          # AI repositories
    schemas/               # AI schemas
    services/              # AI services
    index.ts
  Landing/                 # Landing page client components
    components/            # Client components (Navbar, Contact, Experience)
lib/                       # Shared utilities and interfaces
  commons/
    constants/             # Application constants
    errors/                # Error definitions
  interfaces/              # TypeScript interfaces
    base.d.ts
    controller.ts
    enums.ts
    model.d.ts
    shared.ts
  utils/                   # Utility functions
    helper.ts
    network.ts
server/                    # Backend logic
  .aws/                    # AWS configurations
  actions/                 # Server actions (Next.js server actions)
    authActions.ts
    blogActions.ts
    dataActions.ts
    projectActions.ts
  configs/                 # Server configurations
    jest.setup.js
  controllers/             # API controllers (MVC pattern)
    AIController.ts
    AuthController.ts
    CommentController.ts
    PermissionController.ts
    PostController.ts
    ProjectController.ts
    ResourceController.ts
    SprintController.ts
    StorageController.ts
    TaskController.ts
    UserController.ts
  dto/                     # Data transfer objects
    Comment.ts
    Task.ts
  models/                  # Database models (MongoDB native)
    Comment.ts
    User.ts
  repositories/            # Data access layer (Repository pattern)
    MongoCommentRepository.ts
    MongoPermissionRepository.ts
    MongoPostRepository.ts
    MongoProjectRepository.ts
    MongoSprintRepository.ts
    MongoTaskRepository.ts
    MongoUserPermissionRepository.ts
    MongoUserRepository.ts
  services/                # Business logic services
    AuthService.ts
    CommentService.ts
    GeminiService.ts
    LogService.ts
    MongoService.ts
    PermissionService.ts
    S3Service.ts
public/                    # Static assets
  assets/
    images/                # Image files
      avatar.png
      bg.jpeg
      email.svg
      logo.svg
      logo-dark.svg
      preview.png
      support.jpeg
      vietnam_flag.png
      icons/               # Icon files
      socials/             # Social media icons
    sounds/                # Audio files
  fonts/                   # Font files
  locales/                 # i18n translations
    en/                    # English translations
    ge/                    # Georgian translations
  ads.txt
  browserconfig.xml
  favicon files...
  robots.txt
  site.webmanifest
  test.glb
```

### Path Aliases (tsconfig.json)

```typescript
"@app/*"       → "app/*"            // App Router pages and API routes
"@resources/*" → "app/resources/*"  // Primary alias for shared resources
"@lib/*"       → "lib/*"            // Shared utilities and interfaces
"@server/*"    → "server/*"         // Backend logic (controllers, services, repositories)
"@public/*"    → "public/*"         // Static assets
"@features/*"  → "features/*"       // Feature modules (Auth, GenAI, Landing)
```

---

## 3. Code Patterns

### Component Patterns

**Server Components (default in app/ directory):**

```typescript
// app/resources/landing/components/Hero.tsx
export default async function Hero() {
  const data = await fetchData();
  return <section>...</section>;
}
```

**Client Components (require "use client"):**

```typescript
// features/Landing/components/Navbar.tsx
"use client";

import { useState } from "react";

// features/Landing/components/Navbar.tsx

// features/Landing/components/Navbar.tsx

// features/Landing/components/Navbar.tsx

// features/Landing/components/Navbar.tsx

// features/Landing/components/Navbar.tsx

export const Navbar = () => {
  const [state, setState] = useState();
  return <nav>...</nav>;
};
```

**When to Use Client Components:**

- Event handlers (onClick, onChange)
- React hooks (useState, useEffect, useContext)
- Browser APIs (localStorage, window)
- Third-party libraries requiring client-side (framer-motion, charts)

---

## 4. UI Standards

### UI Component Guidelines

**Always use shadcn/ui components:**

```typescript
// ✅ Correct
import { Button } from "@resources/components/common/Button";
import { Card } from "@resources/components/common/Card";
import { Input } from "@resources/components/common/Input";
import { Drawer, DrawerContent } from "@resources/components/common/Drawer";

<Button variant="default">Click</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost" size="icon"><Icon /></Button>

// ❌ Incorrect - DO NOT USE
import Button from "@mui/material/Button";
import BaseButton from "@app/components/commons/buttons/BaseButton";
```

**Button API:**

- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- Children for content: `<Button>Text</Button>` or `<Button><Icon /></Button>`

**Utility Function:**

```typescript
import { cn } from "@resources/utils/cn";

<div className={cn("base-class", condition && "conditional-class", className)} />;
```

### Styling Conventions

**Tailwind CSS First:**

```typescript
// ✅ Preferred
<div className="flex items-center gap-4 p-6 bg-slate-100 dark:bg-slate-900">

// ⚠️ Use SCSS only for complex animations or global styles
```

**Dark Mode:**

```typescript
<div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100">
```

**Responsive Design:**

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## 5. Critical Constraints

### Material-UI → shadcn/ui Migration (COMPLETED)

**Status:**

- ✅ Button components migrated to shadcn/ui
- ✅ BaseButton deleted
- ✅ Drawer migrated to shadcn/ui (vaul)
- ✅ All common components use shadcn/ui
- ⚠️ Legacy: Some MUI theme provider code may still exist but is unused

**DO NOT:**

- Import or use BaseButton (deleted)
- Create new MUI component instances
- Use MUI-specific props (variant="contained", color="primary", startIcon)
- Import from @mui/material

**ALWAYS USE:**

- shadcn/ui components from `@resources/components/common/`
- Tailwind CSS for styling
- `cn()` utility for className composition

### Quick Decision Rules

**Component Type:**

- Has event handlers or hooks? → Client Component ("use client")
- Fetches data or pure render? → Server Component (default)

**Styling:**

- Simple styles? → Tailwind CSS
- Complex animations? → SCSS or CSS-in-JS

**Forms:**

- Simple forms? → DynamicFormV2
- Complex validation? → Custom React Hook Form + Yup

**Data:**

- Client-side state? → TanStack Query
- Server-side data? → Server Actions

---

## 6. Development Reference

### Form Handling (Back Reference)

**React Hook Form + DynamicForm:**

```typescript
import DynamicForm from "@resources/components/form/DynamicForm";
// OR for newer version:
import DynamicFormV2 from "@resources/components/form/DynamicFormV2";

const config: DynamicFormConfig = {
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "content", label: "Content", type: "textarea" },
  ],
  submitProps: { children: "Save" },
};

<DynamicForm config={config} onSubmit={handleSubmit} />;
```

**Custom Forms:**

```typescript
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({ name: yup.string().required() });
const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });
```

### Data Fetching

**TanStack Query:**

```typescript
// Query
import { usePostsQuery, usePostQuery } from "@resources/queries/postQueries";
// Mutation
import { useCreatePostMutation, useUpdatePostMutation } from "@resources/queries/postQueries";

const { data: posts, isLoading } = usePostsQuery({ published: true });

const mutation = useCreatePostMutation();
mutation.mutate({ title: "New Post" });
```

**Server Actions:**

```typescript
// server/actions/blogActions.ts
import { getPosts } from "@server/actions/blogActions";

const posts = await getPosts({ page: 1, pageSize: 10 });
```

### API Routes

**Structure:**

```typescript
// app/api/posts/route.ts
import PostController from "@server/controllers/PostController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const controller = new PostController();
  return controller.getPosts(request);
}

export async function POST(request: NextRequest) {
  const controller = new PostController();
  return controller.createPost(request);
}
```

**Controller Pattern:**

```typescript
// server/controllers/PostController.ts
class PostController extends BaseController {
  async getPosts(request: NextRequest) {
    const posts = await this.postService.findAll();
    return this.success(posts);
  }
}
```

### Database (MongoDB)

**Model Definition:**

```typescript
// server/models/User.ts or Comment.ts
// Uses MongoDB native driver (no Mongoose)
// Models are plain TypeScript interfaces + repository pattern

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  createdAt?: Date;
}
```

**Repository Pattern:**

```typescript
// server/repositories/MongoUserRepository.ts
class MongoUserRepository {
  async findById(id: string): Promise<User | null> {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }
}
```

### Authentication

**Auth Check:**

```typescript
import { isUserAuthorized } from "@features/Auth";

const user = await isUserAuthorized(request);
if (!user) return unauthorized();
```

**Session Hook:**

```typescript
import { useSession } from "@resources/queries/useSession";

const { user, isLoading } = useSession();
```

### Testing & Development Commands

```bash
# Testing
npm test              # Run Jest tests
npm run lint          # ESLint + Prettier

# Development
npm run dev           # Start dev server (Turbopack)
npm run build         # Production build
npm start             # Production server
```

### Environment Variables

Required `.env.local`:

```env
MONGODB_URI=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=
GOOGLE_GENAI_API_KEY=
ENCRYPTION_SECRET=
GOOGLE_ANALYTICS_ID=
```

### Key Features

1. **Blog System:** MDX editor, markdown rendering, SEO optimization
2. **Dashboard:** Project management, task tracking, sprint planning
3. **AI Chat:** Google Generative AI integration
4. **File Upload:** AWS S3 integration
5. **Authentication:** Custom auth with session management
6. **Dark Mode:** System preference detection + manual toggle
7. **Responsive Design:** Mobile-first approach

### Common Patterns

**Lazy Loading:**

```typescript
import { lazy, Suspense } from "react";

const Contact = lazy(() => import("@features/Landing/components/Contact"));

<Suspense fallback={<Loader />}>
  <Contact />
</Suspense>;
```

**Error Handling:**

```typescript
import { useGlobal } from "@resources/components/common/providers/GlobalProvider";

const { notify } = useGlobal();
notify("Success message", "success");
notify("Error message", "error");
```

**Type Safety:**

```typescript
// Use shared types
import type { Post, Project, Task } from "@lib/interfaces/model";

// Avoid Record<string, unknown>, prefer specific types
const posts: Post[] = [];
```

### Performance & Accessibility

**Performance:**

- Use Next.js Image for all images
- Implement loading states for async operations
- Use React.memo for expensive renders
- Lazy load heavy components
- Optimize bundle size (Code splitting)

**Accessibility:**

- Use semantic HTML
- Include aria-labels for icon buttons
- Ensure keyboard navigation
- Maintain color contrast (WCAG AA)

---

**When in doubt:**

- Prefer server components over client components
- Use shadcn/ui components over custom implementations
- Follow Next.js 16 App Router best practices
- Maintain type safety with TypeScript
- Keep components small and focused
