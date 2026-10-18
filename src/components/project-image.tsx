import type { WorkItem } from "../content";

/** Keep actual screenshots in their original proportions in every presentation. */
export function ProjectImage({ project, theme, full = false, className = "" }: { project: WorkItem; theme: string; full?: boolean; className?: string }) {
  const dark = theme === "dark";
  const images = project.landingImages;
  const src = images ? full ? (dark ? images.fullDark ?? images.fullLight : images.fullLight) : (dark ? images.dark ?? images.light : images.light) : project.image;
  return <img className={className} src={src} alt={`${project.title.split(" — ")[0]} ${full ? "complete landing page" : "landing page"}, ${dark && images?.dark ? "dark" : "light"} appearance`} loading="lazy" decoding="async" />;
}
