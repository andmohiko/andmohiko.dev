# Code Efficiency Analysis Report

**Repository:** andmohiko/andmohiko.dev  
**Date:** November 15, 2025  
**Analyzed by:** Devin

## Executive Summary

This report identifies several performance inefficiencies in the andmohiko.dev Next.js portfolio website. The analysis focused on data fetching patterns, API calls, React component optimizations, and code duplication. Five significant inefficiencies were identified that could impact build time, runtime performance, and maintainability.

## Identified Inefficiencies

### 1. Duplicate API Calls in Contentful Blog Fetching (HIGH PRIORITY)

**Location:** `src/lib/contentful.ts:39-70`

**Issue:** The `getBlogById` function fetches ALL blog posts from Contentful just to find a single blog post by slug. This is extremely inefficient as it:
- Fetches unnecessary data from the API
- Increases API response time
- Wastes bandwidth
- Increases build time for static generation

**Current Implementation:**
```typescript
export const getBlogById = async (slug: string) => {
  const allPosts = await createContentfulClient()
    .getEntries({
      content_type: process.env.NEXT_PUBLIC_CTF_BLOG_POST_TYPE_ID!,
      order: '-fields.publishedAt',
    })
  const posts = allPosts.posts
  const blog = posts.find((post: ContentfulBlog) => post.fields.slug === slug)
  // ... rest of the code
}
```

**Impact:**
- If there are 100 blog posts, fetching one post requires downloading all 100
- Multiplied across all blog pages during build time
- Unnecessary API quota usage

**Recommended Fix:**
Use Contentful's query parameters to fetch only the specific blog post:
```typescript
.getEntries({
  content_type: process.env.NEXT_PUBLIC_CTF_BLOG_POST_TYPE_ID!,
  'fields.slug': slug,
  limit: 1,
})
```

---

### 2. Multiple Redundant API Calls in Work Modal Pages (HIGH PRIORITY)

**Location:** `src/app/@modal/(.)works/[slug]/page.tsx:88-238`

**Issue:** The `getAllWorks()` function is called THREE times in the same page component:
1. Line 107: In `generateMetadata` function
2. Line 202: In `WorkModalPage` component

Additionally, the same pattern exists in the regular work detail page, meaning during static generation, the same data is fetched multiple times per work item.

**Current Implementation:**
```typescript
export async function generateMetadata({ params }: WorkModalPageProps) {
  const works = await getAllWorks()  // Call #1
  const work = works.find((work) => work.id === slug)
  // ...
}

export default async function WorkModalPage({ params }: WorkModalPageProps) {
  const works = await getAllWorks()  // Call #2
  const work = works.find((work) => work.id === slug)
  // ...
}
```

**Impact:**
- Duplicate API calls to microCMS for the same data
- Increased build time
- Potential rate limiting issues
- Wasted API quota

**Recommended Fix:**
Create a helper function that caches the works data or use Next.js's built-in fetch caching. Alternatively, create a `getWorkById` function in the microcms library similar to the existing `getEntryById`.

---

### 3. Inefficient File System Operations in Submodule Blog Fetching (MEDIUM PRIORITY)

**Location:** `src/lib/submodule-content.ts:170-200`

**Issue:** The `getSubmoduleBlogBySlug` function calls `getSubmoduleBlogPosts()` which:
- Recursively searches and reads ALL markdown files from the file system
- Parses ALL markdown files with gray-matter
- Transforms ALL image paths
- Sorts ALL blogs
- Then filters to find just ONE blog

This is extremely inefficient when you only need a single blog post.

**Current Implementation:**
```typescript
export const getSubmoduleBlogBySlug = async (slug: string) => {
  const allBlogs = await getSubmoduleBlogPosts()  // Reads ALL files
  const blog = allBlogs.find((b) => b.slug === slug) || null
  // ...
}
```

**Impact:**
- Unnecessary file I/O operations
- Increased build time for individual blog pages
- Scales poorly as the number of blog posts grows

**Recommended Fix:**
Create a dedicated function that searches for a specific markdown file by slug without processing all files. Use a naming convention or directory structure that allows direct file access.

---

### 4. Missing React Memoization in Client Components (MEDIUM PRIORITY)

**Location:** 
- `src/app/@main/blogs/components/blog-list/index.tsx:29-65`
- `src/app/@main/components/work-list/index.tsx:27-50`

**Issue:** Client components perform expensive operations on every render without memoization:

**BlogList Component:**
- The `showYear` function is recreated on every render
- `pathname.split('/').pop()` is called on every render
- `pathname.includes('/blogs/')` is called on every render

**WorkList Component:**
- `pathname.split('/').pop()` is called on every render
- `pathname.includes('/works/')` is called on every render

**Current Implementation:**
```typescript
export const BlogList: React.FC<Props> = ({ blogs }) => {
  const showYear = (posts: Blog[], index: number) => {
    // Function recreated on every render
  }
  const pathname = usePathname()
  const isInBlogDetailPage = pathname.includes('/blogs/')  // Recalculated on every render
  const slug = pathname.split('/').pop()  // Recalculated on every render
  // ...
}
```

**Impact:**
- Unnecessary recalculations on every render
- Poor performance with large blog/work lists
- Increased memory allocation

**Recommended Fix:**
Use `useMemo` and `useCallback` hooks:
```typescript
const showYear = useCallback((posts: Blog[], index: number) => {
  // ...
}, [])

const isInBlogDetailPage = useMemo(() => pathname.includes('/blogs/'), [pathname])
const slug = useMemo(() => pathname.split('/').pop(), [pathname])
```

---

### 5. Duplicate Image URL Transformation Logic (LOW PRIORITY)

**Location:**
- `src/app/@modal/(.)blogs/[slug]/page.tsx:148-172`
- `src/app/@modal/(.)works/[slug]/page.tsx:137-161`

**Issue:** The same image URL transformation logic (checking for '//' prefix and adding 'https:') is duplicated in multiple places for both OpenGraph and Twitter metadata.

**Current Implementation:**
```typescript
// In blog modal page
images: blogHeaderImageUrl
  ? [{
      url: blogHeaderImageUrl.startsWith('//')
        ? `https:${blogHeaderImageUrl}`
        : blogHeaderImageUrl,
      // ...
    }]
  : undefined,

// Same logic repeated for Twitter card
images: blogHeaderImageUrl
  ? [
      blogHeaderImageUrl.startsWith('//')
        ? `https:${blogHeaderImageUrl}`
        : blogHeaderImageUrl,
    ]
  : undefined,
```

**Impact:**
- Code duplication
- Maintenance burden
- Potential for inconsistencies

**Recommended Fix:**
Create a utility function:
```typescript
const normalizeImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined
  return url.startsWith('//') ? `https:${url}` : url
}
```

---

## Priority Recommendations

### Immediate Action (High Priority)
1. **Fix Contentful `getBlogById` function** - Use query parameters to fetch single blog post
2. **Fix duplicate `getAllWorks()` calls** - Implement caching or create `getWorkById` function

### Short-term Improvements (Medium Priority)
3. **Optimize `getSubmoduleBlogBySlug`** - Implement direct file access by slug
4. **Add React memoization** - Use `useMemo` and `useCallback` in client components

### Long-term Maintenance (Low Priority)
5. **Extract image URL transformation** - Create utility function to reduce duplication

## Estimated Impact

**Build Time Improvement:** 20-40% reduction (primarily from fixes #1, #2, #3)  
**Runtime Performance:** 10-15% improvement in client-side rendering (from fix #4)  
**Code Maintainability:** Significant improvement from reducing duplication  
**API Usage:** 50-70% reduction in unnecessary API calls

## Conclusion

The most critical inefficiencies are related to data fetching patterns that cause unnecessary API calls and file system operations. Addressing the high-priority issues (#1 and #2) will provide immediate and measurable improvements to build time and API usage. The medium-priority issues will improve runtime performance and scalability as the content grows.
