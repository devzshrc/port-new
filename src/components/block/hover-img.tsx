// Adapted from ObsidianUI (MIT). See THIRD_PARTY_NOTICES.md.
"use client";

import React, { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import "@/components/block/hover-img.css";

interface ProjectItem {
    title: string;
    label: string;
    imageSrc: string;
    href: string;
    content?: ReactNode;
}

interface HoverImgProps {
    projects?: ProjectItem[];
    className?: string;
    isContained?: boolean; // New prop for grid previews
    compact?: boolean; // New prop for compact layout
}

export function HoverImg({ projects = [], className, isContained = false, compact = false }: HoverImgProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const thumbnailRef = useRef<HTMLDivElement>(null);
    const xToRef = useRef<gsap.QuickToFunc | null>(null);
    const yToRef = useRef<gsap.QuickToFunc | null>(null);

    useEffect(() => {
        const projectThumbnail = thumbnailRef.current;
        const projectsContainer = containerRef.current?.querySelector(
            ".hover-img-projects"
        ) as HTMLElement | null;

        if (!projectThumbnail || !projectsContainer || window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;

        const projectElements = gsap.utils.toArray(
            ".hover-img-project",
            projectsContainer
        ) as HTMLElement[];
        const thumbnails = gsap.utils.toArray(
            ".hover-img-thumbnail",
            projectThumbnail
        ) as HTMLElement[];

        gsap.set(projectThumbnail, { scale: 0, xPercent: -50, yPercent: -50 });

        xToRef.current = gsap.quickTo(projectThumbnail, "x", {
            duration: 0.4,
            ease: "power3.out",
        });
        yToRef.current = gsap.quickTo(projectThumbnail, "y", {
            duration: 0.4,
            ease: "power3.out",
        });

        const handleMouseMove = (e: MouseEvent) => {
            let x = e.clientX;
            let y = e.clientY;

            if (isContained && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const halfWidth = projectThumbnail.offsetWidth / 2;
                const halfHeight = projectThumbnail.offsetHeight / 2;
                const inset = 16;
                x = Math.max(halfWidth + inset, Math.min(rect.width - halfWidth - inset, e.clientX - rect.left));
                y = Math.max(halfHeight + inset, Math.min(rect.height - halfHeight - inset, e.clientY - rect.top));
            }

            xToRef.current?.(x);
            yToRef.current?.(y);
        };

        const handleMouseLeave = () => {
            gsap.to(projectThumbnail, {
                scale: 0,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
            });
        };

        projectsContainer.addEventListener("mousemove", handleMouseMove);
        projectsContainer.addEventListener("mouseleave", handleMouseLeave);

        const projectListeners: Array<() => void> = [];

        projectElements.forEach((project, index) => {
            const handleMouseEnter = () => {
                gsap.to(projectThumbnail, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto",
                });

                gsap.to(thumbnails, {
                    yPercent: -100 * index,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            };

            project.addEventListener("mouseenter", handleMouseEnter);
            projectListeners.push(() =>
                project.removeEventListener("mouseenter", handleMouseEnter)
            );
        });

        return () => {
            projectsContainer.removeEventListener("mousemove", handleMouseMove);
            projectsContainer.removeEventListener("mouseleave", handleMouseLeave);
            projectListeners.forEach((cleanup) => cleanup());
            gsap.killTweensOf([projectThumbnail, ...thumbnails]);
        };
    }, [projects, isContained]);

    return (
        <div className={`hover-img-container ${compact ? "hover-img-compact" : ""} ${className || ""}`} ref={containerRef}>
            <div className="hover-img-projects">
                {projects.map((project, index) => (
                    <article className="hover-img-project" key={project.href}>
                        <a href={project.href} className="hover-img-mobile-preview"><img src={project.imageSrc} alt={project.title} loading="lazy" /></a>
                        <h3><a href={project.href}>{project.title} →</a></h3>
                        <p>{project.label}</p>
                        {project.content}
                    </article>
                ))}
            </div>

            <div
                aria-hidden="true"
                className="hover-img-thumbnail-wrapper"
                ref={thumbnailRef}
                style={isContained ? { position: "absolute" } : undefined}
            >
                {projects.map((project, index) => (
                    <div className="hover-img-thumbnail" key={index}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={project.imageSrc} alt={project.title} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HoverImg;
