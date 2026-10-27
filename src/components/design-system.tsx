import { accessibilityRules, colourTokens, motionTokens } from "../content";
import "./design-system.css";

/** The page body for /design-system. The values here mirror the stylesheet; update both when a token changes. */
export function DesignSystemContent() {
  return <>
    <header className="project-intro">
      <h1>Design system</h1>
      <p>The colours, type, motion and accessibility rules behind this site.</p>
    </header>

    <section className="ds-section">
      <h2 className="section-title">Colour</h2>
      <ul className="ds-list ds-swatches">
        {colourTokens.map(color => <li key={color.token}>
          <span className="ds-swatch" style={{ background: color.light }} aria-hidden="true" />
          <span className="ds-swatch" style={{ background: color.dark }} aria-hidden="true" />
          <div>
            <p className="ds-swatch-name">{color.name}</p>
            <p className="ds-meta"><code>{color.token}</code> · light {color.light} · dark {color.dark}</p>
          </div>
        </li>)}
      </ul>
    </section>

    <section className="ds-section">
      <h2 className="section-title">Type</h2>
      <div className="ds-stack">
        <p className="ds-type-title">Page title, 20px, medium</p>
        <p className="ds-type-body">Body text, 16px with a 1.6 line height. Long reading lines stay near 650px wide.</p>
        <p className="ds-type-small">Small text, 14px, for captions, dates and footers.</p>
        <p className="ds-type-label">Section label, 12px, semibold</p>
      </div>
    </section>

    <section className="ds-section">
      <h2 className="section-title">Components</h2>
      <div className="ds-stack">
        <div className="ds-row">
          <a className="button-primary" href="/#contact">Primary button</a>
          <a className="pill" href="/#work">Pill link</a>
          <span className="skill-chip"><span>Chip</span></span>
        </div>
        <p className="ds-meta">Buttons and pills are 36px tall. Presses scale to 97%.</p>
      </div>
    </section>

    <section className="ds-section">
      <h2 className="section-title">Motion</h2>
      <ul className="ds-list">
        {motionTokens.map(motion => <li key={motion.token}><code>{motion.token}</code> {motion.value}. {motion.use}.</li>)}
      </ul>
    </section>

    <section className="ds-section">
      <h2 className="section-title">Accessibility</h2>
      <ul className="ds-list">
        {accessibilityRules.map(rule => <li key={rule}>{rule}</li>)}
      </ul>
    </section>
  </>;
}
