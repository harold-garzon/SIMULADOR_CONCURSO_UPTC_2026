/**
 * ============================================================================
 *  TEMA CLARO / OSCURO
 * ============================================================================
 *  Se aplica de inmediato (antes del resto del <body>) para evitar el
 *  parpadeo del tema por defecto. La preferencia se guarda en localStorage
 *  y se reutiliza en las próximas visitas.
 *
 *  Además, cualquier <img data-dark="..." data-light="..."> se actualiza
 *  automáticamente para mostrar la versión del escudo UPTC que corresponde
 *  a cada tema (blanco sobre fondo oscuro, a color sobre fondo claro).
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

  function actualizarImagenes(tema) {
    document.querySelectorAll("img[data-dark][data-light]").forEach(function (img) {
      const nuevaSrc = tema === "light" ? img.getAttribute("data-light") : img.getAttribute("data-dark");
      if (nuevaSrc && img.getAttribute("src") !== nuevaSrc) {
        img.setAttribute("src", nuevaSrc);
      }
    });
  }

  function aplicarTema(tema) {
    document.documentElement.setAttribute("data-theme", tema);
    actualizarBoton(tema);
    actualizarImagenes(tema);
  }

  // Aplicar cuanto antes (el <html> ya existe aunque el <body> no se haya parseado).
  aplicarTema(temaGuardado() === "light" ? "light" : "dark");

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("theme-toggle");

    // Re-sincroniza el botón y las imágenes ahora que el <body> ya existe.
    aplicarTema(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

    if (!btn) return;
    btn.addEventListener("click", function () {
      const actual = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const siguiente = actual === "dark" ? "light" : "dark";
      guardarTema(siguiente);
      aplicarTema(siguiente);
    });
  });
})();
