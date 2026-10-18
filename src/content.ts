import avatar from "./assets/devashish-profile.jpg";
import banner from "./assets/banner.jpg";
import bbaUniversityIcon from "./assets/bbau-university.png";
import redstringIcon from "./assets/redstring-favicon.png";
import coverPortfolio from "./assets/cover-portfolio.svg";
import docksScreenshot from "./assets/docks-screenshot.png";
import schemaScreenshot from "./assets/schema-screenshot.png";
import ycJobsScreenshot from "./assets/yc-jobs-screenshot.png";

import ycLight from "./assets/yc-hero-light.webp";
import ycDark from "./assets/yc-hero-dark.webp";
import ycFullLight from "./assets/yc-landing-light.webp";
import ycFullDark from "./assets/yc-landing-dark.webp";
import docksLight from "./assets/docks-hero-light.webp";
import docksDark from "./assets/docks-hero-dark.webp";
import docksFullLight from "./assets/docks-landing-light.webp";
import docksFullDark from "./assets/docks-landing-dark.webp";
import schemaLight from "./assets/schema-hero-light.webp";
import schemaFullLight from "./assets/schema-landing-light.webp";

export type PublicationStatus = "published" | "draft";
export type NavigationLink = { label: string; href: string };
export type SocialLink = { label: string; href: string; network: "github" | "linkedin" | "x" | "instagram" | "cal" };

export type SiteIdentity = {
  name: string;
  role: string;
  location: string;
  domain: string;
  email: string;
  now: { text: string; updated: string };
  biography: string[];
  avatar: string;
  banner: string;
  bannerAlt: string;
  navigation: NavigationLink[];
  socials: SocialLink[];
  footer: string;
};

export type CaseStudy = {
  slug: string;
  role: string;
  year: string;
  stack: string[];
  body: ContentBlock[];
};

export type WorkItem = {
  title: string;
  description: string;
  href: string;
  image?: string;
  imageAlt?: string;
  landingImages?: { light: string; dark?: string; fullLight: string; fullDark?: string };
  external?: boolean;
  links?: { label: string; href: string }[];
  caseStudy?: CaseStudy;
  order: number;
  status: PublicationStatus;
};

export type EducationEntry = {
  degree: string;
  institution: string;
  period: string;
  logo: string;
  summary: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  icon: string;
  companyHref?: string;
  location?: string;
  employmentType?: string;
  stack?: string[];
  summary?: string;
  highlights?: string[];
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string }
  | { type: "figure"; src: string; alt: string; caption: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; code: string; label?: string }
  | { type: "divider" }
  | { type: "callout"; title: string; text: string; href?: string; label?: string };

export type ResourceItem = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  coverAlt: string;
  status: PublicationStatus;
  externalUrl?: string;
  actionLabel?: string;
  body?: ContentBlock[];
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  coverAlt: string;
  status: PublicationStatus;
  body: ContentBlock[];
};

export const identity: SiteIdentity = {
  name: "Devashish",
  role: "Software Engineer",
  location: "India",
  domain: "devzshrc.in",
  email: "devzshrcz@gmail.com",
  now: { text: "Building backend and platform systems at Redstring Remote.", updated: "Sep 2026" },
  biography: [
    "I design user flows, build features, and engineer the APIs behind them. At Redstring Remote, I work on backend and platform systems.",
  ],
  avatar,
  banner,
  bannerAlt: "Steve Jobs leaning back at his desk in an early Apple office",
  navigation: [
    { label: "Work", href: "/#work" },
    { label: "Contact", href: "/#contact" },
  ],
  socials: [
    { label: "X", href: "https://x.com/devzshrc", network: "x" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/devzshrc", network: "linkedin" },
    { label: "GitHub", href: "https://github.com/devzshrc", network: "github" },
    { label: "Instagram", href: "https://www.instagram.com/devzshrc", network: "instagram" },
    { label: "Book a call", href: "https://cal.com/de5ash1zh", network: "cal" },
  ],
  footer: "All Rights Reserved.",
};

export const work: WorkItem[] = [
  {
    title: "YC Jobs — startup job search",
    description: "A fast, private way to search Y Combinator startup jobs. 1,491 hiring companies, in-browser resume matching, salary benchmarks, and an application pipeline — with no accounts and no data collection.",
    href: "/work/yc-jobs",
    image: ycJobsScreenshot,
    landingImages: { light: ycLight, dark: ycDark, fullLight: ycFullLight, fullDark: ycFullDark },
    imageAlt: "Orbiter landing page: Your next chapter. Closer than you think.",
    links: [
      { label: "Live", href: "https://yc.devzshrc.in" },
      { label: "GitHub", href: "https://github.com/devzshrc/yc" },
    ],
    caseStudy: {
      slug: "yc-jobs",
      role: "Design and engineering",
      year: "2026",
      stack: ["Bun", "React 19", "Tailwind CSS v4", "TanStack Charts", "Cloudflare Workers"],
      body: [
        { type: "heading", text: "The problem" },
        { type: "paragraph", text: "Searching YC startup jobs means forty open tabs: company lists in one place, role details in another, salaries somewhere else, and your applications tracked in a spreadsheet. YC Jobs brings the whole hunt into one fast page." },
        { type: "heading", text: "What it does" },
        { type: "list", items: [
          "Browse 1,491 hiring companies with filters for remote, visa sponsorship, location, industry, team size, stage, and batch, plus a roles view and a new-this-week feed.",
          "Match your resume: PDF parsing and TF-IDF similarity run entirely in the browser and rank companies and roles against your profile.",
          "Market analytics with salary bands, posting velocity, and ranked breakdowns rendered with TanStack Charts.",
          "An application pipeline board with per-stage tracking, outreach message drafts, and backup/export of everything.",
        ] },
        { type: "heading", text: "Private by design" },
        { type: "paragraph", text: "There are no accounts and no tracking. Your resume is parsed on your machine and never uploaded — the whole app works as a static deploy with local-only state." },
        { type: "heading", text: "My role" },
        { type: "paragraph", text: "I designed and built YC Jobs end to end: the browsing and filtering flows, the resume matcher, the charts, the tracker, and the Cloudflare deployment." },
        { type: "heading", text: "Outcome" },
        { type: "paragraph", text: "YC Jobs is live and open source. Try it, or read the code on GitHub." },
      ],
    },
    order: 0,
    status: "published",
  },
  {
    title: "Docks — AI-assisted code review workspace",
    description: "A GitHub review workspace that turns pull requests into guided reads. AI review guides, cross-repository boards, and team workflows bring the review cycle into one place.",
    href: "/work/docks",
    image: docksScreenshot,
    landingImages: { light: docksLight, dark: docksDark, fullLight: docksFullLight, fullDark: docksFullDark },
    imageAlt: "Docks landing page: Every pull request, reviewed in the right order.",
    links: [
      { label: "Live", href: "https://app.devzshrc.in" },
      { label: "GitHub", href: "https://github.com/devzshrc/docks" },
    ],
    caseStudy: {
      slug: "docks",
      role: "Full-stack engineering",
      year: "2026",
      stack: ["Next.js 15", "React 19", "Hono", "tRPC v11", "Drizzle", "PostgreSQL", "OpenAI", "Cloudflare Workers"],
      body: [
        { type: "heading", text: "The workspace" },
        { type: "paragraph", text: "Docks brings GitHub code review into one workspace. Cross-repository boards show computed review states and stalled pull requests, with reviewer assignment, review claims, priorities, personal saved views, and shareable URL filters." },
        { type: "heading", text: "AI-assisted review" },
        { type: "paragraph", text: "Review guides and contextual PR questions use the OpenAI Responses API. Structured output is validated with Zod, guides are cached per commit, large diffs are split into chunks, and deterministic fallback guides keep reviews usable when generation fails." },
        { type: "list", items: [
          "Unified and side-by-side diffs use virtualized rows and Web Worker syntax highlighting, with file blame and Markdown/Mermaid previews. File-SHA-based review progress identifies changes after new commits.",
          "GitHub review actions support inline comments, thread replies and resolution, approvals, change requests, and merges. Local drafts are preserved, with contextual handoff commands for local coding agents.",
          "Issue boards include filtered lists, bulk updates, duplicate detection, template-based creation, and comment-to-issue conversion, plus stack-trace code references, assignee suggestions, optional Linear issue creation, and idempotent creation requests.",
        ] },
        { type: "heading", text: "Team workflows" },
        { type: "list", items: [
          "Team workspaces provide five-role RBAC, expiring invitations, repository restrictions, ownership transfer, data export, and audit logs. Reviewer suggestions use CODEOWNERS, expertise, review history, availability, and workload.",
          "Review-cycle analytics support repository and team filters, restricted per-person metrics, configurable Slack digests, and weekly reports. Dodo Payments handles per-seat subscriptions, checkout, customer portals, and seat synchronization.",
        ] },
        { type: "heading", text: "Architecture and reliability" },
        { type: "list", items: [
          "A type-safe pnpm/Turborepo monorepo combines Next.js 15, React 19, Hono, and tRPC v11, separating API contracts, domain logic, and Drizzle/PostgreSQL persistence.",
          "Better Auth supports GitHub OAuth, email verification, password recovery, TOTP two-factor authentication, and session controls. Webhook signature checks, AES-256-GCM secret encryption, rate limits, and repository-level AI controls protect access.",
          "Webhook-driven PostgreSQL mirrors and a background job queue use atomic claims, bounded retries, and exponential backoff, alongside layered caching, scheduled access refreshes, and patch-retention cleanup.",
          "Cloudflare Workers deployment uses OpenNext, Hyperdrive, KV, and cron triggers. GitHub Actions automates migrations and deployment, with domain tests and an AI evaluation harness covering 30 PR fixtures.",
        ] },
      ],
    },
    order: 1,
    status: "published",
  },
  {
    title: "Schema — AI form builder",
    description: "An AI form builder that turns a plain-language prompt into questions, validation, and conditional logic. Designed and built end to end, from the editor to the APIs.",
    href: "/work/schema",
    image: schemaScreenshot,
    landingImages: { light: schemaLight, fullLight: schemaFullLight },
    imageAlt: "Schema landing page showing its AI form builder introduction",
    links: [
      { label: "Live", href: "https://notyourtypeformx-web.vercel.app/" },
      { label: "GitHub", href: "https://github.com/devzshrc/notyourtypeformx" },
    ],
    caseStudy: {
      slug: "schema",
      role: "Design and engineering",
      year: "2026",
      stack: ["Next.js", "tRPC", "Express", "Drizzle", "Zod"],
      body: [
        { type: "heading", text: "The problem" },
        { type: "paragraph", text: "Building a good form is slow. You decide on the questions, pick the right field type for each, add validation, and wire up logic that skips questions that don't apply. Most of that work is mechanical once you know what you want to ask." },
        { type: "heading", text: "The approach" },
        { type: "paragraph", text: "Schema starts from a plain-language prompt. You describe the form you need, and it returns a structured draft: questions, field types, validation rules, and conditional logic, ready to edit rather than build." },
        { type: "list", items: [
          "A typed form schema is the single source of truth, so generated and hand-edited forms behave the same way.",
          "The model's output is validated against that schema before it reaches the editor, so a bad generation fails safely.",
          "Everything generated stays editable. The prompt gives you a head start, not a locked result.",
        ] },
        { type: "heading", text: "My role" },
        { type: "paragraph", text: "I designed and built Schema end to end: the user flows, the editor and form features, and the APIs behind them." },
        { type: "heading", text: "Outcome" },
        { type: "paragraph", text: "Schema is live and open source. Try it, or read the code on GitHub." },
      ],
    },
    order: 2,
    status: "published",
  },
  {
    title: "Portfolio",
    description: "A compact home for product work and useful resources.",
    href: "/resources/portfolio",
    order: 3,
    status: "draft",
  },
  {
    title: "Next product",
    description: "Reserved for a future project.",
    href: "#",
    order: 3,
    status: "draft",
  },
];

export const education: EducationEntry[] = [
  {
    degree: "Bachelor of Technology in Computer Science",
    institution: "BBA University, Lucknow",
    period: "2021 – 2025",
    logo: bbaUniversityIcon,
    summary: "Completed my B.Tech. in Computer Science in 2025 from BBA University, Lucknow.",
  },
];

export const experience: ExperienceEntry[] = [
  {
    company: "Redstring",
    role: "Software Engineer, Backend and Platform",
    period: "Apr 2026 – Present",
    icon: redstringIcon,
    location: "Remote",
    employmentType: "Full-time",
    stack: ["TypeScript", "Node.js", "Express", "PostgreSQL"],
    summary: "Backend and platform engineering.",
    highlights: [
      "Design and build backend services and the APIs behind product features.",
      "Work on platform systems that other teams build on.",
    ],
  },
];

export const skills: SkillGroup[] = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "SQL"] },
  { category: "Backend", items: ["Node.js", "Express", "tRPC", "REST"] },
  { category: "Data", items: ["PostgreSQL", "Drizzle", "Zod"] },
  { category: "Frontend & Deploy", items: ["React", "Next.js", "Vercel", "Cloudflare"] },
];

export const resources: ResourceItem[] = [
  {
    slug: "portfolio",
    title: "Portfolio build notes",
    description: "The decisions behind this small, content-led portfolio system.",
    cover: coverPortfolio,
    coverAlt: "Abstract blue editorial grid representing the portfolio",
    status: "draft",
    actionLabel: "View the website",
    body: [
      { type: "paragraph", text: "This portfolio is intentionally small. A typed content layer supplies the homepage, resource archive and detail pages while the interface stays focused on readable typography and useful links." },
      { type: "heading", text: "Built around the content" },
      { type: "paragraph", text: "The visual system uses a narrow editorial column for the homepage and wider grids for archives. Every route shares the same identity, metadata and publication rules." },
      { type: "callout", title: "A simple publishing rule", text: "Only records marked as published appear on the site. Drafts remain available for editing without creating empty links." },
    ],
  },
  {
    slug: "future-resource",
    title: "Future resource",
    description: "Reserved for a guide, download or useful collection.",
    cover: coverPortfolio,
    coverAlt: "Abstract editorial cover",
    status: "draft",
  },
];

export const posts: Post[] = [
  {
    slug: "sample-blog",
    title: "Sample blog",
    excerpt: "A small placeholder for notes on product engineering and building useful software.",
    date: "September 20, 2026",
    cover: coverPortfolio,
    coverAlt: "Abstract blue editorial grid representing a sample blog post",
    status: "draft",
    body: [
      { type: "paragraph", text: "This is a sample blog entry for the portfolio. It gives the writing route a complete shape without pretending to be a finished essay." },
      { type: "heading", text: "A place for useful notes" },
      { type: "paragraph", text: "Future posts can live here: practical observations about product engineering, dependable systems, and the small details that make software feel considered." },
    ],
  },
];

/* Availability: times are "HH:MM" in `timeZone`. Calls can only be booked inside `open` blocks. */
export type DayBlock = { start: string; end: string; title: string; open?: boolean };

export const availability = {
  timeZone: "Asia/Kolkata",
  city: "Lucknow",
  workDays: [1, 2, 3, 4, 5],
  callMinutes: 30,
  bookingUrl: "https://cal.com/de5ash1zh/30min",
  day: [
    { start: "08:00", end: "11:00", title: "Learning" },
    { start: "11:00", end: "20:30", title: "Redstring Remote" },
    { start: "20:30", end: "23:30", title: "Calls", open: true },
  ] satisfies DayBlock[],
};
