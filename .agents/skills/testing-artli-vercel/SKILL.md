---
name: testing-artli-vercel
description: Test Artli app UI changes on Vercel deployment. Use when verifying frontend changes, disclaimers, modals, or dashboard features.
---

# Testing Artli on Vercel Deployment

## Devin Secrets Needed
- `VERCEL_AUTOMATION_BYPASS_SECRET` — Vercel Deployment Protection bypass token

## Vercel Deployment Protection

The Vercel deployment has Deployment Protection enabled. Browser clicks that navigate between pages will trigger Vercel SSO redirect. To work around this:

1. Use **Playwright CDP** with `set_extra_http_headers` to set the bypass header on all requests:
   ```python
   from playwright.async_api import async_playwright
   import os

   bypass_secret = os.environ.get("VERCEL_AUTOMATION_BYPASS_SECRET", "")
   async with async_playwright() as p:
       browser = await p.chromium.connect_over_cdp("http://localhost:29229")
       context = browser.contexts[0]
       await context.set_extra_http_headers({
           "x-vercel-protection-bypass": bypass_secret
       })
       page = context.pages[0]
       await page.goto("https://testest-zakis-projects-d5b84cb9.vercel.app/...")
   ```

2. **All page navigations** must go through Playwright `page.goto()` — clicking links in the browser UI will lose the bypass header and redirect to Vercel login.

3. The initial page load with `?x-vercel-protection-bypass=<secret>` query param works for the first page but does NOT persist for subsequent navigations.

## Vercel Deployment URLs

- Production (main branch): `testest-zakis-projects-d5b84cb9.vercel.app`
- PR preview pattern: `testest-git-<branch-slug>-zakis-projects-d5b84cb9.vercel.app`
- Non-required checks `testest-fqbv` and `testest-isqb` may fail due to missing `DATABASE_URL` — this is a known pre-existing issue.

## Demo Accounts

The app uses mock authentication. Available accounts (all use password: `password`):

| Email | Role | Use for |
|---|---|---|
| `viewer@artli.dev` | General user | Testing non-developer views |
| `artist@artli.dev` | Artist (Yuki Tanaka) | Testing artist dashboard |
| `dev@artli.dev` | Developer (Dev Studio) | Testing developer dashboard, acquisitions |
| `hybrid@artli.dev` | Artist + Developer (Sakura Ito) | Testing dual-role features |

Login page is at `/login`. Demo account buttons auto-fill credentials.

## Key Test Flows

### Developer Dashboard (`/dashboard/developer`)
- Login as `dev@artli.dev`
- Navigate via Playwright to `/dashboard/developer`
- Shows: summary cards, acquisition history with images, license summaries

### AcquireModal (Work Detail Page)
- Login as `dev@artli.dev`
- Navigate to a work detail page (e.g., `/works/art-10`)
- Click "利用条件" (License Terms) tab
- Click "この条件で許諾を取得" button to open modal
- Note: Works already acquired by the account show "取得済み" instead of acquire button
- dev@artli.dev has already acquired: art-3, art-5, art-7, art-9
- Good test targets: art-10, art-12, art-4, art-6 (not yet acquired)

### Works with non-consult licenses (acquirable)
- Works by Sakura Ito generally have all "allowed" licenses
- Works with "consult" conditions show "要相談" and cannot be acquired via the modal

## Chrome Setup Notes

- Chrome binary is at `/opt/.devin/chrome/chrome/linux-133.0.6943.126/chrome-linux64/chrome` (may change)
- The `google-chrome` wrapper at `~/.local/bin/google-chrome` sends URLs to CDP at `localhost:29229`
- If Chrome is not running, launch it with: `DISPLAY=:0 <chrome-binary> --no-first-run --no-default-browser-check --user-data-dir=/home/ubuntu/.browser_data_dir --remote-debugging-port=29229 <url>`
- Maximize with: `wmctrl -r "Google Chrome" -b add,maximized_vert,maximized_horz`
