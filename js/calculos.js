/**
 * ============================================================================
 *  MOTOR DE CÁLCULO
 * ============================================================================
 *  Funciones puras (sin tocar el DOM) que calculan los puntajes a partir
 *  del CONFIG (data.js) y del estado capturado en la interfaz.
 *  No es necesario modificar este archivo al agregar/quitar tipos o
 *  subtipos: todo se recorre dinámicamente desde CONFIG.
 * ============================================================================
 */

const Calc = (() => {

  /** Limita un valor entre un mínimo y un máximo. */
  function clamp(valor, min, max) {
    if (isNaN(valor)) return min;
    return Math.min(Math.max(valor, min), max);
  }

  /** Redondea a 2 decimales para evitar errores de coma flotante (0.1+0.2). */
  function round2(valor) {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  }

  /**
   * Calcula el puntaje de UN factor en modo "unico" (Título).
   * @param {object} factorConfig  - CONFIG.factores.titulo
   * @param {string|null} subtipoSeleccionadoId
   * @returns {{ total:number, detalleTipos: object }}
   */
  function calcularFactorUnico(factorConfig, subtipoSeleccionadoId) {
    let valor = 0;
    const detalleTipos = {};

    factorConfig.tipos.forEach(tipo => {
      let subtotalTipo = 0;
      tipo.subtipos.forEach(subtipo => {
        if (subtipo.id === subtipoSeleccionadoId) {
          subtotalTipo = subtipo.valor;
          valor = subtipo.valor;
        }
      });
      detalleTipos[tipo.id] = subtotalTipo;
    });

    return {
      total: clamp(round2(valor), 0, factorConfig.max),
      detalleTipos
    };
  }

  /**
   * Calcula el puntaje de UN factor en modo "cantidad"
   * (Experiencia / Productividad): cantidad × valorUnitario, sumado y
   * topado al máximo del factor.
   * @param {object} factorConfig
   * @param {object} cantidades - { [subtipoId]: cantidadNumerica }
   * @returns {{ total:number, totalSinTope:number, detalleTipos: object }}
   */
  function calcularFactorCantidad(factorConfig, cantidades) {
    let totalSinTope = 0;
    const detalleTipos = {};

    factorConfig.tipos.forEach(tipo => {
      let subtotalTipo = 0;
      tipo.subtipos.forEach(subtipo => {
        const cantidad = Number(cantidades[subtipo.id]) || 0;
        subtotalTipo += cantidad * subtipo.valorUnitario;
      });
      subtotalTipo = round2(subtotalTipo);
      detalleTipos[tipo.id] = subtotalTipo;
      totalSinTope += subtotalTipo;
    });

    totalSinTope = round2(totalSinTope);

    return {
      total: clamp(totalSinTope, 0, factorConfig.max),
      totalSinTope,
      detalleTipos
    };
  }

  /**
   * Despacha al cálculo correcto según el "modo" definido en CONFIG.
   */
  function calcularFactorDetallado(factorConfig, datosFactor) {
    if (factorConfig.modo === "unico") {
      return calcularFactorUnico(factorConfig, datosFactor.seleccion || null);
    }
    return calcularFactorCantidad(factorConfig, datosFactor.cantidades || {});
  }

  /**
   * Suma los 3 factores de Hoja de Vida (cada uno ya topado a su máximo).
   */
  function totalHojaDeVida(valoresPorFactor) {
    return round2(
      Object.values(valoresPorFactor).reduce((acc, v) => acc + (Number(v) || 0), 0)
    );
  }

  /**
   * Calcula el puntaje de la Prueba Académica en la vista Detallado
   * (suma de sus 3 componentes, cada uno topado a su propio máximo,
   * y el total topado al máximo global de la prueba).
   * @param {object} pruebaConfig - CONFIG.pruebaAcademica
   * @param {object} valoresComponentes - { [componenteId]: puntosNumericos }
   * @returns {{ total:number, detalleComponentes: object }}
   */
  function calcularPruebaAcademicaDetallada(pruebaConfig, valoresComponentes) {
    let totalSinTope = 0;
    const detalleComponentes = {};

    pruebaConfig.componentes.forEach(componente => {
      const valor = clamp(Number(valoresComponentes[componente.id]) || 0, 0, componente.max);
      detalleComponentes[componente.id] = round2(valor);
      totalSinTope += valor;
    });

    return {
      total: clamp(round2(totalSinTope), 0, pruebaConfig.max),
      detalleComponentes
    };
  }

  /**
   * Puntaje final del concurso = Hoja de Vida + Prueba Académica.
   */
  function puntajeFinal(totalHV, pruebaAcademica) {
    return round2((Number(totalHV) || 0) + (Number(pruebaAcademica) || 0));
  }

  return {
    clamp,
    round2,
    calcularFactorUnico,
    calcularFactorCantidad,
    calcularFactorDetallado,
    calcularPruebaAcademicaDetallada,
    totalHojaDeVida,
    puntajeFinal
  };
})();
