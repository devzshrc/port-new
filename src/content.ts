import avatar from "./assets/devashish-profile.jpg";
import banner from "./assets/banner.jpg";
import bbaUniversityIcon from "./assets/bbau-university.png";
import redstringIcon from "./assets/redstring-favicon.png";
import coverPortfolio from "./assets/cover-portfolio.svg";
import inferenceCover from "./assets/inference-cover.webp";
import docksReviews from "./assets/case-studies/docks-reviews.jpg";
import inferenceGuide from "./content/posts/inference-engineering.txt" with { type: "text" };
import { parseMarkdown } from "./lib/markdown";


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
  availability: { timeZone: string; workDays: number[]; hours: { start: number; end: number } };
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
  | { type: "heading"; text: string; level?: 2 | 3 }
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
  tags?: string[];
  series?: string;
  updated?: string;
  project?: string;
};

/** Public profiles for structured data (sameAs): every social link except the booking link. */
export const profileLinks = () => identity.socials.filter(link => link.network !== "cal").map(link => link.href);

/** Homepage title and description: name, role and the work it's known for. */
export const homeTitle = "Devashish: Product Designer and Software Engineer";
export const homeDescription = "Product designer and software engineer. Selected case studies, writing and experience from Devashish.";

export const identity: SiteIdentity = {
  name: "Devashish",
  role: "Product Designer and Software Engineer",
  location: "India",
  domain: "devzshrc.in",
  email: "work@devzshrc.in",
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
  availability: { timeZone: "Asia/Kolkata", workDays: [0, 1, 2, 3, 4, 5, 6], hours: { start: 0, end: 1440 } },
};

export const work: WorkItem[] = [
  {
    title: "YC Jobs",
    description: "A startup hiring platform for job discovery, resume matching, applications, and candidate sourcing.",
    href: "/work/yc-jobs",
    links: [
      { label: "Live", href: "https://yc.devzshrc.in" },
      { label: "GitHub", href: "https://github.com/devzshrc/yc" },
    ],
    caseStudy: {
      slug: "yc-jobs",
      role: "Product design and full-stack engineering",
      year: "2026",
      stack: ["React", "TypeScript", "Hono", "PostgreSQL", "Drizzle", "Better Auth", "Zod", "Bun", "OpenAI", "Groq", "Cloudflare Workers"],
      body: [
        { type: "heading", text: "Overview" },
        { type: "paragraph", text: "YC Jobs brings startup job discovery and recruiting into one product. Job seekers can find roles, see resume matches, and track applications. Recruiters can publish jobs, review candidates, and source leads." },
        { type: "heading", text: "Job search" },
        { type: "list", items: [
          "Browser-based resume matching scores roles from 0 to 100 using skills, experience, domain, remote, and visa signals, with reasons and cautions.",
          "Job ranking combines freshness, resume match, and employer signals. Job seekers can save searches, apply, and track applications.",
        ] },
        { type: "heading", text: "Hiring" },
        { type: "list", items: [
          "Recruiters can publish jobs and configurable application forms with conditional questions and shared client and server validation.",
          "An AI sourcing workflow evaluates candidates against recruiter-defined criteria and queues leads for approval. Daily runs scan up to 200 candidates by default.",
        ] },
        { type: "heading", text: "Engineering" },
        { type: "paragraph", text: "Atomic scheduling and idempotent lead creation keep sourcing runs reliable. Provider caching, refresh windows, and budget controls manage job ingestion and AI usage." },
        { type: "heading", text: "My role" },
        { type: "paragraph", text: "I designed and built the product, from job search and recruiting flows to the API, database, and background jobs." },
      ],
    },
    order: 1,
    status: "published",
  },
  {
    title: "Docks",
    description: "A GitHub review workspace with a unified inbox, AI guides, code Q&A, and team follow-ups.",
    href: "/work/docks",
    links: [
      { label: "Live", href: "https://app.devzshrc.in" },
      { label: "GitHub", href: "https://github.com/devzshrc/docks" },
    ],
    caseStudy: {
      slug: "docks",
      role: "Full-stack engineering",
      year: "2026",
      stack: ["Next.js", "TypeScript", "Hono", "tRPC", "PostgreSQL", "Drizzle", "Better Auth", "GitHub App", "OpenAI", "Cloudflare Workers", "Hyperdrive"],
      body: [
        { type: "heading", text: "Overview" },
        { type: "paragraph", text: "Docks brings GitHub pull request reviews into one workspace. Reviewers can find requested reviews, inspect diffs, ask questions, submit feedback, and coordinate follow-ups." },
        { type: "figure", src: docksReviews, alt: "Docks Reviews board showing pull requests by review stage", caption: "The Reviews board shows each pull request’s review stage." },
        { type: "heading", text: "Review workflow" },
        { type: "list", items: [
          "A unified inbox and diff viewer bring review requests, comments, and approvals together.",
          "Deadline policies, reminders, reviewer escalation, and release readiness help teams coordinate follow-ups.",
        ] },
        { type: "heading", text: "AI review tools" },
        { type: "list", items: [
          "Review guides provide summaries, reading steps, and checklists. Guides are cached by commit and checked against changed file paths.",
          "Code Q&A uses bounded file context and validates citations against lines in the supplied diffs.",
          "Large pull requests are processed in chunks of up to 100 files, with up to three chunks running concurrently. Size limits provide a fallback for larger changes.",
        ] },
        { type: "heading", text: "Reliability" },
        { type: "paragraph", text: "Webhook signature verification, per-user AI quotas, and stale-request recovery protect integrations and control model usage." },
        { type: "heading", text: "My role" },
        { type: "paragraph", text: "I built the review experience and the backend services for GitHub integration, AI assistance, and team workflows." },
      ],
    },
    order: 0,
    status: "published",
  },
  {
    title: "Schema",
    description: "An AI form builder. Describe the form you need in plain words, and it writes the questions, checks, and skip rules for you.",
    href: "/work/schema",
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
        { type: "heading", text: "Problem" },
        { type: "paragraph", text: "Making a good form takes a long time. You pick the questions, choose the field types, add checks, and set up skip rules. Most of that work is repeated every time." },
        { type: "heading", text: "What it does" },
        { type: "paragraph", text: "You describe the form in plain words. Schema gives you a draft with questions, field types, checks, and skip rules. You can edit everything it makes." },
        { type: "heading", text: "Key decisions" },
        { type: "list", items: [
          "One clear form format is used for both AI-made and hand-made forms, so they work the same way.",
          "Everything can be edited. The prompt is a head start.",
        ] },
        { type: "heading", level: 3, text: "Errors fail safely" },
        { type: "paragraph", text: "The AI's answer is checked before it reaches the editor. A bad answer fails safely." },
        { type: "heading", text: "My role" },
        { type: "paragraph", text: "I designed and built Schema from start to finish. That includes the user flows, the editor, and the APIs behind them." },
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

export const designSkills: SkillGroup[] = [
  { category: "Product design", items: ["User flows", "Interaction design", "Design systems", "Accessibility", "Responsive layouts", "Dark mode"] },
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
    slug: "inference-engineering",
    title: "Inference Engineering: A Complete Beginner's Guide",
    excerpt: "A first-principles learning roadmap from zero to advanced, for developers with a backend engineering background.",
    date: "October 22, 2026",
    cover: inferenceCover,
    coverAlt: "Hand-drawn diagram of an LLM: prefill, decode, the KV cache, attention keys and the inference engine",
    status: "published",
    tags: ["inference", "llm"],
    series: "Inference Engineering",
    body: parseMarkdown(inferenceGuide),
  },
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

/* Design system: values copied from src/index.css and src/components/reference-home.css. Update both when a token changes. */
export const colourTokens = [
  { name: "Page", token: "--page", light: "#fbfbfb", dark: "#0f0f10" },
  { name: "Primary text", token: "--primary", light: "#262626", dark: "#f5f5f5" },
  { name: "Strong text", token: "--strong", light: "#171717", dark: "#f0f0f0" },
  { name: "Secondary text", token: "--secondary", light: "#666666", dark: "#a3a3a3" },
  { name: "Tertiary text", token: "--tertiary", light: "#737373", dark: "#8a8a8a" },
  { name: "Faint text", token: "--faint", light: "#a3a3a3", dark: "#7a7a7a" },
  { name: "Hairline", token: "--hairline", light: "#e5e5e5", dark: "#2a2a2d" },
  { name: "Surface", token: "--surface", light: "#f5f5f5", dark: "#1c1c1f" },
  { name: "Link and focus", token: "--link", light: "#0f4bf1", dark: "#7aa7ff" },
];

export const motionTokens = [
  { token: "--ease", value: "cubic-bezier(.25, .1, .25, 1)", use: "Colour changes on links and chips, 200ms" },
  { token: "--ease-out", value: "cubic-bezier(0.23, 1, 0.32, 1)", use: "Button and pill presses, 160ms, scaling to 0.97" },
];

export const accessibilityRules = [
  "Links and buttons show a 2px focus ring, offset 3px, in the link colour.",
  "Reduced motion: when the system asks for it, transitions and animations are cut to near zero, and the skills row stops scrolling.",
  "Hover effects only apply to devices with a fine pointer, so taps on touch screens don't leave a stuck state.",
  "Each colour pair is set for both light and dark themes. Readers switch between them with the theme toggle in the footer.",
  "Project links that open in a new tab say so for screen readers. Content images have alt text, and decorative images are hidden from them.",
  "Pages use landmark elements: a main region, a header, a footer, and labelled navigation.",
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
