/**
 * ============================================================================
 *  CONFIGURACIÓN DEL MODELO DE PUNTAJE — CONCURSO DOCENTE UPTC
 * ============================================================================
 *  Este es el ÚNICO archivo que se debe tocar para:
 *    - Cambiar el puntaje máximo de un factor
 *    - Agregar / eliminar / renombrar un TIPO
 *    - Agregar / eliminar / renombrar un SUBTIPO y su valor
 *
 *  No es necesario tocar render.js, calculos.js ni app.js: toda la interfaz
 *  y los cálculos se generan automáticamente a partir de este objeto.
 *
 *  MODOS DE UN FACTOR (campo "modo"):
 *    "unico"    -> Se elige UN solo subtipo (ej. Título: Maestría o Doctorado).
 *                  El puntaje del factor = valor del subtipo elegido.
 *    "cantidad" -> Cada subtipo tiene un "valorUnitario". El evaluador digita
 *                  una CANTIDAD (años, # de artículos, # de productos, etc.)
 *                  y el sistema calcula cantidad × valorUnitario.
 *                  El puntaje del factor = suma de todos los subtipos,
 *                  topado (capado) al máximo del factor.
 * ============================================================================
 */

const CONFIG = {

  // Puntaje total del concurso
  puntajeTotal: 100,

  // -------------------------------------------------------------------------
  // PRUEBA ACADÉMICA (no tiene tipos/subtipos, es un valor único)
  // -------------------------------------------------------------------------
  pruebaAcademica: {
    nombre: "Prueba Académica",
    max: 40,
    // Componentes usados únicamente en la vista Detallado. La vista Global
    // sigue usando un solo campo (0 -> max) tal como antes.
    componentes: [
      {
        id: "conocimientos_especificos",
        nombre: "Prueba de conocimientos específicos",
        max: 20
      },
      {
        id: "nivel_academico_disertacion",
        nombre: "Prueba de nivel académico y aptitudes pedagógicas - Disertación oral",
        max: 15
      },
      {
        id: "clasificacion_ingles",
        nombre: "Prueba de clasificación en inglés, realizada por el Instituto Internacional de Idiomas",
        max: 5
      }
    ]
  },

  // -------------------------------------------------------------------------
  // HOJA DE VIDA -> 3 FACTORES
  // -------------------------------------------------------------------------
  factores: {

    // ============================ 1. TÍTULO ================================
    titulo: {
      nombre: "Título",
      max: 18,
      modo: "unico",
      tipos: [
        {
          id: "todos_programas",
          nombre: "Todos los Programas",
          subtipos: [
            { id: "maestria",       nombre: "Maestría",                              valor: 14 },
            { id: "doctorado",      nombre: "Doctorado",                             valor: 18 },
            { id: "esp_medico_qx",  nombre: "Especialización Médico Quirúrgica",     valor: 14 }
          ]
        }
      ]
    },

    // ========================== 2. EXPERIENCIA ==============================
    experiencia: {
      nombre: "Experiencia",
      max: 22,
      modo: "cantidad",
      unidadCantidad: "años",
      tipos: [
        {
          id: "exp_docente",
          nombre: "Experiencia Docente",
          subtipos: [
            { id: "ed_pub_priv",   nombre: "Universidad pública o privada",                          valorUnitario: 1 },
            { id: "ed_priv_multi", nombre: "Universidad privada con acreditación multicampus",        valorUnitario: 2 },
            { id: "ed_pub_multi",  nombre: "Universidad pública con acreditación multicampus",        valorUnitario: 4 }
          ]
        },
        {
          id: "act_academico_admin",
          nombre: "Actividades Académico-Administrativas",
          subtipos: [
            { id: "aa_pub_priv",   nombre: "Universidad pública o privada",                          valorUnitario: 0.2 },
            { id: "aa_priv_multi", nombre: "Universidad privada con acreditación multicampus",        valorUnitario: 0.4 },
            { id: "aa_pub_multi",  nombre: "Universidad pública con acreditación multicampus",        valorUnitario: 0.8 }
          ]
        }
      ]
    },

    // ========================== 3. PRODUCTIVIDAD =============================
    productividad: {
      nombre: "Productividad",
      max: 20,
      modo: "cantidad",
      unidadCantidad: "productos",
      tipos: [
        {
          id: "articulos_cientificos",
          nombre: "Artículos Científicos",
          subtipos: [
            { id: "art_q1a1", nombre: "Q1 / A1",              valorUnitario: 4 },
            { id: "art_q2a2", nombre: "Q2 / A2",              valorUnitario: 3 },
            { id: "art_q3b",  nombre: "Q3 / B",               valorUnitario: 2 },
            { id: "art_q4c",  nombre: "Q4 / C",               valorUnitario: 1 },
            { id: "art_no_indexada", nombre: "Revistas no indexadas", valorUnitario: 0.5 }
          ]
        },
        {
          id: "libros",
          nombre: "Libros",
          subtipos: [
            { id: "lib_libro",    nombre: "Libro",             valorUnitario: 4 },
            { id: "lib_capitulo", nombre: "Capítulo de libro",  valorUnitario: 2 }
          ]
        },
        {
          id: "premios",
          nombre: "Premios",
          subtipos: [
            { id: "premio_nacional",      nombre: "Nacional",      valorUnitario: 2 },
            { id: "premio_internacional", nombre: "Internacional", valorUnitario: 1 }
          ]
        },
        {
          id: "ponencias",
          nombre: "Ponencias",
          subtipos: [
            { id: "pon_nacional",      nombre: "Nacional",      valorUnitario: 0.5 },
            { id: "pon_internacional", nombre: "Internacional", valorUnitario: 1 }
          ]
        },
        {
          id: "prod_academica_salud",
          nombre: "Productividad Académica C. Salud",
          subtipos: [
            { id: "pas_internacional", nombre: "Internacional", valorUnitario: 5 },
            { id: "pas_nacional",      nombre: "Nacional",      valorUnitario: 4 },
            { id: "pas_local",         nombre: "Local",         valorUnitario: 3 }
          ]
        },
        {
          id: "produccion_tecnica",
          nombre: "Producción Técnica",
          subtipos: [
            { id: "pt_software", nombre: "Producción de Software", valorUnitario: 2 }
          ]
        },
        {
          id: "patente",
          nombre: "Patente",
          subtipos: [
            { id: "pat_patente", nombre: "Patente", valorUnitario: 6 }
          ]
        },
        {
          id: "pa_artes_obra",
          nombre: "P. A. Artes, Arquitectura, Diseño - Obra",
          subtipos: [
            { id: "obra_internacional", nombre: "Internacional", valorUnitario: 4 },
            { id: "obra_nacional",      nombre: "Nacional",      valorUnitario: 3 },
            { id: "obra_local",         nombre: "Local",         valorUnitario: 2 }
          ]
        },
        {
          id: "pa_artes_taller",
          nombre: "P. A. Artes, Arquitectura, Diseño - Taller",
          subtipos: [
            { id: "taller_internacional", nombre: "Internacional", valorUnitario: 4 },
            { id: "taller_nacional",      nombre: "Nacional",      valorUnitario: 3 },
            { id: "taller_local",         nombre: "Local",         valorUnitario: 2 }
          ]
        },
        {
          id: "prod_musical_interpretacion",
          nombre: "Productos Musicales - Interpretación",
          subtipos: [
            { id: "interp_internacional", nombre: "Internacional", valorUnitario: 3 },
            { id: "interp_nacional",      nombre: "Nacional",      valorUnitario: 2 },
            { id: "interp_local",         nombre: "Local",         valorUnitario: 1 }
          ]
        },
        {
          id: "prod_musical_composicion",
          nombre: "Productos Musicales - Composición",
          subtipos: [
            { id: "comp_internacional", nombre: "Internacional", valorUnitario: 3 },
            { id: "comp_nacional",      nombre: "Nacional",      valorUnitario: 2 },
            { id: "comp_local",         nombre: "Local",         valorUnitario: 1 }
          ]
        }
      ]
    }
  }
};

// Exponer en window para que el resto de scripts (cargados sin type="module")
// puedan usarlo directamente.
window.CONFIG = CONFIG;
