import { useState } from "react";
import { CalendarDays, Globe } from "lucide-react";
import { EmailButton } from "./email-button";
import { GitHubHeatmap } from "./github-heatmap";
import { TechLogo } from "./tech-logo";
import { AvailabilityStatus } from "./availability-status";
import { ContactForm } from "./contact-form";
import { ThemeToggle } from "./theme-toggle";
import { LeetCodeWidget } from "./leetcode-widget";
import { designSkills, education, experience, identity, posts, skills, work } from "../content";
import { published } from "../lib/site";
import portraitAsset from "../assets/devashish-portrait.webp";
import displayPictureAsset from "../assets/display-picture.webp";
import bannerAsset from "../assets/banner-hero.webp";

const resumeHref = "https://drive.google.com/file/d/1UNLChy2Si6ciUFf_FRjimbbAB5RyQc5e/view?usp=sharing";
const contactNetworks = ["instagram", "x", "github", "linkedin", "cal"];

function SocialIcon({ network }: { network: string }) {
  if (network === "instagram") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></svg>;
  if (network === "github") return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>;
  if (network === "linkedin") return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
  if (network === "x") return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>;
  return <CalendarDays size={14} aria-hidden="true" />;
}

export function ReferenceHome() {
  const skillSets = [
    { label: "Product design", items: designSkills.flatMap(group => group.items) },
    { label: "Engineering", items: skills.flatMap(group => group.items) },
  ];
  const [bannerReady, setBannerReady] = useState(false);
  const projects = published(work).sort((a, b) => a.order - b.order);
  const socials = identity.socials.filter(link => contactNetworks.includes(link.network));

  return <main id="content" className="folio">
    <img className={bannerReady ? "home-banner is-loaded" : "home-banner"} src={bannerAsset} alt="" aria-hidden="true" width="2000" height="750" onLoad={() => setBannerReady(true)} onError={() => setBannerReady(true)} />
    <section id="top" className="intro">
      <img className="intro-avatar intro-avatar-desktop" src={displayPictureAsset} alt={identity.name} width="100" height="100" />
      <img className="intro-avatar intro-avatar-mobile" src={portraitAsset} alt={identity.name} width="100" height="100" />
      <h1>I’m <strong>{identity.name}</strong> -- a product designer and software engineer.</h1>
      <p>I design the flows people use and build the features and APIs behind them, whether the problem is my own, someone else's, or everyone's. I have a deep interest in physics, technology, and poetry.</p>
      <AvailabilityStatus />
      <div className="intro-actions">
        <EmailButton />
        <a className="pill" href={resumeHref} target="_blank" rel="noreferrer">Resume ↗</a>
      </div>
    </section>

    {projects.length > 0 && <section id="work" className="section">
      <h2 className="section-title">Proof of work</h2>
      {projects.map(project => {
        const live = project.links?.find(link => link.label === "Live")?.href;
        const github = project.links?.find(link => link.label === "GitHub")?.href;
        return <article className="work-item" key={project.href}>
          <div className="work-head">
            <a className="work-title" href={project.href}>{project.title}</a>
            {project.caseStudy && <time dateTime={project.caseStudy.year}>{project.caseStudy.year}</time>}
          </div>
          <p>{project.description}</p>
          <div className="work-links">
            {live && <a className="pill" href={live} target="_blank" rel="noreferrer"><Globe size={14} aria-hidden="true" />Live<span className="visually-hidden"> (opens in new tab)</span></a>}
            {github && <a className="pill" href={github} target="_blank" rel="noreferrer"><SocialIcon network="github" />GitHub<span className="visually-hidden"> (opens in new tab)</span></a>}
          </div>
        </article>;
      })}
    </section>}

    {published(posts).length > 0 && <section id="writing" className="section">
      <div className="section-head">
        <h2 className="section-title">Writing</h2>
        <a className="section-link" href="/blog">All writing →</a>
      </div>
      {published(posts).map(post => <article className="work-item" key={post.slug}>
        <div className="work-head">
          <a className="work-title" href={`/blog/${post.slug}`}>{post.title}</a>
          <time>{post.date}</time>
        </div>
        <p>{post.excerpt}</p>
      </article>)}
    </section>}

    <section id="github" className="section">
      <h2 className="section-title">GitHub</h2>
      <GitHubHeatmap />
    </section>

    <section id="practice" className="section">
      <h2 className="section-title">Practice</h2>
      <LeetCodeWidget />
    </section>

    <section id="experience" className="section">
      <h2 className="section-title">Experience & education</h2>
      <ul className="row-list">
        {experience.map(entry => <li key={entry.company}>
          <img className="row-logo" src={entry.icon} alt={`${entry.company} logo`} width="28" height="28" />
          <div className="row-main">
            <span className="row-title">{entry.companyHref ? <a href={entry.companyHref} target="_blank" rel="noreferrer">{entry.company} ↗</a> : entry.company}</span>
            <p>{entry.role}</p>
          </div>
          <time>{entry.period}</time>
        </li>)}
        {education.map(entry => <li key={entry.institution}>
          <img className="row-logo" src={entry.logo} alt={`${entry.institution} logo`} width="28" height="28" />
          <div className="row-main">
            <span className="row-title">{entry.institution}</span>
            <p>{entry.degree}</p>
          </div>
          <time>{entry.period}</time>
        </li>)}
      </ul>
    </section>

    <section className="section">
      <h2 className="section-title">Skills</h2>
      {skillSets.map(set => <div className="skill-group" key={set.label}>
        <p className="skill-group-title">{set.label}</p>
        <div className="skill-marquee">
          <div className="skill-track">
            <ul className="skill-set">
              {set.items.map(item => <li className="skill-chip" key={item}><TechLogo name={item} /><span>{item}</span></li>)}
            </ul>
            <ul className="skill-set" aria-hidden="true">
              {set.items.map(item => <li className="skill-chip" key={item}><TechLogo name={item} /><span>{item}</span></li>)}
            </ul>
          </div>
        </div>
      </div>)}
    </section>

    <footer id="contact" className="section contact">
      <h2 className="section-title">Contact</h2>
      <p>Hiring for a product design role, or have something to build? Send me a message. I would love to hear it.</p>
      <ContactForm />
      <nav className="contact-links" aria-label="Social profiles">
        {socials.map(link => <a className="pill" key={link.network} href={link.href} target="_blank" rel="noreferrer"><SocialIcon network={link.network} />{link.network === "cal" ? "Book a call" : link.label}</a>)}
      </nav>
      <nav className="footer-columns" aria-label="Site map">
        <div>
          <p className="footer-heading">Navigation</p>
          <ul>
            <li><a href="#work">Proof of work</a></li>
            <li><a href="#experience">Experience</a></li>
            {published(posts).length > 0 && <li><a href="/blog">Writing</a></li>}
            <li><a href="/now">Now</a></li>
            <li><a href="/design-system">Design system</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-heading">Projects</p>
          <ul>{projects.map(project => <li key={project.href}><a href={project.href}>{project.title}</a></li>)}</ul>
        </div>
        <div>
          <p className="footer-heading">Elsewhere</p>
          <ul>{socials.filter(link => link.network !== "cal").map(link => <li key={link.network}><a href={link.href} target="_blank" rel="noreferrer">{link.label}</a></li>)}</ul>
        </div>
        <div>
          <p className="footer-heading">Contact</p>
          <ul>
            <li><a href={`mailto:${identity.email}`}>{identity.email}</a></li>
            <li><a href={socials.find(link => link.network === "cal")?.href} target="_blank" rel="noreferrer">Book a call</a></li>
          </ul>
        </div>
      </nav>
      <div className="footer-bar">
        <p className="folio-footer">© {new Date().getFullYear()} {identity.name}. {identity.footer}</p>
        <ThemeToggle />
      </div>
    </footer>
  </main>;
}
