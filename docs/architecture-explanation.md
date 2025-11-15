# andmohiko.dev - Architecture Guide for New Engineers

## Overview

andmohiko.dev is a portfolio and blog website built with Next.js 15 using the App Router. The site showcases works, blog posts, and a personal profile with a sophisticated modal-based navigation system that provides an excellent user experience while maintaining SEO optimization.

## Technology Stack

### Core Framework
- **Next.js 15.4.4** with App Router and React 19
- **TypeScript 5** for type safety
- **pnpm** as the package manager
- **Turbopack** for fast development builds

### Content Management
The site aggregates content from multiple sources:
- **Contentful CMS** - Primary blog content storage
- **microCMS** - Works/portfolio entries and additional blog entries
- **Git Submodules** - Markdown-based blog posts stored in a separate repository

### Styling & UI
- **CSS Modules** - Component-scoped styling
- **Zen Maru Gothic** - Google Font for Japanese typography
- **Framer Motion** - Animation library
- **React Icons** - Icon components

### Content Processing
- **React Markdown** - Markdown rendering with remark-gfm for GitHub Flavored Markdown
- **rehype-raw** & **rehype-sanitize** - HTML processing and sanitization
- **gray-matter** - Frontmatter parsing for markdown files
- **Day.js** - Date formatting and manipulation

### Deployment & Hosting
- **Vercel** - Primary hosting platform
- **Cloudflare Pages** - Alternative deployment target (configured via wrangler.toml)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **cspell** - Spell checking
- **Renovate** - Automated dependency updates

## Project Structure

```
andmohiko.dev/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── @main/               # Parallel Route: Main content slot
│   │   │   ├── page.tsx         # Works list (homepage)
│   │   │   ├── blogs/           # Blog list page
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/  # Blog list components
│   │   │   ├── profile/         # Profile/about page
│   │   │   │   └── components/
│   │   │   └── works/           # Works list page
│   │   │       └── page.tsx
│   │   │
│   │   ├── @modal/              # Parallel Route: Modal slot
│   │   │   ├── default.tsx      # Empty fallback
│   │   │   ├── (.)blogs/[slug]/ # Intercepting Route for blog modals
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   ├── blogs/[slug]/    # Direct access route
│   │   │   │   └── page.tsx
│   │   │   ├── (.)works/[slug]/ # Intercepting Route for work modals
│   │   │   │   └── page.tsx
│   │   │   └── works/[slug]/    # Direct access route
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx           # Root layout with Parallel Routes
│   │   ├── page.tsx             # Root page
│   │   ├── globals.css          # Global styles
│   │   └── manifest.ts          # PWA manifest
│   │
│   ├── components/              # Shared components
│   │   ├── analytics/           # Google Analytics
│   │   ├── displays/            # Display components
│   │   ├── layout/              # Layout components
│   │   │   ├── left-column/     # Main content wrapper
│   │   │   ├── right-column/    # Navigation/modal wrapper
│   │   │   └── base-modal/      # Modal overlay component
│   │   ├── navigation/          # Navigation components
│   │   │   ├── global-navigation/
│   │   │   ├── sp-header/       # Mobile header
│   │   │   └── content-paginator/
│   │   └── typography/          # Text components
│   │
│   ├── lib/                     # Business logic and data fetching
│   │   ├── contentful.ts        # Contentful API client
│   │   ├── microcms.ts          # microCMS API client
│   │   ├── submodule-content.ts # Git submodule content loader
│   │   ├── blog-aggregator.ts   # Aggregates blogs from all sources
│   │   ├── blur-placeholder.ts  # Image blur placeholder generator
│   │   └── analytics-consent.ts # Analytics consent management
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── blog.ts              # Blog and ContentfulBlog types
│   │   ├── work.ts              # Work type
│   │   └── entry.ts             # Entry type
│   │
│   └── contents/                # Static content (likely submodule)
│
├── public/                      # Static assets
│   └── images/                  # Images and icons
│
├── scripts/                     # Build scripts
│   └── copy-submodule-images.ts # Copies images from submodule
│
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── eslint.config.mjs            # ESLint configuration
├── .prettierrc.js               # Prettier configuration
├── wrangler.toml                # Cloudflare Pages configuration
└── spec.md                      # Detailed technical specification
```

## Core Architectural Concepts

### 1. Parallel Routes

The application uses Next.js Parallel Routes to render multiple page segments simultaneously in the same layout. This is achieved through special folder naming with the `@` prefix.

**Implementation:**
- `@main` slot: Contains the main content (blog list, works list, profile)
- `@modal` slot: Contains modal overlays for detailed views
- Both slots are rendered in `layout.tsx` and passed as props

**Benefits:**
- Independent loading states for different UI sections
- Ability to show multiple pages in the same view
- Maintains layout state during navigation

### 2. Intercepting Routes

Intercepting Routes allow the application to show different content based on how the user navigated to a URL.

**Pattern: `(.)`**
The `(.)` prefix intercepts routes at the same level. For example:
- `@modal/(.)blogs/[slug]/page.tsx` intercepts `/blogs/[slug]` when navigating from within the app
- `@modal/blogs/[slug]/page.tsx` handles direct URL access or page refresh

**User Experience Flow:**

```
User clicks blog link from list
  ↓
URL changes to /blogs/my-post
  ↓
Next.js intercepts the route
  ↓
@modal/(.)blogs/[slug]/page.tsx renders (modal view)
@main slot remains unchanged (list stays visible in background)
  ↓
User sees modal overlay with blog content
Background shows the list they came from
  ↓
User presses back button → returns to list
```

```
User directly visits /blogs/my-post (bookmark, share link, refresh)
  ↓
No interception occurs
  ↓
@modal/blogs/[slug]/page.tsx renders (full page view)
  ↓
User sees full page with blog content
SEO-friendly, shareable URL
```

### 3. Static Site Generation (SSG)

All pages are pre-rendered at build time for optimal performance and SEO.

**Key Functions:**

**`generateStaticParams()`**
```typescript
// Runs at build time to generate all possible [slug] values
export async function generateStaticParams() {
  const blogs = await getAllAggregatedBlogs()
  return blogs.map(blog => ({ slug: blog.slug }))
}
```

**`generateMetadata()`**
```typescript
// Generates unique metadata for each page
export async function generateMetadata({ params }) {
  const { blog } = await getAggregatedBlogBySlug(params.slug)
  return {
    title: blog.title,
    description: blog.description,
    openGraph: { /* ... */ },
    twitter: { /* ... */ }
  }
}
```

**Static Configuration:**
```typescript
export const dynamic = 'force-static'  // Force static generation
export const revalidate = false        // No revalidation
```

### 4. Content Aggregation System

The site aggregates content from three different sources into a unified interface.

**Architecture:**

```
┌─────────────────────────────────────────────────┐
│         Blog Aggregator (blog-aggregator.ts)    │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌─────────┐    ┌──────────┐   ┌──────────────┐
   │Contentful│    │microCMS  │   │Git Submodule │
   │  (CMS)   │    │  (CMS)   │   │  (Markdown)  │
   └─────────┘    └──────────┘   └──────────────┘
        │               │               │
        └───────────────┴───────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Unified Blog[]  │
              │  Sorted by date  │
              └──────────────────┘
```

**Implementation Details:**

**`getAllAggregatedBlogs()`** in `lib/blog-aggregator.ts`:
1. Fetches data from all three sources in parallel using `Promise.all()`
2. Transforms each source's data format into a unified `Blog` type
3. Adds a `source` field to track origin ('contentful' | 'microcms' | 'submodule')
4. Sorts all blogs by `publishedAt` date in descending order
5. Returns a single array of blogs

**`getAggregatedBlogBySlug(slug)`**:
1. First checks submodule content for the slug
2. If not found, checks Contentful
3. Returns the blog along with `previousSlug` and `nextSlug` for navigation
4. Handles errors gracefully, returning null if not found

### 5. Layout System

The layout uses a two-column design with modal overlay capability.

**Component Hierarchy:**

```
RootLayout (layout.tsx)
├── LeftColumn (left-column/index.tsx)
│   ├── SPHeader (mobile header)
│   ├── main slot OR children
│   └── SPNavi (mobile navigation)
│
└── RightColumn (right-column/index.tsx)
    ├── If detail page with modal:
    │   └── modal slot (BaseModal wrapper)
    │
    └── Otherwise:
        └── GlobalNavigation (sidebar)
```

**Responsive Behavior:**
- Desktop: Two-column layout with fixed navigation sidebar
- Mobile: Single column with header/footer navigation
- Modal: Overlay on desktop, full screen on mobile

**Modal Detection Logic:**
```typescript
// In RightColumn component
const pathname = usePathname()
const isDetailPage = /^\/(blogs|works)\/[^/]+$/.test(pathname)
const isDetailModal = isDetailPage && modal && React.isValidElement(modal)
```

## Data Flow

### Build Time (SSG)

```
1. Build Process Starts
   ↓
2. generateStaticParams() executes
   ├── Fetches all blogs from Contentful
   ├── Fetches all blogs from submodule
   ├── Fetches all works from microCMS
   └── Returns array of { slug } objects
   ↓
3. For each slug:
   ├── generateMetadata() executes
   │   └── Fetches specific blog/work data
   │   └── Returns metadata object
   │
   └── Page component executes
       └── Fetches specific blog/work data
       └── Renders HTML
   ↓
4. Static HTML files generated
   └── Deployed to CDN (Vercel/Cloudflare)
```

### Runtime (User Navigation)

```
User visits homepage (/)
   ↓
CDN serves pre-rendered HTML
   ↓
React hydrates the page
   ↓
User clicks blog link
   ↓
Client-side navigation (no page reload)
   ↓
URL changes to /blogs/my-post
   ↓
Intercepting Route activates
   ↓
Modal renders with pre-fetched data
   ↓
Background content remains visible
```

## Key Files Explained

### `src/app/layout.tsx`
The root layout that orchestrates the entire application structure. It:
- Defines global metadata for SEO
- Loads Google Fonts
- Sets up Parallel Routes with `main` and `modal` slots
- Renders the two-column layout structure
- Includes Google Analytics

### `src/lib/blog-aggregator.ts`
The central hub for all blog content. It:
- Aggregates blogs from Contentful, microCMS, and git submodules
- Provides a unified `Blog` type interface
- Handles sorting and navigation (previous/next)
- Manages error handling for each source independently

### `src/components/layout/right-column/index.tsx`
Controls when to show the modal vs. the sidebar. It:
- Detects detail page URLs using regex
- Switches between modal and navigation display
- Manages the visual transition between states

### `src/components/layout/base-modal/index.tsx`
The modal wrapper component that:
- Provides the overlay background
- Handles close button clicks
- Manages navigation back to list pages
- Provides accessibility features

## Environment Variables

The application requires several environment variables for CMS access:

```bash
# Contentful CMS
NEXT_PUBLIC_CTF_SPACE_ID=your_space_id
NEXT_PUBLIC_CTF_CDA_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_CTF_BLOG_POST_TYPE_ID=your_content_type_id

# microCMS
NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN=your_service_domain
NEXT_PUBLIC_MICROCMS_API_KEY=your_api_key

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
```

## Build & Development

### Development
```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server with Turbopack
```

The dev script automatically runs `copy:images` to copy images from the submodule.

### Production Build
```bash
pnpm run build        # Build for production
pnpm run start        # Start production server
```

### Code Quality
```bash
pnpm run lint         # Run ESLint
pnpm run clean        # Clean build artifacts
```

## Performance Optimizations

1. **Static Site Generation**: All pages pre-rendered at build time
2. **Image Optimization**: Next.js Image component with blur placeholders
3. **Font Optimization**: Google Fonts with `display: swap` and preload
4. **Code Splitting**: Automatic with Next.js App Router
5. **Compression**: Enabled in next.config.ts
6. **SWC Minification**: Fast minification with SWC

## SEO Features

1. **Metadata Generation**: Unique metadata for each page
2. **Open Graph Tags**: Rich social media previews
3. **Twitter Cards**: Optimized Twitter sharing
4. **Robots.txt**: Proper crawling instructions
5. **Sitemap**: Auto-generated by Next.js
6. **Structured Data**: Article schema for blog posts
7. **Semantic HTML**: Proper use of semantic elements

## Common Development Patterns

### Adding a New Blog Source

1. Create a new client in `src/lib/`
2. Define the data fetching functions
3. Update `src/lib/blog-aggregator.ts` to include the new source
4. Add transformation logic to convert to unified `Blog` type
5. Update the `AggregatedBlog` type to include the new source

### Adding a New Page

1. Create a new route in `src/app/@main/`
2. If it needs modal support, create intercepting route in `src/app/@modal/`
3. Implement `generateStaticParams()` if using dynamic routes
4. Implement `generateMetadata()` for SEO
5. Set `dynamic = 'force-static'` for SSG

### Styling a Component

1. Create a CSS Module file alongside the component (e.g., `index.module.css`)
2. Import styles: `import styles from './index.module.css'`
3. Use classNames: `className={styles.myClass}`
4. Use `classnames` package for conditional classes

## Troubleshooting

### Modal Not Showing
- Check that the URL matches the regex pattern in `right-column/index.tsx`
- Verify the intercepting route folder structure uses `(.)`
- Ensure the modal slot is being passed to the layout

### Build Failing
- Check environment variables are set
- Verify CMS content is accessible
- Check for TypeScript errors
- Ensure submodule is initialized: `git submodule update --init --recursive`

### Images Not Loading
- Run `pnpm run copy:images` to copy submodule images
- Check image domains are configured in `next.config.ts`
- Verify image paths are correct

## Architecture Decisions & Rationale

### Why Parallel Routes?
Parallel Routes allow us to maintain the list view in the background while showing a modal. This provides better UX as users don't lose their scroll position or context when viewing details.

### Why Intercepting Routes?
Intercepting Routes enable us to show different UI for the same URL based on navigation context. This means:
- Users clicking from the list get a modal (better UX)
- Users accessing directly get a full page (better SEO, shareable)
- Single URL for both cases (no duplicate content issues)

### Why Multiple CMS Sources?
The aggregation system allows flexibility in content management:
- Contentful for rich blog posts with images
- microCMS for portfolio works
- Git submodules for markdown-based technical posts
- All unified in a single interface for users

### Why SSG Over SSR?
Static generation provides:
- Fastest possible page loads (served from CDN)
- No server costs for rendering
- Better SEO (content always available)
- Simpler deployment and scaling

## Next Steps for New Engineers

1. **Read the spec.md file** - Contains detailed technical specifications
2. **Explore the codebase** - Start with `src/app/layout.tsx` and follow the component tree
3. **Run the development server** - See the site in action
4. **Make a small change** - Try adding a new component or modifying styles
5. **Read Next.js App Router docs** - Understand the framework's capabilities
6. **Review the blog aggregator** - Understand how content flows through the system

## Additional Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Parallel Routes Guide](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [Intercepting Routes Guide](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [microCMS Documentation](https://document.microcms.io/)

---

**Welcome to the team! This architecture enables a fast, SEO-friendly, and user-friendly portfolio site. The combination of Parallel Routes, Intercepting Routes, and SSG creates a unique experience that balances performance, UX, and maintainability.**
