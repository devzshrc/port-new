import { useEffect, useId, useState } from "react";

type Status = "loading" | "ready" | "error";
const themeName = (): "dark" | "default" => (document.documentElement.dataset.theme === "dark" ? "dark" : "default");

/**
 * Draws a Mermaid diagram as SVG. Mermaid loads on demand and follows the site's light or dark theme.
 * Ported from mermaidcn (https://mermaidcn.vercel.app), with strict security since the source is our own content.
 */
export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [theme, setTheme] = useState(themeName);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(themeName()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    import("mermaid")
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme, fontFamily: "Inter, sans-serif", fontSize: 14 });
        const { svg: output } = await mermaid.render(`mermaid-${id}-${Date.now()}`, chart.trim());
        if (!cancelled) {
          setSvg(output);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [chart, theme, id]);

  if (status === "error") return <pre className="mermaid-fallback"><code>{chart}</code></pre>;

  return <div className="mermaid-diagram" aria-busy={status === "loading"}>
    {svg
      ? <div className="mermaid-svg" role="img" aria-label="Diagram" dangerouslySetInnerHTML={{ __html: svg }} />
      : <p className="mermaid-status">Drawing diagram…</p>}
  </div>;
}
