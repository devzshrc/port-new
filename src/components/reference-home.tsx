import { CalendarDays, Globe } from "lucide-react";
import { EmailButton } from "./email-button";
import { education, experience, identity, skills, work } from "../content";
import { published } from "../lib/site";
import portraitAsset from "../assets/devashish-portrait.webp";
import displayPictureAsset from "../assets/dp.png";

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
  const projects = published(work).sort((a, b) => a.order - b.order);
  const socials = identity.socials.filter(link => contactNetworks.includes(link.network));

  return <main id="content" className="folio">
    <section id="top" className="intro">
      <img className="intro-avatar intro-avatar-desktop" src={displayPictureAsset} alt={identity.name} width="100" height="100" />
      <img className="intro-avatar intro-avatar-mobile" src={portraitAsset} alt={identity.name} width="100" height="100" />
      <h1>I’m <strong>{identity.name}</strong> -- a software engineer.</h1>
      <p>I solve problems with software, whether they are my own, someone else's, or everyone's. I have a deep interest in physics, technology, and poetry.</p>
      <div className="intro-actions">
        <EmailButton />
        <a className="pill" href={resumeHref} target="_blank" rel="noreferrer">Resume ↗</a>
      </div>
    </section>

    <section id="work" className="section">
      <h2 className="section-title">Projects</h2>
      {projects.map(project => {
        const live = project.links?.find(link => link.label === "Live")?.href;
        const github = project.links?.find(link => link.label === "GitHub")?.href;
        return <article className="work-item" key={project.href}>
          <div className="work-head">
            <a className="work-title" href={project.href}>{project.title}</a>
            {project.caseStudy && <time>{project.caseStudy.year}</time>}
          </div>
          <p>{project.description}</p>
          <div className="work-links">
            {live && <a className="pill" href={live} target="_blank" rel="noreferrer"><Globe size={14} aria-hidden="true" />Live</a>}
            {github && <a className="pill" href={github} target="_blank" rel="noreferrer"><SocialIcon network="github" />GitHub</a>}
          </div>
        </article>;
      })}
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
      <dl className="skills">
        {skills.map(group => <div key={group.category}>
          <dt>{group.category}</dt>
          <dd>{group.items.join(" · ")}</dd>
        </div>)}
      </dl>
    </section>

    <footer id="contact" className="section contact">
      <h2 className="section-title">Contact</h2>
      <p>Got an idea? Send me a message. I would love to hear it.</p>
      <nav className="contact-links" aria-label="Social profiles">
        {socials.map(link => <a className="pill" key={link.network} href={link.href} target="_blank" rel="noreferrer"><SocialIcon network={link.network} />{link.network === "cal" ? "Book a call" : link.label}</a>)}
      </nav>
      <p className="folio-footer">© {new Date().getFullYear()} {identity.name}. {identity.footer}</p>
    </footer>
  </main>;
}
