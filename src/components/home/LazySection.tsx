"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Ids already revealed this session. Switching tabs remounts the sections, so
// without this a section the user already scrolled to would collapse again.
// Their images then come straight from the browser cache (see public/_headers).
const revealed = new Set<string>();

/** Renders `children` only once the placeholder is within ~one screen of the viewport. */
export function LazySection({
  id,
  children,
  minHeight = 480,
}: {
  id: string;
  children: ReactNode;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => revealed.has(id));

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        revealed.add(id);
        setVisible(true);
        io.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, visible]);

  return visible ? <>{children}</> : <div ref={ref} style={{ minHeight }} aria-hidden />;
}
