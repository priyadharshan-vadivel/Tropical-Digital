# Tropical Digital Website — Final Audit

Fifth implementation pass: targeted refinement following review of rendered output. Egis
(egis-group.com) was used strictly as a structural/editorial benchmark — no Egis text, branding,
colors, layout, images, or claims were used. This pass fixed a confirmed map-accuracy bug, replaced
a nation-specific image, restructured the footer to an exact 3-group spec, removed a dev-only
visual artifact, and re-verified the whole site — including the contact form, legal pages and
whitespace fixes built in the prior pass — against a real **production** build rather than dev mode.

## 1. Completed changes

- **World map replaced with a verified true-equirectangular base map** (see §2) and marker
  positions recomputed from real coordinates via a documented projection formula, replacing the
  earlier manually-estimated percentages.
- **Digital Health image replaced** (see §3) — the previous photo showed a hospital building with
  large Chinese signage ("现代医院" / "Modern Hospital"); it's now a clinical radiology-room photo
  with no nation-specific text.
- **Footer rebuilt to the exact specified structure**: a 4-column grid (brand+tagline / Explore /
  Company / Legal), each navigation group under its own mono label, with a single copyright line
  below — no CTA copy, no repeated location statement anywhere in the footer.
- **Dev-mode visual artifact removed**: added `next.config.ts` with `devIndicators: false`. See §8
  for the investigation.
- **Stale image-cache bug found and fixed during this pass**: after swapping the Digital Health
  source file, a rebuilt production server still served the *old* photo. Root cause: Next.js's
  built-in image optimizer caches transformed images in `.next/cache/images/`, keyed by URL path
  rather than source file content — replacing a file at the same path without clearing that cache
  can serve a stale result. Fixed by removing `.next` and rebuilding clean. Documented here because
  it will recur for any future image swap unless `.next` is cleared (or a cache-busting filename is
  used) after replacing a static asset.
- Re-verified (not re-built, since it was already correct) from the prior pass: contact form +
  `/api/contact` route, `.env.example`, all "Talk to Us" links, the five legal/credits pages, and
  the whitespace/CTA-placement fixes on Services/Solutions/Industries/Technology/International.
  All confirmed still intact and working against a clean production build.

## 2. Geographic / map corrections

**Root cause of the UAE-near-Pakistan bug**: the previous base map
(`BlankMap-World.svg`, a flat grey Wikipedia locator-map derivative) does not have a *confirmed*
plate carrée (equirectangular) projection, and the marker positions were manually estimated
percentages rather than computed from real coordinates — a combination that produced visible drift.

**Fix**: replaced the base map with
[`World location map (equirectangular 180).svg`](https://commons.wikimedia.org/wiki/File:World_location_map_(equirectangular_180).svg)
by TUBS — the file Wikipedia itself uses as the calibrated base for its own location-marker maps,
specifically because it is true plate carrée (confirmed: exact 2520.631 × 1260.315px, i.e. exactly
2:1, the signature of full-globe equirectangular coverage). Marker positions are now computed with
a documented `project(lat, lon)` function in `app/international/page.tsx`:

```
x% = (lon + 180) / 360 * 100
y% = (90 - lat) / 180 * 100
```

using the exact reference coordinates supplied:
- United Kingdom: 55.3781, -3.4360 → x≈49.05%, y≈19.23%
- India: 20.5937, 78.9629 → x≈71.93%, y≈38.56%
- United Arab Emirates: 23.4241, 53.8478 → x≈64.96%, y≈36.99%

**Verified visually** against a real production build at 1440px and 390px: the UK marker lands on
the British Isles, the India marker lands within India, and the UAE marker lands on the Arabian
Peninsula, clearly separated from and southwest of the India marker — not near Pakistan.

This also happens to be a higher-fidelity, full-color map (real coastlines/borders) than the
previous flat grey placeholder, while remaining restrained — no glow, no animated network lines,
no fake "global connectivity" effect.

## 3. Image changes

| Change | Before | After |
|---|---|---|
| Solutions — Digital Health | Guangzhou hospital exterior with large Chinese building signage | Hospital radiology room, Philips DigitalDiagnost digital radiography system in use — no signage, no nation-specific markers |
| International — base map | `BlankMap-World.svg` (flat, unconfirmed projection) | `World location map (equirectangular 180).svg` (confirmed true equirectangular, full color) |

No other images were changed in this pass. The full current set (13 photographs/graphics across
Home, About, Services, Solutions, Industries, International, Technology, Insights, Careers) is
listed on `/image-credits`, linked from the footer's Legal group.

## 4. Image sources and licensing notes

New/changed entries this pass:

| Image | Author | License |
|---|---|---|
| Hospital radiology room (Digital Health) | Ptrump16 | CC BY-SA 4.0 |
| World base map (International) | TUBS | CC BY-SA 3.0 |

Both require attribution; both are satisfied via `/image-credits`, which was updated to reflect
these two changes (old entries for the Guangzhou hospital and the previous map file were replaced,
not left dangling). Neither image has been cropped or recolored in a way that would trigger
additional share-alike obligations beyond attribution — see the full licensing note in the prior
audit pass, which still applies to the unchanged images.

## 5. Contact form implementation

Unchanged from the prior pass; re-verified working against this session's clean production build:

- `app/api/contact/route.ts` — server-side validation, honeypot, basic per-IP rate limiting, and
  delivery via [Resend](https://resend.com) to `CONTACT_EMAIL`.
- Returns HTTP 503 with an explicit "not yet connected to a live inbox" message when
  `RESEND_API_KEY` / `CONTACT_EMAIL` are unset — verified directly against the running server this
  session; it does not claim to work without credentials.
- `components/ContactForm.tsx` — Name, Work email, Organisation, Area of interest (from the real
  `serviceFamilies` list), Message; loading/success/error states; accessible `<label>` elements;
  full keyboard support (standard form controls, no custom widgets that trap focus).
- Every field validated client-side before submit and again server-side on receipt.

## 6. Environment variables required

Documented in `.env.example` (present in the repo root, no secrets committed):

```
RESEND_API_KEY=
CONTACT_EMAIL=priyanvadivell442@gmail.com
EMAIL_FROM="Tropical Digital Website <onboarding@resend.dev>"
```

`RESEND_API_KEY` must be generated in a Resend account. `EMAIL_FROM` should be updated to a
verified sending domain once one exists — Resend's shared sandbox sender can only deliver to the
Resend account's own owner address, not to arbitrary recipients like a Gmail inbox, in production.

## 7. Legal pages created

Unchanged from the prior pass; re-verified present and rendering correctly, and now linked from
the footer's dedicated Legal group rather than an inline row:

- `/privacy` — draft, `noindex`, bracketed placeholders for legal name/address/DPO/retention/etc.
- `/terms` — draft, `noindex`, bracketed placeholders.
- `/cookie-policy` — draft, `noindex`, states plainly that no tracking cookies are currently set.
- `/accessibility` — live (not a placeholder draft) statement of the actual accessibility approach
  taken in the build, since that's independently verifiable from the implementation.
- `/image-credits` — live, lists every photo/graphic with source, author and license.

## 8. Remaining visual issues

- **The "black rectangle" was the Next.js development-mode build/route indicator** (the small
  circular "N" badge Next.js overlays in the bottom-left corner during `next dev`). It is
  Next.js's own tooling chrome, not part of the Tropical Digital implementation, and it never
  appears in a production build (`next build && next start`) — confirmed by screenshotting the
  actual production server this session, both before and after adding the config change below.
  `devIndicators: false` was added to a new `next.config.ts` regardless, so it's also suppressed
  during local `npm run dev`, meaning future screenshots taken mid-development won't show it either.
- No other visual issues were found in this pass's review of the production build across desktop
  and mobile.

## 9. Remaining technical issues

- `npm run typecheck` — passes.
- `npm run lint` — passes, zero warnings.
- `npm run build` — passes; 21 routes generated.
- **Image-cache gotcha for future sessions**: after replacing any file under `public/images/`,
  run `rm -rf .next` before the next `npm run build` if you need to verify the change in a
  production build — otherwise Next's on-disk image-optimization cache can serve the old file at
  the same URL. This does not affect `npm run dev`, which re-reads source files on each request.
- The new world map SVG is large (~4.2MB uncompressed text). It's vector, cached by the browser
  after first load, and will typically be served gzipped/brotli by any real hosting platform
  (which usually shrinks SVG text substantially) — but it hasn't been manually optimized (e.g. with
  SVGO). Worth revisiting if map load time becomes a concern on slow connections.
- The stray `package-lock.json` one directory above this project (flagged in every prior audit)
  remains unresolved, still untouched pending the user's confirmation of its origin.
- This machine's `C:` drive was found completely full mid-session in the previous pass; it's
  currently at ~7GB free after this session's cleanup of temporary Playwright/npm-cache usage.
  Still worth the user's independent attention — 7GB is thin margin for ongoing development.

## 10. Company information still required

Unchanged — still needed before full publication: official domain, legal registration details,
approved logo/brand assets, verified office addresses, verified phone number, leadership
names/bios/photography, current vacancies and recruitment contact, and the legal entity details
needed to complete `/privacy`, `/terms`, `/cookie-policy`.

## 11. Items requiring company approval

- The specific photographs (including the two swapped this pass) are real, licensed, and
  thematically chosen, but have not been reviewed by Tropical Digital's brand/marketing function.
- Proof points (99.99% uptime, 42 certificate types) and the 19 named reference organisations
  remain unpublished per prior audits — structured in `lib/content.ts` but not rendered anywhere.
- The three draft legal pages need legal sign-off before their bracketed placeholders are filled
  in and their `noindex` directive removed.

## 12. Production deployment requirements

1. Set `RESEND_API_KEY` and `CONTACT_EMAIL` in the hosting platform's environment configuration so
   the contact form delivers mail (currently correctly reports "not connected" without them).
2. Once a real domain is confirmed, verify a sending domain in Resend, update `EMAIL_FROM`
   accordingly, and update `metadataBase` in `app/layout.tsx` plus the base URLs in
   `app/sitemap.ts` / `app/robots.ts` (currently `https://www.tropicaldigital.example`).
3. Get legal sign-off on the three draft policy pages, fill in the bracketed fields, remove the
   draft banners, and remove their `noindex` directive.
4. Confirm the photography direction with Tropical Digital's brand function before public launch.
