import { useRef, useState, type ReactNode } from "react";

export function SelectionLabel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const measure = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
  };

  return <span className="selection-label" ref={ref} onMouseEnter={measure} onFocus={measure}>
    {children}
    <span className="selection-frame" aria-hidden="true"><i /><i /><i /><i /><span className="selection-size">{size.width} × {size.height}</span></span>
  </span>;
}
