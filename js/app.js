/**
 * ============================================================================
 *  LÓGICA DE LA APLICACIÓN (estado + orquestación de la interfaz)
 * ============================================================================
 */

const App = (() => {

  const state = {
    activeTab: "global",       // "global" | "detallado" (solo afecta Título/Experiencia/Productividad)
    pruebaAcademicaModo: "simple",     // "simple" | "detallado" -> cuál de los dos controles manda en el total
    pruebaAcademicaGlobal: 0,          // campo único 0 -> max
    pruebaAcademicaComponentes: {},    // desglose: { [componenteId]: puntos }
    pruebaAcademicaDetalladoTotal: 0,  // suma del desglose, topada al máximo
    global: {},                // { [factorId]: valorNumerico }
    detalladoDatos: {},        // { [factorId]: { seleccion } | { cantidades: {} } }
    detalladoTotales: {}       // { [factorId]: totalCalculado }
  };

  function initState() {
    Object.entries(CONFIG.factores).forEach(([factorId, factorConfig]) => {
      state.global[factorId] = 0;
      state.detalladoTotales[factorId] = 0;
      state.detalladoDatos[factorId] = factorConfig.modo === "unico"
        ? { seleccion: null }
        : { cantidades: {} };
    });

    state.pruebaAcademicaModo = "simple";
    state.pruebaAcademicaGlobal = 0;
    state.pruebaAcademicaDetalladoTotal = 0;
    state.pruebaAcademicaComponentes = {};
    CONFIG.pruebaAcademica.componentes.forEach(componente => {
      state.pruebaAcademicaComponentes[componente.id] = 0;
    });
  }

  /** Puntaje de la Prueba Académica: manda el control que se haya editado de último. */
  function pruebaAcademicaActiva() {
    return state.pruebaAcademicaModo === "simple"
      ? state.pruebaAcademicaGlobal
      : state.pruebaAcademicaDetalladoTotal;
  }

  // ------------------------------------------------------------------
  // Callbacks que recibe Render.js cuando el usuario cambia un valor
  // ------------------------------------------------------------------
  function onGlobalFactorChange(factorId, value) {
    state.global[factorId] = value;
    actualizarTotales();
  }

  function onDetalladoSubtipoChange(factorId, factorConfig, payload) {
    const datosFactor = state.detalladoDatos[factorId];

    if (factorConfig.modo === "unico") {
      datosFactor.seleccion = payload.seleccion;
    } else {
      datosFactor.cantidades[payload.subtipoId] = payload.cantidad;
    }

    const resultado = Calc.calcularFactorDetallado(factorConfig, datosFactor);
    state.detalladoTotales[factorId] = resultado.total;
    Render.setDetalladoSubtotal(factorId, resultado.total, factorConfig.max);
    actualizarTotales();
  }

  function onPruebaAcademicaGlobalChange(value) {
    state.pruebaAcademicaModo = "simple";
    state.pruebaAcademicaGlobal = Calc.clamp(parseFloat(value) || 0, 0, CONFIG.pruebaAcademica.max);
    syncPruebaAcademicaInputs();
    actualizarTotales();
  }

  function onPruebaAcademicaComponenteChange(componenteId, valor) {
    state.pruebaAcademicaModo = "detallado";
    state.pruebaAcademicaComponentes[componenteId] = valor;

    const resultado = Calc.calcularPruebaAcademicaDetallada(CONFIG.pruebaAcademica, state.pruebaAcademicaComponentes);
    state.pruebaAcademicaDetalladoTotal = resultado.total;
    Render.setPruebaAcademicaDetalladoSubtotal(resultado.total, CONFIG.pruebaAcademica.max);
    actualizarTotales();
  }

  // ------------------------------------------------------------------
  // Totales y pintado de la pantalla resumen
  // ------------------------------------------------------------------
  function actualizarTotales() {
    const valoresFactorActivos = state.activeTab === "global"
      ? state.global
      : state.detalladoTotales;

    const pruebaActiva = pruebaAcademicaActiva();
    const totalHV = Calc.totalHojaDeVida(valoresFactorActivos);
    const totalFinal = Calc.puntajeFinal(totalHV, pruebaActiva);
    const maxHV = Object.values(CONFIG.factores).reduce((acc, f) => acc + f.max, 0);

    document.getElementById("resumen-hv").textContent = `${totalHV} / ${maxHV}`;
    document.getElementById("resumen-prueba").textContent = `${pruebaActiva} / ${CONFIG.pruebaAcademica.max}`;
    document.getElementById("resumen-total").textContent = `${totalFinal} / ${CONFIG.puntajeTotal}`;

    const pct = Calc.clamp((totalFinal / CONFIG.puntajeTotal) * 100, 0, 100);
    document.getElementById("resumen-barra").style.width = `${pct}%`;
  }

  function syncPruebaAcademicaInputs() {
    document.getElementById("prueba-slider").value = state.pruebaAcademicaGlobal;
    document.getElementById("prueba-number").value = state.pruebaAcademicaGlobal;
  }

  // ------------------------------------------------------------------
  // Tabs (Global / Detallado)
  // ------------------------------------------------------------------
  function setActiveTab(tab) {
    state.activeTab = tab;

    document.getElementById("tab-btn-global").classList.toggle("is-active", tab === "global");
    document.getElementById("tab-btn-detallado").classList.toggle("is-active", tab === "detallado");
    document.getElementById("vista-global").classList.toggle("is-hidden", tab !== "global");
    document.getElementById("vista-detallado").classList.toggle("is-hidden", tab !== "detallado");

    actualizarTotales();
  }

  // ------------------------------------------------------------------
  // Reiniciar simulación
  // ------------------------------------------------------------------
  function reiniciar() {
    initState();
    Render.buildGlobalView(document.getElementById("vista-global"), CONFIG.factores, onGlobalFactorChange);
    Render.buildDetalladoView(document.getElementById("vista-detallado"), CONFIG.factores, onDetalladoSubtipoChange);
    Render.buildPruebaAcademicaDetallado(document.getElementById("prueba-academica-detallado"), CONFIG.pruebaAcademica, onPruebaAcademicaComponenteChange);
    onPruebaAcademicaGlobalChange(0);
    actualizarTotales();
  }

  // ------------------------------------------------------------------
  // Arranque
  // ------------------------------------------------------------------
  function init() {
    initState();

    // Construir las dos vistas a partir de CONFIG
    Render.buildGlobalView(document.getElementById("vista-global"), CONFIG.factores, onGlobalFactorChange);
    Render.buildDetalladoView(document.getElementById("vista-detallado"), CONFIG.factores, onDetalladoSubtipoChange);
    Render.buildPruebaAcademicaDetallado(document.getElementById("prueba-academica-detallado"), CONFIG.pruebaAcademica, onPruebaAcademicaComponenteChange);

    // Prueba académica — vista Global (campo único)
    document.getElementById("prueba-slider").max = CONFIG.pruebaAcademica.max;
    document.getElementById("prueba-number").max = CONFIG.pruebaAcademica.max;
    document.getElementById("prueba-slider").addEventListener("input", (e) => onPruebaAcademicaGlobalChange(e.target.value));
    document.getElementById("prueba-number").addEventListener("input", (e) => onPruebaAcademicaGlobalChange(e.target.value));

    // Tabs
    document.getElementById("tab-btn-global").addEventListener("click", () => setActiveTab("global"));
    document.getElementById("tab-btn-detallado").addEventListener("click", () => setActiveTab("detallado"));

    // Reiniciar
    document.getElementById("btn-reiniciar").addEventListener("click", reiniciar);

    actualizarTotales();
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
