# Simulador de Puntaje — Concurso Docente UPTC

Simulador web (HTML + CSS + JS puro, sin frameworks ni build) para calcular
el puntaje de un docente que concursa: **60 pts Hoja de Vida** (Título +
Experiencia + Productividad) **+ 40 pts Prueba Académica = 100 pts**.

## Cómo correrlo en VS Code

1. Abre la carpeta `simulador-uptc` en VS Code.
2. Instala la extensión **Live Server** (si no la tienes).
3. Clic derecho sobre `index.html` → **"Open with Live Server"**.
   (También funciona haciendo doble clic en `index.html` para abrirlo
   directo en el navegador, sin servidor.)
4. Desde la portada, botón **"Abrir Simulador"**.

## Estructura del proyecto

```
simulador-uptc/
├── index.html          Portada (según el diseño de referencia)
├── simulador.html       Pantalla del simulador (tabs Global / Detallado)
├── css/
│   └── style.css        Todo el estilo visual (tema oscuro + acento dorado)
├── js/
│   ├── data.js           ⭐ ÚNICO archivo que se edita para cambiar puntajes
│   ├── calculos.js        Motor de cálculo (funciones puras, no tocar)
│   ├── render.js          Construye el HTML a partir de data.js (no tocar)
│   └── app.js             Estado y eventos de la app (no tocar)
└── assets/
    └── crest.svg          Emblema institucional (estilizado)
```

## Cómo editar los puntajes (lo único que necesitas tocar)

Todo vive en **`js/data.js`**, en el objeto `CONFIG`. Ejemplo de un factor:

```js
experiencia: {
  nombre: "Experiencia",
  max: 22,                     // <- puntaje máximo del factor
  modo: "cantidad",            // "cantidad" (qty × valor) o "unico" (elegir 1)
  unidadCantidad: "años",
  tipos: [
    {
      id: "exp_docente",
      nombre: "Experiencia Docente",
      subtipos: [
        { id: "ed_pub_priv", nombre: "Universidad pública o privada", valorUnitario: 4 },
        // ...
      ]
    }
  ]
}
```

- **Cambiar un puntaje máximo de factor:** edita el campo `max`.
- **Cambiar el valor de un subtipo:** edita `valor` (modo "unico") o
  `valorUnitario` (modo "cantidad").
- **Agregar un subtipo nuevo:** copia una línea del arreglo `subtipos` y
  cambia `id` (único), `nombre` y el valor. Aparece automáticamente en
  la vista Detallado.
- **Agregar un tipo nuevo dentro de un factor:** copia un bloque `{ id, nombre, subtipos: [...] }`
  dentro del arreglo `tipos`.
- **Eliminar** cualquier tipo o subtipo: simplemente borra su bloque.
- **Agregar un factor nuevo por completo** (poco probable, pero posible):
  copia la estructura de `titulo`/`experiencia`/`productividad` dentro de
  `CONFIG.factores` con un nuevo `id`. Se renderiza solo.

No necesitas tocar `render.js`, `calculos.js` ni `app.js` — leen `data.js`
dinámicamente.

## Reglas del modelo (cómo calcula el sistema)

- **Título** (modo `"unico"`): se elige un solo subtipo (radio button).
  El puntaje del factor es el valor de ese subtipo (tope: 18).
- **Experiencia** y **Productividad** (modo `"cantidad"`): en cada subtipo
  se digita una **cantidad** (años, # de artículos, # de productos, etc.).
  El sistema calcula `cantidad × valorUnitario`, suma todos los subtipos
  del factor y **topa el resultado al máximo del factor** (22 y 20
  respectivamente) — si la suma real supera el máximo, se muestra el máximo.
- **Vista Global:** un control manual (slider + número) por factor, de 0
  al máximo del factor — independiente del detalle.
- **Vista Detallado:** el valor de cada factor se calcula automáticamente
  sumando sus subtipos; no se puede editar directamente, solo desde el
  detalle.
- El resumen superior (Hoja de Vida / Prueba Académica / Total) siempre
  usa la pestaña activa (Global o Detallado) para el valor de Hoja de Vida.
- **Prueba Académica** (0–40) es un campo único, visible siempre, y se
  suma igual sin importar la pestaña activa.
- Botón **"Reiniciar"** pone todos los valores en cero.

## Notas de diseño

El emblema en `assets/crest.svg` es una versión estilizada, no una copia
del escudo oficial — puedes reemplazarlo por el logo oficial de UPTC
(archivo `.svg` o `.png`) cambiando la ruta en `index.html` y
`simulador.html` (`<img class="topbar__crest" src="...">` y
`<img class="cover__crest" src="...">`).
