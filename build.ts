import tailwind from "bun-plugin-tailwind";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { homeTitle, identity, posts, profileLinks, resources, work } from "./src/content";

const site = "https://devzshrc.in";
const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const published = posts.filter(post => post.status === "published");
const outdir = path.join(process.cwd(), "dist");

type Page = {
  route: string;
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string;
  robots?: string;
  jsonLd?: Record<string, unknown>;
};

const defaultImage = `${site}/og.png`;
const person = { "@context": "https://schema.org", "@type": "Person", name: identity.name, jobTitle: identity.role, address: { "@type": "PostalAddress", addressCountry: identity.location }, url: site, sameAs: profileLinks() };

// Pages that exist as their own HTML file. Drafts are included with noindex so previews work on the live site.
const pages: Page[] = [
  { route: "/", title: homeTitle, description: "Product engineering and selected work from Devashish.", jsonLd: person },
  { route: "/blog", title: "Blog | Devashish", description: "Notes on product engineering and building useful software." },
  { route: "/now", title: "Now | Devashish", description: identity.now.text },
  ...work.filter(entry => entry.caseStudy).map(entry => ({ route: `/work/${entry.caseStudy!.slug}`, title: `${entry.title} | Devashish`, description: entry.description })),
  ...posts.map(post => ({
    route: `/blog/${post.slug}`,
    title: `${post.title} | Devashish`,
    description: post.excerpt,
    type: "article" as const,
    robots: post.status === "draft" ? "noindex, nofollow" : undefined,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: new Date(post.date).toISOString(),
      dateModified: new Date(post.updated ?? post.date).toISOString(),
      author: { "@type": "Person", name: identity.name },
      url: `${site}/blog/${post.slug}`,
    },
  })),
  ...resources.filter(item => item.status === "published").map(item => ({ route: `/resources/${item.slug}`, title: `${item.title} | Devashish`, description: item.description })),
];

const notFound: Page = { route: "/404", title: "Page not found | Devashish", description: "The requested page could not be found.", robots: "noindex, nofollow" };

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escape(identity.name)}: Writing</title>
<link>${site}/blog</link>
<description>Notes on product engineering and building useful software.</description>
${published.map(post => `<item>
<title>${escape(post.title)}</title>
<link>${site}/blog/${post.slug}</link>
<guid>${site}/blog/${post.slug}</guid>
<description>${escape(post.excerpt)}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`).join("\n")}
</channel>
</rss>
`;

const indexable = pages.filter(page => !page.robots);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(page => `<url><loc>${site}${page.route === "/" ? "" : page.route}</loc></url>`).join("\n")}
</urlset>
`;

await rm(outdir, { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: [...new Bun.Glob("src/**/*.html").scanSync()],
  outdir,
  plugins: [tailwind],
  minify: true,
  splitting: true,
  target: "browser",
  publicPath: "/",
  sourcemap: "none",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

for (const output of result.outputs) {
  console.log(` ${path.relative(process.cwd(), output.path)}  ${(output.size / 1024).toFixed(1)} KB`);
}

const indexPath = path.join(outdir, "index.html");
const fontLinks = `<link rel="preload" href="/fonts/inter-latin-wght.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/fonts/inter.css" />`;
const template = (await readFile(indexPath, "utf8")).replaceAll('href="./', 'href="/').replaceAll('src="./', 'src="/').replace("</head>", `    ${fontLinks}
  </head>`);

// Head-only prerender: each route gets its own title, description, canonical, social and structured data tags.
const withoutHead = (html: string) => html
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace(/<meta name="(description|robots|twitter:[a-z]+)"[^>]*>/g, "")
  .replace(/<meta property="og:[a-z:]+"[^>]*>/g, "")
  .replace(/<link rel="canonical"[^>]*>/g, "")
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");

const headTags = (page: Page) => {
  const url = page.route === "/" ? `${site}/` : `${site}${page.route}`;
  const image = page.image ?? defaultImage;
  return [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<meta name="robots" content="${page.robots ?? "index, follow"}" />`,
    ...(page.route === "/404" ? [] : [`<link rel="canonical" href="${url}" />`]),
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    `<meta property="og:type" content="${page.type ?? "website"}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(page.title)}" />`,
    `<meta name="twitter:description" content="${escape(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    page.jsonLd ? `<script type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, "\\u003c")}</script>` : "",
  ].filter(Boolean).join("\n    ");
};

const render = (page: Page) => withoutHead(template).replace("</head>", `    ${headTags(page)}\n  </head>`);

// Social images for posts are copied next to the site so each post links to its own cover.
await mkdir(path.join(outdir, "social"), { recursive: true });
for (const post of published) {
  await cp(post.cover, path.join(outdir, "social", path.basename(post.cover)));
}
for (const page of pages) {
  const post = published.find(entry => `/blog/${entry.slug}` === page.route);
  if (post) page.image = `${site}/social/${path.basename(post.cover)}`;
}

for (const page of pages) {
  const file = page.route === "/" ? indexPath : path.join(outdir, `${page.route.slice(1)}.html`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, render(page));
}
await writeFile(path.join(outdir, "404.html"), render(notFound));
await cp(path.join(process.cwd(), "public"), outdir, { recursive: true, force: true });
await writeFile(path.join(outdir, "feed.xml"), feed);
await writeFile(path.join(outdir, "sitemap.xml"), sitemap);
console.log(` prerendered ${pages.length} pages + 404`);
