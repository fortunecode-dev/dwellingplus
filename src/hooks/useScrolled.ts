// hooks/useScrolled.ts
import { useEffect, useRef, useState } from "react";

/**
 * Umbral con histéresis: entra a scrolled con 'enterAt' y sale a no-scrolled con 'exitBelow'.
 * Evita parpadeos alrededor del punto de corte.
 */
export function useScrolled(enterAt = 64, exitBelow = 48) {
  const [isScrolled, setIsScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      // rAF: agrupa lecturas/escrituras y evita jank
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setIsScrolled(prev =>
          prev ? y > exitBelow : y > enterAt
        );
        ticking.current = false;
      });
    };

    // passive mejora el perf del scroll
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // estado inicial
    return () => window.removeEventListener("scroll", onScroll);
  }, [enterAt, exitBelow]);

  return isScrolled;
}
