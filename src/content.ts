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
    description: "A startup hiring platform with two modes: discover and track jobs, or source and manage candidates. Originally launched as Orbiter.",
    href: "/work/yc-jobs",
    links: [
      { label: "Live", href: "https://yc.devzshrc.in" },
      { label: "GitHub", href: "https://github.com/devzshrc/yc" },
    ],
    caseStudy: {
      slug: "yc-jobs",
      role: "Product design and full-stack engineering",
      year: "2026",
      stack: ["Bun workspaces", "React 19", "Tailwind CSS v4", "Hono", "Drizzle", "PostgreSQL", "AI SDK", "Cloudflare Workers"],
      body: [
        { type: "heading", text: "Problem" },
        { type: "paragraph", text: "Job seekers and hiring teams use too many separate tools. YC Jobs brings role discovery, applications, candidate sourcing, and interviews into one product. It began as Orbiter." },
        { type: "heading", text: "At a glance" },
        { type: "list", items: [
          "Job Search: find startup roles, see why they fit, track applications, and reach out.",
          "Hiring: source candidates, manage jobs and applications, and schedule interviews.",
          "Shared tools: accounts, teams, notifications, and administration.",
        ] },
        { type: "paragraph", text: "This page maps capabilities in the codebase. Access can depend on account permissions, feature flags, and connected services; not every capability is enabled or verified in every deployment." },
        { type: "heading", text: "Job Search" },
        { type: "heading", level: 3, text: "Find roles and companies" },
        { type: "list", items: [
          "Search startup jobs from multiple sources. Filter by role, location, experience, salary, remote work, job type, visa needs, posting date, and source.",
          "Sort jobs by relevance, freshness, salary, activity, or resume match.",
          "View company profiles and full job details. Find recently funded startups with open roles, read funding news linked to its source, and explore market data on pay, experience, industries, visas, and hiring activity.",
        ] },
        { type: "heading", level: 3, text: "Match and choose what to do next" },
        { type: "list", items: [
          "Add a resume to compare its skills and experience with jobs. Home and Today recommendations and daily picks suggest roles for you.",
          "Set job preferences and give feedback to improve recommendations. See why a role may be a match.",
        ] },
        { type: "heading", level: 3, text: "Save, apply, and follow up" },
        { type: "list", items: [
          "Save searches and turn on email alerts. Save jobs for later, or hide and restore them.",
          "Track companies and applications through saved, applied, interviewing, offer, and closed stages. Add notes, dates, and reminders; import tracking records.",
          "Apply to YC Jobs roles. Choose whether to share a parsed resume profile, opt into recruiter discovery, and respond to recruiter invitations.",
        ] },
        { type: "heading", level: 3, text: "Write to employers" },
        { type: "list", items: [
          "Draft personalized emails with AI or voice instructions through transcription.",
          "Save drafts, signatures, and attachments; connect Gmail; queue or schedule messages.",
          "Cancel, retry, or stop a message; follow up; optionally sync replies, block recipients, and review outreach activity.",
        ] },
        { type: "heading", text: "Hiring" },
        { type: "heading", level: 3, text: "Find candidates with AI" },
        { type: "list", items: [
          "Describe a hiring need in plain language. Search by role, skills, location, seniority, and experience.",
          "Set must-have and nice-to-have criteria. Confirm the search before it runs; search external profiles and opted-in Orbiter members.",
          "Rank candidates with evidence for each requirement. Review profiles, experience, education, and skills; compare named candidates in tables; find similar people; and give feedback to refine future searches.",
          "Generate job descriptions, outreach drafts, follow-up sequences, and interview scorecards. Ask general hiring and HR questions.",
        ] },
        { type: "heading", level: 3, text: "Work in a hiring workspace" },
        { type: "list", items: [
          "Create, rename, delete, and branch chats. Attach PDFs, text, Markdown, CSV, and JSON files.",
          "Edit your latest message, stop a response, use slash commands, and choose suggested follow-ups.",
          "Search conversations and move through an outline. Copy replies and download chats as Markdown.",
          "Pin messages and candidates. Open profiles, comparisons, and documents in tabs; save searches and generated documents.",
          "Keep an editable hiring brief with version history and personal or company memory.",
        ] },
        { type: "heading", level: 3, text: "Source leads every day" },
        { type: "list", items: [
          "Choose a daily schedule, timezone, candidate volume, and weekend runs. Pause or resume sourcing at any time.",
          "Review leads one by one or in batches. Approve or reject them with feedback before they enter the shortlist.",
          "Get notifications when leads arrive or sourcing needs attention. Monitor credits and usage limits.",
        ] },
        { type: "heading", level: 3, text: "Manage candidates with your team" },
        { type: "list", items: [
          "Shortlist candidates and export the list as CSV. Track new, contacted, replied, interviewing, and passed stages.",
          "Hide or restore candidates. Add comments and mentions, assign owners and follow-up dates, and filter to your candidates.",
          "Review activity, feedback insights, funnel metrics, and forecasts. Share candidate lists for review and collect votes and comments.",
          "Create teammate tasks. Reveal available contact details only after a confirmed action.",
        ] },
        { type: "heading", level: 3, text: "Post jobs and review applications" },
        { type: "list", items: [
          "Create company profiles and switch company workspaces. Create or edit jobs, submit them for review, then publish approved roles.",
          "Renew or close jobs. See applicants, suggested matches, visibility, quality signals, and ways to improve a posting.",
          "Invite candidates to apply and track their application status.",
        ] },
        { type: "heading", level: 3, text: "Build forms and review responses" },
        { type: "list", items: [
          "Build forms by hand or with AI. Add text, email, phone, URL, number, date, choice, yes/no, and rating questions.",
          "Add conditional questions, validation, and help text. Publish a public link, connect the form to a job, and set a closing date or response limit.",
          "Search responses, add private notes, and move candidates through stages. Screen with AI and use review templates or scorecards.",
          "Message candidates and optionally notify them when their stage changes. Export responses as CSV and view form visits, starts, submissions, and question completion.",
          "Optionally add CAPTCHA, application receipts, and team email notifications.",
        ] },
        { type: "heading", level: 3, text: "Schedule interviews" },
        { type: "list", items: [
          "Set interviewer availability and share a booking link so candidates can choose a time.",
          "Connect Google Calendar or Outlook, check for conflicts, and sync interview events.",
          "View interviews in a calendar; reschedule or cancel; send candidates management links and calendar invitations; set reminders.",
        ] },
        { type: "heading", text: "Accounts and administration" },
        { type: "heading", level: 3, text: "Manage your account" },
        { type: "list", items: [
          "Sign in with Google. Other sign-in methods are available when configured.",
          "Edit your profile, manage sessions, export your data, or delete your account. Choose light, dark, or system theme.",
        ] },
        { type: "heading", level: 3, text: "Run a team or administer the product" },
        { type: "list", items: [
          "Invite teammates, manage roles, remove members, transfer company ownership, and review team activity.",
          "Admins can review analytics, operations, and users; suspend or restore accounts; manage hiring access; and approve or reject job postings.",
        ] },
        { type: "heading", text: "Key decisions" },
        { type: "heading", level: 3, text: "Keep the job seeker in control" },
        { type: "paragraph", text: "Recommendations explain why a role may fit. Saving a job stays separate from applying, and people can manage their applications at their own pace." },
        { type: "heading", level: 3, text: "Make hiring actions reviewable" },
        { type: "paragraph", text: "Searches are confirmed before they run, generated forms can be edited, and daily leads need approval. Revealing candidate contact details also requires confirmation." },
        { type: "heading", text: "My role" },
        { type: "paragraph", text: "I designed and built YC Jobs from start to finish, from the two-mode product experience and job discovery to resume matching, recruiting workflows, and the platform behind them." },
        { type: "heading", text: "How it is built" },
        { type: "paragraph", text: "A Bun workspaces monorepo contains the React web app, Hono API, shared schemas, and Drizzle database package. The product uses PostgreSQL, an AI SDK for model-backed workflows, and Cloudflare Workers for deployment." },
        { type: "heading", text: "Outcome" },
        { type: "paragraph", text: "YC Jobs brings job search and hiring workflows together in one product, originally known as Orbiter. It is live and open source. Try it, or read the code on GitHub." },
      ],
    },
    order: 1,
    status: "published",
  },
  {
    title: "Docks",
    description: "A team workspace for GitHub pull request reviews, issue triage, release planning, and AI review help.",
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
        { type: "heading", text: "Problem" },
        { type: "paragraph", text: "Pull request reviews, issue work, and release planning can get spread across GitHub and team tools. Docks brings them into one workspace so people can see what needs attention, review code, and coordinate the work around it." },
        { type: "heading", text: "At a glance" },
        { type: "list", items: [
          "Reviews: a personal inbox and a shared board for pull requests.",
          "Team work: issue triage, reviewer planning, deadlines, releases, and insights.",
          "Workspace: repository settings, knowledge, integrations, access, and security.",
          "Main sections: Inbox, Reviews, Issues, Deadlines, Releases, Insights, People, and Settings.",
        ] },
        { type: "figure", src: docksReviews, alt: "Docks Reviews board with lanes for pull requests needing a reviewer, waiting for review, changes requested, and approved", caption: "The Reviews board shows each pull request’s review stage." },
        { type: "heading", text: "Pull request reviews" },
        { type: "heading", level: 3, text: "See what needs attention" },
        { type: "list", items: [
          "Use the team board for drafts, PRs needing a reviewer, waiting reviews, requested changes, and approvals.",
          "Search and filter by repository, author, reviewer, status, priority, and more. Save custom views.",
          "See reviews waiting on you, your own PRs, and work flagged as stuck.",
          "Use your personal inbox for reviews needing attention, overdue work, your own PRs, and snoozed PRs.",
          "Accept or release a review claim, decline a request, or snooze a PR.",
        ] },
        { type: "heading", level: 3, text: "Review and respond to code" },
        { type: "list", items: [
          "Read diffs with file navigation, search, syntax highlighting, and changed-file context.",
          "Follow a guided review order, save your progress, and use repository checklists.",
          "Comment on changed lines and reply to or resolve review threads.",
          "Submit a GitHub review, approve, request changes, check merge readiness, and use merge or auto-merge actions.",
          "See GitHub and Linear issues linked to a pull request.",
        ] },
        { type: "heading", text: "AI review help" },
        { type: "list", items: [
          "Generate review guides for enabled repositories and give feedback on the guides.",
          "Ask about a pull request or changed line. Answers stream into the review panel and cite code.",
          "Add repository knowledge documents as context. Questions and answers are private, tied to a commit, and marked outdated when the PR changes.",
          "Turn a review thread or saved answer into a GitHub issue. Hand off issue or PR work to Claude Code, Codex, or Cursor.",
          "Guides are checked and saved for each commit. Large reviews are split into smaller parts, and a fallback guide is available if AI fails.",
        ] },
        { type: "paragraph", text: "AI review tools depend on server configuration and repository settings." },
        { type: "heading", text: "GitHub Issues" },
        { type: "list", items: [
          "Browse Triage, Open, Assigned to me, Created by me, Stale, Closed, Board, and Insights views.",
          "Search, filter, and sort by repository, assignee, label, milestone, and activity.",
          "Create issues, edit titles and descriptions, comment, assign people, and manage labels and milestones.",
          "Close, reopen, assign, or label issues in bulk. Close issues as completed, not planned, or duplicates.",
          "Find similar issues, link duplicates, and see related files and pull requests.",
          "Review issue trends, age, closure time, and open issues by repository or assignee.",
        ] },
        { type: "heading", text: "Team planning" },
        { type: "heading", level: 3, text: "Balance reviews and deadlines" },
        { type: "list", items: [
          "See reviewer availability and workload, including open reviews, wait time, and review limits.",
          "Add expertise tags, set away dates and review limits, and organize people into teams.",
          "Set repository deadlines around working hours, configure reminders, and request a backup reviewer when work is overdue.",
        ] },
        { type: "heading", level: 3, text: "Plan releases and learn from reviews" },
        { type: "list", items: [
          "Build a release from selected pull requests, set a target date, and check merge readiness, blockers, and warnings.",
          "Export review evidence as CSV or JSON. Filter review insights by date, repository, team, and—when permitted—individual contributor.",
          "The Team plan adds deadlines, backup reviewers, release tracking, changes since your last review, and review exports.",
        ] },
        { type: "heading", text: "Workspace and integrations" },
        { type: "list", items: [
          "Create workspaces, invite members, assign roles, manage teams and repository access, and transfer workspace ownership.",
          "Install or link the GitHub App, connect a personal GitHub account, and choose which repositories Docks tracks.",
          "Set repository sync, AI guides, automatic reviewer assignment, checklists, and review rules.",
          "Store searchable Markdown knowledge by repository. Track revisions, archive or restore documents, and handle revision conflicts.",
          "Connect Slack for scheduled PR waiting digests and choose the timezone and send time.",
          "Connect Linear to show linked issues in reviews or create issues in a chosen team.",
          "Check integration and sync health, test webhooks, review setup and access checks, and retry eligible failed sync jobs.",
          "Require two-factor authentication, view the audit log, manage subscriptions, payment details, and plan usage, and export or delete workspace data.",
        ] },
        { type: "heading", level: 3, text: "Plans" },
        { type: "paragraph", text: "The Free plan supports up to 5 members and 3 enabled repositories. Team removes those limits and includes the planning and review-record features listed above." },
        { type: "heading", text: "Accounts and administration" },
        { type: "list", items: [
          "Sign up and sign in, including GitHub sign-in when configured. Verify email, reset passwords, and manage account details.",
          "Enable two-factor authentication with authenticator or backup codes. Manage trusted devices and sessions, or delete your account.",
          "Platform admins get an operations dashboard for users, workspaces, usage, retention, activity, audit history, health, errors, webhooks, and failed jobs.",
          "Based on their role, admins can suspend or reactivate accounts, revoke sessions, grant premium access, and retry eligible sync jobs.",
          "The product also has a public landing and pricing site. The old /dashboard route redirects to the review board.",
        ] },
        { type: "heading", text: "How it is built" },
        { type: "list", items: [
          "A monorepo keeps the web app, API, and database code together while keeping their responsibilities separate.",
          "GitHub sign-in, email verification, two-factor login, encrypted secrets, and rate limits support account and data security.",
          "Background jobs sync GitHub data and retry eligible failures. Cloudflare Workers run the app, and GitHub Actions handles database changes and deployments.",
          "AI review guides are checked before use and evaluated against 30 sample pull requests.",
        ] },
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
