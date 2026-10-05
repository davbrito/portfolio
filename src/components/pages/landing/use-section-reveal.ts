import { useEffect } from "react";

/**
 * Revelado de secciones al entrar en pantalla, una sola vez.
 *
 * Sólo se ocultan las secciones que al montar están por debajo del viewport:
 * lo que ya está visible o se dejó atrás (p. ej. al recargar a mitad de
 * página) nunca se oculta. Sin JavaScript o con «reducir movimiento», todo
 * queda visible sin animación.
 */
export function useSectionReveal(selector = ".tech-reveal") {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "shown";
          observer.unobserve(entry.target);
        }
      },
      // Se dispara cuando la sección asoma un poco por encima del borde inferior.
      { rootMargin: "0px 0px -12% 0px" },
    );

    // Al terminar se retira el atributo: sin animación ni transform residuales,
    // la sección deja de ser una capa compuesta. Así Chrome no deja zonas sin
    // repintar cuando algo cambia dentro (p. ej. el iframe de Turnstile al
    // mostrar el desafío).
    function onAnimationEnd(event: AnimationEvent) {
      const element = event.target;
      if (event.animationName !== "tech-reveal" || !(element instanceof HTMLElement)) return;
      if (element.dataset.reveal === "shown") delete element.dataset.reveal;
    }
    document.addEventListener("animationend", onAnimationEnd);

    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
      if (element.getBoundingClientRect().top <= window.innerHeight) continue;
      element.dataset.reveal = "pending";
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      document.removeEventListener("animationend", onAnimationEnd);
    };
  }, [selector]);
}
