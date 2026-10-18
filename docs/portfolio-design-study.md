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
