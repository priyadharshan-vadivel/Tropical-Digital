# Claude Code Build Prompt

You are now implementing the Tropical Digital website.

The project already contains a first-pass implementation.

Read:
- DESIGN_SYSTEM.md
- all files under docs/ from the supplied content package
- all existing source files

## Design requirements

1. Do not create a logo. Use the text "Tropical Digital" as the wordmark.
2. Do not use purple, indigo or blue startup gradients.
3. Do not use Inter, Roboto or Arial.
4. Keep the warm material-inspired palette already defined in DESIGN_SYSTEM.md.
5. Do not introduce new colors without documenting them.
6. Do not use excessive rounded cards.
7. Avoid sharp-edged card grids.
8. Avoid predictable alternating text/image sections.
9. Avoid repeated three-card feature layouts.
10. Use asymmetry, editorial spacing, layered line work and large typography.
11. Use restrained motion only.
12. Do not use glow particles, neon effects, fake 3D dashboards or generic AI imagery.
13. Do not fabricate company information.

## Content rules

The Tropical Digital source documents remain the factual source of truth.

Egis is a reference benchmark only. Do not copy Egis content or visual identity.

## Implementation

First inspect the current code.

Then:
- Fix any structural issues.
- Make all navigation routes work.
- Make the site responsive.
- Improve semantic HTML.
- Add metadata per page.
- Add accessible focus states.
- Add mobile navigation.
- Add proper form states without pretending the form has a backend.
- Keep company content in data/content files.
- Keep components reusable.

## Visual quality pass

After implementation, inspect every page for:
- AI-looking defaults
- repeated card patterns
- excessive rounded containers
- inconsistent spacing
- weak hierarchy
- generic gradients
- generic stock imagery
- excessive animation
- poor mobile behavior

Replace weak patterns with intentional editorial layouts.

## Final verification

Run:
- TypeScript
- lint
- production build

Then create:
FINAL_AUDIT.md

Do not declare the site finished if factual content or technical checks fail.
