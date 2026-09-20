import avatar from "./assets/devashish-profile.png";
import bbaUniversityIcon from "./assets/bbau-university.png";
import redstringIcon from "./assets/redstring-favicon.png";
import coverPortfolio from "./assets/cover-portfolio.svg";

export type PublicationStatus = "published" | "draft";
export type NavigationLink = { label: string; href: string };
export type SocialLink = { label: string; href: string; network: "github" | "linkedin" | "x" | "instagram" | "cal" };

export type SiteIdentity = {
  name: string;
  role: string;
  location: string;
  domain: string;
  biography: string[];
  avatar: string;
  navigation: NavigationLink[];
  socials: SocialLink[];
  footer: string;
};

export type WorkItem = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  links?: { label: string; href: string }[];
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
  biography: [
    "I design and build thoughtful full-stack products, from the interface people touch to the systems that keep them dependable.",
    "रख देगा झकझोर के तुझे, तूफ़ानों का घोर है डेरा।\nभँवर से गर जो हार मान ले, काहे का फिर ज़ोर है तेरा।",
  ],
  avatar,
  navigation: [
    { label: "Work", href: "/#work" },
    { label: "Blog", href: "/blog" },
    { label: "Resources", href: "/resources" },
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
    title: "Schema — AI-Powered Form Builder",
    description: "An AI form builder with typed APIs, secure multi-tenant workspaces, and structured Llama-powered generation.",
    href: "https://notyourtypeformx-web.vercel.app/",
    external: true,
    links: [
      { label: "Live", href: "https://notyourtypeformx-web.vercel.app/" },
      { label: "GitHub", href: "https://github.com/devzshrc/notyourtypeformx" },
    ],
    order: 1,
    status: "published",
  },
  {
    title: "Portfolio",
    description: "A compact home for product work and useful resources.",
    href: "/resources/portfolio",
    order: 2,
    status: "published",
  },
  {
    title: "Next product",
    description: "Reserved for a future project.",
    href: "#",
    order: 2,
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
    company: "Redstring Remote",
    role: "Software Engineer, Backend and Platform",
    period: "Apr 2026 – Present",
    icon: redstringIcon,
  },
];

export const resources: ResourceItem[] = [
  {
    slug: "portfolio",
    title: "Portfolio build notes",
    description: "The decisions behind this small, content-led portfolio system.",
    cover: coverPortfolio,
    coverAlt: "Abstract blue editorial grid representing the portfolio",
    status: "published",
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
    status: "published",
    body: [
      { type: "paragraph", text: "This is a sample blog entry for the portfolio. It gives the writing route a complete shape without pretending to be a finished essay." },
      { type: "heading", text: "A place for useful notes" },
      { type: "paragraph", text: "Future posts can live here: practical observations about product engineering, dependable systems, and the small details that make software feel considered." },
    ],
  },
];
