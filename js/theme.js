/**
 * ============================================================================
 *  TEMA CLARO / OSCURO
 * ============================================================================
 *  Se aplica de inmediato (antes del resto del <body>) para evitar el
 *  parpadeo del tema por defecto. La preferencia se guarda en localStorage
 *  y se reutiliza en las próximas visitas.
 * ============================================================================
 */
(function () {
  const STORAGE_KEY = "uptc-simulador-tema";

  function temaGuardado() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function guardarTema(tema) {
    try {
      localStorage.setItem(STORAGE_KEY, tema);
    } catch (e) {
      /* localStorage no disponible: el tema simplemente no persiste */
    }
  }

  function actualizarBoton(tema) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const vaHaciaClaro = tema !== "light";
    btn.textContent = vaHaciaClaro ? "☀ Tema claro" : "☾ Tema oscuro";
    btn.setAttribute("aria-label", vaHaciaClaro ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  }

  function aplicarTema(tema) {
    document.documentElement.setAttribute("data-theme", tema);
    actualizarBoton(tema);
  }

  // Aplicar cuanto antes (el <html> ya existe aunque el <body> no se haya parseado).
  aplicarTema(temaGuardado() === "light" ? "light" : "dark");

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    // Re-sincroniza el texto del botón ahora que existe en el DOM.
    actualizarBoton(document.documentElement.getAttribute("data-theme"));

    btn.addEventListener("click", function () {
      const actual = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const siguiente = actual === "dark" ? "light" : "dark";
      guardarTema(siguiente);
      aplicarTema(siguiente);
    });
  });
})();
