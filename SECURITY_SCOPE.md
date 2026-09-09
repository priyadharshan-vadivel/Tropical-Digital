# Security Scope

Authorized application security review of the Tropical Digital Next.js application in this
repository. Environment: local development (`npm run dev` on `http://localhost:3000`) and a local
production build (`npm run build && npm run start`, same host/port). No deployed/hosted instance
was tested.

## Application architecture

- **Framework**: Next.js 15.5.25 (App Router), React 19.3.0, TypeScript, Tailwind CSS v4.
- **Rendering**: Almost entirely static — every page under `app/` is a Server Component with no
  dynamic route segments (`[param]`), no database, no CMS, no authentication/session system.
- **The one piece of server logic**: a single API route, `app/api/contact/route.ts`, which accepts
  a contact-form submission and relays it by email via the [Resend](https://resend.com) SDK.
- **The one client-interactive component with server communication**: `components/ContactForm.tsx`,
  which `fetch()`s the route above.
- **No middleware** (`middleware.ts` does not exist in this project).
- **No file upload, no user accounts, no database, no server-side session state.**

## Attack surface

### Routes (all statically rendered, no auth, no per-user data)
`/`, `/about`, `/services`, `/solutions`, `/industries`, `/international`, `/technology`,
`/insights`, `/careers`, `/contact`, `/privacy`, `/terms`, `/cookie-policy`, `/accessibility`,
`/image-credits`, `/sitemap.xml`, `/robots.txt`, plus Next.js's built-in `/_not-found` (404).

### API endpoints
- `POST /api/contact` — the only endpoint accepting user input. Also responds to `OPTIONS`
  (Next.js's auto-generated preflight handler); all other methods return `405`.

### User-controlled inputs
All inputs are confined to the contact form, posted as JSON to `/api/contact`:
`name`, `email`, `organisation`, `interest`, `message`, and a hidden honeypot field `company`.
No query parameters, route parameters, headers, or cookies are used as trusted input anywhere in
the application logic.

### External integrations
- **Resend** (`resend` npm package) — server-side only, sends the contact-form email. Requires
  `RESEND_API_KEY` and `CONTACT_EMAIL`; without both, the route returns `503` rather than
  attempting delivery (verified — see SECURITY_TEST_CASES.md).
- **Google Fonts** (`fonts.googleapis.com` / `fonts.gstatic.com`) — loaded directly by the
  browser via `@import` in `app/globals.css`. The only third-party the browser itself contacts.
- No analytics, no CDN scripts, no maps, no other third-party service is used anywhere.

### Secrets / sensitive configuration
- `RESEND_API_KEY`, `CONTACT_EMAIL`, `EMAIL_FROM` — read only in `app/api/contact/route.ts`
  (server-only; Next.js never ships non-`NEXT_PUBLIC_`-prefixed env vars to the client bundle).
  No `NEXT_PUBLIC_*` variables exist in the project.
- `.env.example` documents the required variable names with **no real values**. No `.env` /
  `.env.local` file exists in the repository; `.gitignore` excludes `.env` and `.env*.local`.

## Security assumptions

- The application is assumed to be deployed on a platform (the codebase targets Vercel) whose edge
  layer overwrites the `X-Forwarded-For` header with the true client IP before the request reaches
  application code. Where this assumption doesn't hold (e.g. a bare `next start` behind a plain
  reverse proxy that forwards client-supplied headers verbatim), the per-IP rate limiter in
  `/api/contact` can be trivially bypassed — see SECURITY_REPORT.md finding SEC-01.
- No authentication or authorization model is assumed or required, because none exists: every page
  and the one API route are intentionally public.

## Items outside scope

- Any deployed/production instance of this application, its DNS, TLS configuration, or hosting
  platform's own infrastructure.
- The Resend service itself, Google's font-serving infrastructure, or any other third-party
  service's internal security.
- The GitHub repository/organization's account security, CI/CD platform configuration, or Vercel
  project settings — these are operational/account concerns, not application code.
- Legal/compliance review of `/privacy`, `/terms`, `/cookie-policy` (those pages are explicitly
  marked as unapproved drafts in the application itself and are out of scope for a technical
  security review).
