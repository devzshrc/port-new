import avatar from "./assets/devashish-profile.jpg";
import banner from "./assets/banner.jpg";
import bbaUniversityIcon from "./assets/bbau-university.png";
import redstringIcon from "./assets/redstring-favicon.png";
import coverPortfolio from "./assets/cover-portfolio.svg";
import inferenceCover from "./assets/inference-cover.webp";
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

/** Homepage title: name, role and the work it's known for. */
export const homeTitle = "Devashish: Software Engineer, AI tools and backend systems";

export const identity: SiteIdentity = {
  name: "Devashish",
  role: "Software Engineer",
  location: "India",
  domain: "devzshrc.in",
  email: "devzshrc@gmail.com",
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
    description: "Search 1,491 hiring Y Combinator startups in one place, match your resume against each role, and track your applications. Your resume stays on your device.",
    href: "/work/yc-jobs",
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
        { type: "paragraph", text: "Looking for a startup job is messy. You open forty tabs. Company lists are in one place, job details in another, salaries somewhere else, and your applications in a spreadsheet. YC Jobs puts all of it on one fast page." },
        { type: "heading", text: "What it does" },
        { type: "list", items: [
          "Browse 1,491 companies that are hiring. Filter by remote work, visa sponsorship, location, industry, team size, stage, and batch.",
          "Check your resume. The app reads your PDF and ranks the companies and jobs that fit you best.",
          "See the numbers. Charts show salary ranges, how fast new jobs appear, and more.",
          "Track your applications. A board shows each stage, with message drafts and a way to back up your data.",
        ] },
        { type: "heading", text: "Your data" },
        { type: "paragraph", text: "There are no accounts and no tracking. Your resume is read on your own device and is never uploaded." },
        { type: "heading", text: "My part" },
        { type: "paragraph", text: "I designed and built YC Jobs from start to finish. That includes the search, the resume matching, the charts, the tracker, and the Cloudflare setup." },
        { type: "heading", text: "Result" },
        { type: "paragraph", text: "YC Jobs is live and open source. Try it, or read the code on GitHub." },
      ],
    },
    order: 0,
    status: "published",
  },
  {
    title: "Docks",
    description: "A GitHub code review workspace. It sorts pull requests into boards, and AI writes a short guide that explains each change.",
    href: "/work/docks",
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
        { type: "heading", text: "The idea" },
        { type: "paragraph", text: "Docks puts GitHub code reviews in one place. You can see which pull requests are stuck, who is reviewing them, and what needs attention first. You can save your own views and share links that keep your filters." },
        { type: "heading", text: "AI help" },
        { type: "paragraph", text: "Docks asks the OpenAI API to write review guides. Each guide is checked for the right shape and saved for each commit. Big changes are split into smaller parts. If the AI fails, a simple backup guide still loads." },
        { type: "heading", text: "Reviewing code" },
        { type: "list", items: [
          "Read changes side by side or in one column. Code is coloured so it is easy to read.",
          "Leave comments, reply to threads, approve, or ask for changes. Your drafts are saved as you type.",
          "Track issues in lists, edit many at once, and turn a comment into an issue.",
        ] },
        { type: "heading", text: "For teams" },
        { type: "list", items: [
          "Teams get roles, invites, and access rules. Admins can see audit logs and export data.",
          "Reviewer suggestions use code owners, past reviews, and who has time. Weekly reports show how reviews are going.",
        ] },
        { type: "heading", text: "How it is built" },
        { type: "list", items: [
          "One monorepo holds the web app, the API, and the database code. Each part stays separate.",
          "Sign-in uses GitHub with email checks and two-factor login. Secrets are encrypted and requests are rate limited.",
          "Background jobs keep GitHub data in sync and retry safely when something fails.",
          "It runs on Cloudflare Workers. GitHub Actions handles database changes and deploys. Tests include 30 sample pull requests for the AI.",
        ] },
      ],
    },
    order: 1,
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
        { type: "heading", text: "The problem" },
        { type: "paragraph", text: "Making a good form takes a long time. You pick the questions, choose the field types, add checks, and set up skip rules. Most of that work is repeated every time." },
        { type: "heading", text: "How it works" },
        { type: "paragraph", text: "You describe the form in plain words. Schema gives you a draft with questions, field types, checks, and skip rules. You can edit everything it makes." },
        { type: "list", items: [
          "One clear form format is used for both AI-made and hand-made forms, so they work the same way.",
          "The AI's answer is checked before it reaches the editor. A bad answer fails safely.",
          "Everything can be edited. The prompt is a head start.",
        ] },
        { type: "heading", text: "My part" },
        { type: "paragraph", text: "I designed and built Schema from start to finish. That includes the user flows, the editor, and the APIs behind them." },
        { type: "heading", text: "Result" },
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
