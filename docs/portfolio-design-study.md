# Portfolio reference study

Reference: https://daniasyrofi.com/ — inspected in the browser on 18 October 2026.

## Visual decisions

- A centered 600px reading column. At 1280px, its left edge is 340px. Mobile retains 24px gutters.
- Warm off-white and almost-black themes; neutral body text and subdued metadata. Color is concentrated in the editorial covers.
- One sans-serif family; tight title tracking, modest 38px name, 24px role, 19px section headings, 15px prose, and 10–12px metadata.
- Small local-time/language/theme utility row above the portrait. No prominent navigation bar on the landing page.
- Portrait on the left, two-line personal statement and creative-mode/message controls on the right.
- Plain paragraphs, 60px section intervals, limited borders, no oversized hero or dashboard card framing.
- Fine selection-style corner marks around utility actions, suggesting design tooling.
- Compact product rows: image, title, description, role, outbound arrow.
- Three editorial cover objects in a shelf. Cream, yellow-green and pale-blue cover stocks, strong uppercase titles, small imprints, repeated graphic marks, subtle spine shading.
- Restrained footer: conversational contact invitation, copyable email, social links and small colophon.

## Behavior mapping

| Reference feature | Portfolio implementation |
| --- | --- |
| Live Jakarta time | Live Lucknow clock, Asia/Kolkata |
| Theme control | Existing persistent/system-aware theme logic retained |
| Language menu | English/Hindi primary page copy; project names, technical content, and detailed case studies retain English |
| Directional portrait | Existing portrait responds to pointer position; grayscale and dark-theme treatment |
| Portrait celebration | Click celebration with transient decorative particles |
| Creative switch | Five explanatory design notes and visible layout guides |
| Send message | Smooth contact anchor |
| Independent work | Existing published projects, current live-site landing screenshots |
| Writing shelf | Project case-study shelf; no fabricated published articles |
| Cover interactions | Perspective hover, modal preview, pointer drag and keyboard rotation, previous/next navigation |
| Preview dismissal | Close button, outside click and native Escape; native dialog focus containment |
| Background section | Adapted to Devashish’s existing professional identity |
| Email copy | Clipboard confirmation and mailto fallback |
| Credits | Accessible modal with reference attribution |
| Responsive layout | Fluid mobile column and three-cover shelf; annotation notes flow inline at narrower widths |
| Motion accessibility | Reduced-motion CSS disables animation and hover transforms |

## Existing functionality retained

Project case-study routes, publication filtering, metadata, command palette, resume, experience, education, skills, location map, scheduling, GitHub activity, and LeetCode statistics remain. Secondary background tools live in an expandable section to preserve the reference's main-page pacing.

## Asset refresh

Captured the current public landing pages for yc.devzshrc.in (now titled Orbiter), app.devzshrc.in (redirects to docks.devzshrc.in), and notyourtypeformx-web.vercel.app (Schema). Screenshots are local PNGs; no reference portrait, cover artwork or writing copied.

## Precision limits

This is a close reconstruction adapted to the owner's content, not an exact source-code clone. The reference's eight separately photographed portrait directions and alternate dark portrait cannot be reproduced from the single existing portrait. Pointer-responsive movement and theme treatment provide an alternative. Its actual published Medium articles are replaced with genuine project case studies. English/Hindi replace its language options. Editorial cover graphics are original CSS/text artwork. Existing historical YC Jobs case-study copy has been preserved even though the live site now brands itself as Orbiter.

## Validation

Production build, TypeScript check and existing 16 unit tests pass. Updated the existing publication test's stale expected project list to include the already-published YC Jobs project. Desktop browser QA covers the landing layout and project dialog; responsive rules require separate device confirmation.

## Portrait and project preview refinement — 19 October 2026

The portrait no longer follows the cursor, fades into the background, changes its color treatment, or shows a hat/confetti. It uses an edited photographic asset in a 112px rounded rectangular frame. Click opens an accessible native dialog; the interaction is limited to a subtle border/shadow change.

Portrait asset: `src/assets/devashish-portrait.webp`. Prepared using the built-in imagegen tool; original source remains `src/assets/devashish-profile.jpg`. Final prompt:

> Use case: identity-preserve. Asset type: premium understated personal portfolio portrait. Edit target: the provided selfie photograph of Devashish. Change ONLY the busy environment behind the person to a seamless warm neutral gray studio background with very subtle natural tonal variation, and gently balance lighting. Keep the exact real person and likeness, face shape, skin texture, hair, dark sunglasses, white shirt, black shoulder strap, raised hand and phone, pose and composition unchanged. No new facial features, no face beautification, no retouching skin into plastic. Keep authentic photographic detail. Square composition with whole existing head and shoulders, do not crop tighter than original. Natural editorial photography, subtle and honest, no text, no illustrations, no glow, no border, no vignette, no fading or cutout silhouette. Final asset should look like a clean professionally edited real portrait.

Project previews now use wide browser frames with uncropped 1280×720 hero captures. “Show full page” reveals the entire page at its natural aspect ratio. Clicking a preview opens a scrollable complete-page viewer. Case-study hero images and book preview images also follow the portfolio theme.

Native theme captures:

- Orbiter: separate light and dark hero/full-page WebP files.
- Docks: separate light and dark hero/full-page WebP files.
- Schema: native light hero/full-page WebP files. The current public site exposes no theme control or dark stylesheet, so its appearance is preserved and labeled. No artificially inverted screenshots.

Full pages are assembled from overlapping viewport captures to preserve scroll-triggered sections and avoid the browser's full-page capture changing viewport-relative layouts. Docks contains scroll-driven scenes, so those scenes appear as encountered while scrolling. WebP encoding keeps the five full-page captures between approximately 98KB and 420KB. Large captures load on demand with async decoding.

Validation: production build, TypeScript, and 16 tests; browser verification of portrait dialog, theme asset changes, full-page expansion (Orbiter 1280×6076), full-page viewer, and mobile layout at 390×844 without horizontal overflow.
