/**
 * ============================================================================
 *  CONSTRUCCIÓN DE INTERFAZ (a partir de CONFIG)
 * ============================================================================
 *  Genera el HTML de las vistas "Global" y "Detallado" recorriendo CONFIG.
 *  Si agregas/quitas un factor, tipo o subtipo en data.js, aparece o
 *  desaparece aquí automáticamente — no hay nada que editar en este archivo.
 * ============================================================================
 */

const Render = (() => {

  function el(tag, opts = {}) {
    const node = document.createElement(tag);
    if (opts.className) node.className = opts.className;
    if (opts.text !== undefined) node.textContent = opts.text;
    if (opts.html !== undefined) node.innerHTML = opts.html;
    if (opts.attrs) {
      Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
    }
    return node;
  }

  // --------------------------------------------------------------------
  // VISTA GLOBAL: un slider + input numérico por factor (0 -> max)
  // --------------------------------------------------------------------
  function buildGlobalView(container, factoresConfig, onFactorChange) {
    container.innerHTML = "";

    Object.entries(factoresConfig).forEach(([factorId, factorConfig]) => {
      const card = el("div", { className: "card factor-card" });

      const header = el("div", { className: "factor-card__header" });
      header.appendChild(el("h3", { className: "factor-card__title", text: factorConfig.nombre }));
      header.appendChild(el("span", { className: "factor-card__max", text: `Máx. ${factorConfig.max} pts` }));
      card.appendChild(header);

      const controlRow = el("div", { className: "control-row" });

      const slider = el("input", {
        attrs: {
          type: "range", min: "0", max: String(factorConfig.max),
          step: "0.1", value: "0", id: `global-slider-${factorId}`
        }
      });
      const numberInput = el("input", {
        className: "number-input",
        attrs: {
          type: "number", min: "0", max: String(factorConfig.max),
          step: "0.1", value: "0", id: `global-number-${factorId}`
        }
      });

      const sync = (value) => {
        const v = Calc.clamp(parseFloat(value) || 0, 0, factorConfig.max);
        slider.value = v;
        numberInput.value = v;
        onFactorChange(factorId, v);
      };

      slider.addEventListener("input", (e) => sync(e.target.value));
      numberInput.addEventListener("input", (e) => sync(e.target.value));

      controlRow.appendChild(slider);
      controlRow.appendChild(numberInput);
      card.appendChild(controlRow);
      container.appendChild(card);
    });
  }

  // --------------------------------------------------------------------
  // VISTA DETALLADO: tipos y subtipos, con suma automática al factor
  // --------------------------------------------------------------------
  function buildDetalladoView(container, factoresConfig, onSubtipoChange) {
    container.innerHTML = "";

    Object.entries(factoresConfig).forEach(([factorId, factorConfig]) => {
      const card = el("div", { className: "card factor-card factor-card--detallado" });

      const header = el("div", { className: "factor-card__header" });
      header.appendChild(el("h3", { className: "factor-card__title", text: factorConfig.nombre }));
      const subtotalBadge = el("span", {
        className: "factor-card__max factor-card__subtotal",
        attrs: { id: `detallado-subtotal-${factorId}` },
        text: `0 / ${factorConfig.max} pts`
      });
      header.appendChild(subtotalBadge);
      card.appendChild(header);

      factorConfig.tipos.forEach(tipo => {
        const tipoBlock = el("div", { className: "tipo-block" });
        tipoBlock.appendChild(el("h4", { className: "tipo-block__title", text: tipo.nombre }));

        tipo.subtipos.forEach(subtipo => {
          const row = el("div", { className: "subtipo-row" });

          if (factorConfig.modo === "unico") {
            const radioId = `radio-${factorId}-${subtipo.id}`;
            const label = el("label", { className: "subtipo-row__radio-label", attrs: { for: radioId } });
            const radio = el("input", {
              attrs: {
                type: "radio", name: `unico-${factorId}`, id: radioId, value: subtipo.id
              }
            });
            radio.addEventListener("change", () => {
              onSubtipoChange(factorId, factorConfig, { seleccion: subtipo.id });
            });
            label.appendChild(radio);
            label.appendChild(el("span", { text: ` ${subtipo.nombre}` }));
            row.appendChild(label);
            row.appendChild(el("span", { className: "subtipo-row__valor", text: `${subtipo.valor} pts` }));
          } else {
            row.appendChild(el("span", { className: "subtipo-row__nombre", text: subtipo.nombre }));
            row.appendChild(el("span", {
              className: "subtipo-row__valor",
              text: `${subtipo.valorUnitario} pt(s) / ${factorConfig.unidadCantidad || "unidad"}`
            }));

            const qtyInput = el("input", {
              className: "number-input number-input--small",
              attrs: {
                type: "number", min: "0", step: "1", value: "0",
                id: `qty-${factorId}-${subtipo.id}`,
                "aria-label": `Cantidad para ${subtipo.nombre}`
              }
            });

            const puntosPreview = el("span", {
              className: "subtipo-row__puntos",
              attrs: { id: `puntos-${factorId}-${subtipo.id}` },
              text: "0 pts"
            });

            qtyInput.addEventListener("input", (e) => {
              const cantidad = Math.max(0, parseFloat(e.target.value) || 0);
              const puntos = Calc.round2(cantidad * subtipo.valorUnitario);
              puntosPreview.textContent = `${puntos} pts`;
              onSubtipoChange(factorId, factorConfig, { subtipoId: subtipo.id, cantidad });
            });

            row.appendChild(qtyInput);
            row.appendChild(puntosPreview);
          }

          tipoBlock.appendChild(row);
        });

        card.appendChild(tipoBlock);
      });

      container.appendChild(card);
    });
  }

  // --------------------------------------------------------------------
  // PRUEBA ACADÉMICA (vista Detallado): 3 componentes con su propio tope,
  // sumados y topados al máximo global de la prueba (40 pts).
  // --------------------------------------------------------------------
  function buildPruebaAcademicaDetallado(container, pruebaConfig, onComponenteChange) {
    container.innerHTML = "";

    const card = el("div", { className: "card factor-card factor-card--detallado" });

    const header = el("div", { className: "factor-card__header" });
    header.appendChild(el("h3", { className: "factor-card__title", text: pruebaConfig.nombre }));
    const subtotalBadge = el("span", {
      className: "factor-card__max factor-card__subtotal",
      attrs: { id: "prueba-detallado-subtotal" },
      text: `0 / ${pruebaConfig.max} pts`
    });
    header.appendChild(subtotalBadge);
    card.appendChild(header);

    const tipoBlock = el("div", { className: "tipo-block" });

    pruebaConfig.componentes.forEach(componente => {
      const row = el("div", { className: "subtipo-row" });
      row.appendChild(el("span", { className: "subtipo-row__nombre", text: componente.nombre }));
      row.appendChild(el("span", {
        className: "subtipo-row__valor",
        text: `Hasta ${componente.max} pts`
      }));

      const compInput = el("input", {
        className: "number-input number-input--small",
        attrs: {
          type: "number", min: "0", max: String(componente.max), step: "0.1", value: "0",
          id: `prueba-comp-${componente.id}`,
          "aria-label": componente.nombre
        }
      });

      compInput.addEventListener("input", (e) => {
        const valor = Calc.clamp(parseFloat(e.target.value) || 0, 0, componente.max);
        e.target.value = valor;
        onComponenteChange(componente.id, valor);
      });

      row.appendChild(compInput);
      tipoBlock.appendChild(row);
    });

    card.appendChild(tipoBlock);
    container.appendChild(card);
  }

  function setPruebaAcademicaDetalladoSubtotal(total, max) {
    const badge = document.getElementById("prueba-detallado-subtotal");
    if (badge) badge.textContent = `${total} / ${max} pts`;
  }

  function setGlobalFactorValue(factorId, value, max) {
    const slider = document.getElementById(`global-slider-${factorId}`);
    const number = document.getElementById(`global-number-${factorId}`);
    if (slider) slider.value = Calc.clamp(value, 0, max);
    if (number) number.value = Calc.clamp(value, 0, max);
  }

  function setDetalladoSubtotal(factorId, total, max) {
    const badge = document.getElementById(`detallado-subtotal-${factorId}`);
    if (badge) badge.textContent = `${total} / ${max} pts`;
  }

  return {
    buildGlobalView,
    buildDetalladoView,
    buildPruebaAcademicaDetallado,
    setGlobalFactorValue,
    setDetalladoSubtotal,
    setPruebaAcademicaDetalladoSubtotal
  };
})();
