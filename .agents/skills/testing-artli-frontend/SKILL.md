# Testing Artli Frontend

## Overview
Artli is a Next.js (App Router) application with Tailwind CSS, styled as a pixiv-like art SNS/browsing platform. It uses Neon PostgreSQL via Prisma 7 with the PrismaNeon adapter for data storage.

## Dev Server Setup
```bash
cd /home/ubuntu/repos/testest
npm install
npx prisma generate
npm run dev
# Runs on http://localhost:3000 (or next available port like 3001)
```

Requires `.env` or `.env.local` file with `DATABASE_URL` and `DIRECT_DATABASE_URL` pointing to the Neon database.

## Database Setup
- **Prisma 7** with `prisma-client` generator (output: `src/generated/prisma/`)
- **PrismaNeon adapter** (`@prisma/adapter-neon`) for serverless connections
- `prisma.config.ts` handles datasource URL config — uses `process.env["DIRECT_DATABASE_URL"]` with `??` fallback to `env("DATABASE_URL")` (note: Prisma's `env()` throws on missing vars, so `process.env` is needed for the optional fallback)
- Migration: `npx prisma migrate dev` (uses DIRECT_DATABASE_URL for direct connection)
- Seed: `npx prisma db seed` or `npx tsx prisma/seed.ts`
- Seed data: 8 users, 6 artists, 2 developer profiles, 21 works, tags, acquisitions

## Vercel Deployment Testing
- Live URL: https://testest-gilt.vercel.app
- After merging changes, Vercel auto-deploys from `main`. Wait ~1 minute for deployment.
- Key verification: check all routes load (especially dynamic routes like `/works/art-1` and `/artists/artist-1`).
- Vercel requires both `DATABASE_URL` and `DIRECT_DATABASE_URL` environment variables set in project settings.
- Build command must include `prisma generate` before `next build` (configured in package.json build script).

### Package Version Notes
- The project uses Next.js 15 (not 16 - Next.js 16 does not exist as of early 2026). If `package.json` references `next@16.x`, it will fail to install.
- Dynamic route pages use `params: Promise<{ id: string }>` with `await` - this is the Next.js 15 async params API.
- `eslint-config-next` version should match the Next.js major version.

## Key Routes to Test

### Public Pages
- `/` - Home page with SNS-style hero and Featured Works/Artists
- `/works` - Works listing with server-side search & filter, sidebar (desktop), 5-column grid
- `/artists` - Artists listing with sidebar
- `/works/{slug}` - Work detail with Overview/License tabs (e.g. `/works/art-1`)
- `/works/{slug}#license` - Direct link to License tab via URL hash
- `/artists/{id}` - Artist detail page with Policy Summary and works list

### Dashboard Pages (requires login)
- `/dashboard/artist` - Artist Dashboard summary hub with 4 count cards (Total/Public/Private/Draft)
- `/dashboard/artist/works` - Works Management table (Title/Status/Updated/Actions)
- `/dashboard/artist/works/new` - Create new work form (saves as draft)
- `/dashboard/artist/works/[id]/edit` - Edit work form (can change status to public/private/draft)

### Auth Guards
- Not logged in → redirects to `/login`
- Logged in but not artist → shows empty state on `/dashboard/artist`, redirects from works sub-pages
- Auth is mock-based using localStorage key `artli_user`

## Test Accounts
- `artist@artli.dev` / `password` (user-2, isArtist: true) - Yuki Tanaka
- `hybrid@artli.dev` / `password` (user-4, isArtist: true, isDeveloper: true) - Sakura Ito
- `viewer@artli.dev` / `password` (user-1, non-artist) - Demo Viewer
- `dev@artli.dev` / `password` (user-3, isDeveloper: true) - Dev Studio

## Testing Patterns

### Login Flow
- Navigate to `/login`
- Click a demo account button (e.g. "Yuki Tanaka") to auto-fill credentials
- Click "Log In" button
- Header shows avatar initial (e.g. "Y") when logged in

### /works Search & Filter Testing
The `/works` page supports server-side search and filtering via URL query parameters.

**URL Parameters:**
- `q` — text search (matches title, tags, artist displayName via case-insensitive OR)
- `trainingType` — `light` | `standard` | `strong`
- `adult` — `allowed`
- `commercial` — `allowed`
- `consult` — `exclude` (excludes works where commercial, adult, or redistribution = "consult")

**UI Components:**
- `WorksSearchBar` (client) — search input + filter chips. Search submits on Enter/button click. Chips update URL immediately via `router.push()`.
- `WorksResultInfo` (server) — shows "N works" + active filter chips + "すべてクリア" link
- `WorksGrid` — card grid or zero-result message

**Testing approach:**
- Navigate directly via URL for faster testing (e.g. `google-chrome "https://testest-gilt.vercel.app/works?trainingType=strong"`)
- Verify result count in the "N works" info bar
- Verify filter chips are highlighted (active state uses colored backgrounds)
- Verify URL contains expected query parameters
- For zero results, verify Japanese message: "条件に合う作品が見つかりませんでした。"

**Seed data reference for assertions (16 public works):**

| trainingType | Count | Works |
|-------------|-------|-------|
| light | 9 | art-1, art-2, art-5, art-6, art-8, art-11, art-12, art-15, art-16 |
| standard | 5 | art-3, art-4, art-7, art-18, art-21 |
| strong | 2 | art-9, art-10 |

| Filter | Count | Notes |
|--------|-------|-------|
| commercial=allowed | 9 | art-3,4,5,6,9,10,15,18,21 |
| adult=allowed | 3 | art-8,9,10 |
| consult=exclude | 11 | Excludes art-1,2,7,8,16 (have consult in commercial/adult/redistribution) |

**Artist name search examples:**
- "Mio" → 2 works (art-5, art-6 by Mio Hayashi)
- "Sakura" → 5 works by Sakura Ito (art-9,10,18,21 + check if art-19/20 are public)

**Minor UI note:** After clicking "すべてクリア" (full page navigation), the client-side search input may retain previous text until user interacts. The URL and server response are correct.

### Dashboard Testing
- After login, navigate to `/dashboard/artist`
- Summary cards show counts computed from API response
- "New Work" link → `/dashboard/artist/works/new`
- "作品を管理" link → `/dashboard/artist/works`

### Form Interaction (WorkForm)
- React controlled inputs may not respond to direct `type` actions from browser automation
- **Recommended approach**: Use JavaScript console to set values via native input setter pattern:
  ```javascript
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(element, 'value');
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  ```
- For textarea, use `HTMLTextAreaElement.prototype` instead
- For select dropdowns, use `select_option` with the devinid and index
- Form IDs: `title`, `description`, `coverImageUrl`, `tags`, `status`, `commercial`, `adult`, `trainingType`, `redistribution`, `priceJpy`
- Submit with: `document.querySelector('form').requestSubmit()`
- Button shows "Saving..." during submission, then redirects to `/dashboard/artist/works`

### Link Click Issues
- Some Next.js Link components may block direct `click` actions from browser automation
- Workaround: Use `navigate` to go directly to the target URL instead of clicking the link
- Or use JavaScript: `document.querySelector('a[href*="target"]').click()`

### Desktop View
- Sidebar should be visible on `/works` and `/artists` pages (left side, w-64)
- Sidebar contains: Trending Tags, Featured Artists, New Works, License Quick Filters
- Sidebar License Quick Filters use `trainingType=` parameter (not `training=`)
- ArtworkCard shows: portrait thumbnail (aspect-[3/4]), title, AuthorBadge (artist icon + name), License chip, trainingType badge, heart + like count
- ArtworkCard does NOT show price - price is only on the License tab of work detail
- Grid density: grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5, gap-4

### Work Detail Page
- Overview tab (default): AuthorBadge, description, tags, WorkActions (Like/Share/Comments), "ライセンス詳細を確認 →" link
- License tab: LicenseBadges, conditions grid, price (¥), disabled "Acquire license (prototype)" button, "Terms shown here describe allowed usage." note
- Hash navigation: visiting `/works/{id}#license` should open License tab directly
- Like button toggles: count increments/decrements, heart icon fills/unfills
- Share button shows browser alert (prototype)
- "ライセンス詳細を確認" link switches from Overview to License tab

### Artist Detail Page
- Policy Summary section uses gray styling (bg-gray-50, border-gray-200, text-xs, text-gray-700/600)
- Policy Summary should NOT use indigo styling
- Works section lists all works by the artist with like counts

### Mobile View (375px or set_mobile)
- Sidebar hidden, "Explore" button visible
- Click "Explore" opens drawer from left with overlay
- Drawer contains same sidebar content as desktop
- Close via X button or clicking overlay

## Build Verification
```bash
npx prisma generate  # Must run before build
npm run build        # Should complete with no errors
npm run lint         # Should show no warnings or errors
```

## Common Pitfalls
- **"use client" directive**: Any component using onClick, useState, or other client-side APIs must have `"use client"` at the top. If you see "Application error: a server-side exception" on page load, check for missing `"use client"` directives in components with event handlers.
- Brand constants are in `src/lib/brand.ts` - the BRAND object should be used for site name/tagline across Header, Footer, layout metadata, and homepage.
- ArtworkCard and AuthorBadge use `e.stopPropagation()` on nested Links to prevent parent link interference - these require client component status.
- **Tailwind CSS v4**: This project uses Tailwind CSS v4 with `@import "tailwindcss"` in `globals.css` and `@tailwindcss/postcss` plugin in `postcss.config.mjs`. Do not use Tailwind v3 syntax.
- **Prisma 7 breaking changes**: `datasourceUrl` constructor option no longer exists — must use `PrismaNeon` adapter. The `env()` helper from `prisma/config` throws on missing variables (unlike `process.env` which returns `undefined`), so use `process.env` for optional env var fallbacks.
- **Generated client path**: Import from `@/generated/prisma/client` (app code) or `../src/generated/prisma/client.js` (scripts like seed.ts with `.js` extension for ESM).
- **Port conflicts**: Dev server may use port 3001 if 3000 is in use. Check console output for actual port.
- **Slug generation for Japanese titles**: All Japanese titles produce `base = "work"` after non-ASCII stripping, so slugs rely heavily on the random suffix. ASCII titles get proper slugified base (e.g. "Test Work E2E" → "test-work-e2e-ut8fw6").
- **Database is shared**: The Neon database is shared between local dev and Vercel deployments. Test data created locally will appear in production. Consider cleaning up test data after testing.

## Known Issues
- Nested `<a>` tags: ArtworkCard has multiple Link elements (thumbnail+title, AuthorBadge, License chip) which may trigger Next.js dev overlay warnings about nested anchors. This is a known prototype pattern.
- Occasional `SyntaxError: Unexpected end of JSON input` on `/works` page during dev — transient, page works on reload.

## Devin Secrets Needed
- `DATABASE_URL` - Neon PostgreSQL connection string (pooled, with `-pooler` suffix)
- `DIRECT_DATABASE_URL` - Neon PostgreSQL direct connection string (non-pooled, for migrations)
- `VERCEL_TOKEN` - For Vercel deployment operations (optional, only needed for deploy commands)
- `VERCEL_AUTOMATION_BYPASS_SECRET` - For bypassing Vercel deployment protection during testing (optional)
