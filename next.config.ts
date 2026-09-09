import type { NextConfig } from "next";

// Content-Security-Policy notes (see SECURITY_REPORT.md, finding SEC-06):
// - script-src needs 'unsafe-inline': the App Router's RSC streaming architecture
//   injects inline bootstrap `<script>` tags (self.__next_f.push(...)) on every
//   page load; this is not optional without a nonce-based CSP wired through
//   middleware, which does not exist in this project. Documented as an accepted
//   trade-off rather than silently omitted.
// - style-src needs 'unsafe-inline': app/international/page.tsx sets inline
//   `style={{ left, top }}` on the map markers. The Google Fonts stylesheet is
//   loaded via @import in globals.css, which requires fonts.googleapis.com here
//   and fonts.gstatic.com in font-src.
// - No other external script/style/image/font/connect origins are used anywhere
//   in the app (verified by grep across app/ and components/).
// - 'unsafe-eval' is added ONLY outside production: Next.js's dev server uses
//   eval-based Fast Refresh/HMR and throws on every page load without it.
//   Verified empirically — omitting this broke `npm run dev` with CSP errors,
//   while a production build (`next build && next start`) works correctly
//   without it. Confirmed via SECURITY_TEST_CASES.md SEC-T-25/26.
const isProd = process.env.NODE_ENV === "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // The dev-only floating build/route indicator is not part of the Tropical Digital
  // design and should never appear in screenshots or review builds.
  devIndicators: false,

  // Don't advertise the framework in responses (minor fingerprinting/info-disclosure
  // hardening; see SECURITY_REPORT.md finding SEC-07).
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // No-op on plain HTTP (e.g. localhost); enforced once served over HTTPS.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
