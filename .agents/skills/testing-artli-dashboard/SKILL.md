# Testing Artli Dashboard

How to test the Artli art licensing platform dashboard features end-to-end.

## Test Accounts

The app uses client-side mock auth (localStorage). Demo accounts are available on the login page:

| Account | Email | Password | Roles | User Slug |
|---------|-------|----------|-------|-----------|
| Yuki Tanaka | artist@artli.dev | password | Artist | user-2 |
| Dev Studio | dev@artli.dev | password | Developer | user-3 |
| Sakura Ito | hybrid@artli.dev | password | Artist+Developer | user-4 |
| Demo Viewer | viewer@artli.dev | password | Viewer | user-1 |

Login by clicking the demo account button on `/login` to auto-fill credentials, then click "Log In".

## Key Navigation Paths

- **Login**: `/login`
- **Artist Dashboard**: `/dashboard/artist` — shows summary cards (Total Works, Public, Private, Draft) and action buttons
- **Works Management**: `/dashboard/artist/works` — table listing with Edit/View actions
- **Create Work**: `/dashboard/artist/works/new` — form with title, description, cover image, tags, status, license
- **Edit Work**: `/dashboard/artist/works/[id]/edit` — same form pre-filled with existing data
- **Public Works Gallery**: `/works` — server-rendered page showing all public works

## Testing Patterns

### Work CRUD Flow
1. Login as artist@artli.dev
2. Navigate to `/dashboard/artist/works`
3. Click "新規作品を作成" to create a new work
4. Only Title is required — tags, description, cover image can be empty
5. New works default to "Draft" status
6. Click "Edit" in the works list to edit a work
7. Status can be changed via dropdown (Draft/Private/Public)
8. After save, redirects to works list

### Access Control Testing
- **Unauthenticated**: Accessing `/dashboard/artist` redirects to `/login`
- **Non-artist user**: Accessing `/dashboard/artist` shows "Artist tools are not enabled" message
- **Other user's work**: Accessing `/dashboard/artist/works/[other-user-work-id]/edit` returns 404 (not 403) — security policy: don't leak work existence

### Tag Testing
- Tags are comma-separated in the form input
- When editing, old tags are fully replaced with new ones (disconnect old, connect new)
- Empty tags are valid — no error on save

## Known Deployment Behaviors

- **Vercel ISR caching**: The `/works` public page may not immediately reflect status changes. The page is statically generated and cached. Verify changes via the dashboard API instead: `GET /api/dashboard/artist/works?userSlug=user-2`
- **Multiple Vercel projects**: The repo might have multiple Vercel project connections. Only the main `testest` project deployment matters; secondary projects (`testest-isqb`, `testest-fqbv`) may fail due to missing env vars.

## API Endpoints

- `GET /api/dashboard/artist?userSlug={slug}` — dashboard summary
- `GET /api/dashboard/artist/works?userSlug={slug}` — works list
- `POST /api/dashboard/artist/works` — create work
- `GET /api/dashboard/artist/works/{id}?userSlug={slug}` — get work for edit
- `PUT /api/dashboard/artist/works/{id}` — update work

All endpoints return 401 for missing userSlug, 404 for not-found or not-owned works.

## Environment

- Production: https://testest-gilt.vercel.app
- Database: Neon PostgreSQL (serverless)
- Framework: Next.js 15 App Router + React 19 + Prisma 7
- Auth: Client-side mock auth via localStorage (not real auth)
