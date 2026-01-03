# 🦷 Gestión de Citas - DavanteDent

¡Hola! 👋 Este es mi proyecto para el **Trabajo de Enfoque** del módulo de **Desarrollo Web en Entorno Cliente**.

Aplicación web progresiva SPA (Single Page Application) diseñada para la gestión de citas dentales sin dependencia de backend.

![Estado](https://img.shields.io/badge/Estado-Completado-success?style=flat-square)
![Stack](https://img.shields.io/badge/Tech-HTML5_|_Bootstrap_5_|_JS_ES6-blue?style=flat-square)
![Licencia](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

## 🚀 ¿Qué hace la aplicación?

### 📋 Gestión de Datos (CRUD)

- **Creación:** Formulario optimizado para alta rápida de pacientes.
- **Persistencia:** Almacenamiento local mediante `localStorage` (los datos no se pierden al recargar).
- **Edición y Borrado:** Modificación de expedientes y eliminación con confirmación de seguridad.
- **Exportación:** Generación de informes en formato **CSV compatible con Excel** (incluye soporte para caracteres especiales/tildes).

### 🛡️ Validación Avanzada

Implementación híbrida usando la API de validación de Bootstrap 5 y lógica personalizada en JavaScript:

- **DNI/NIE:** Validación matemática real mediante algoritmo del **Módulo 23** (no solo comprueba formato, sino que la letra sea correcta).
- **Teléfono:** Validación mediante **RegEx** para formato español (9 dígitos comenzando por 6, 7, 8 o 9).
- **Feedback Visual:** Indicadores de estado (verde/rojo) y mensajes de error contextuales en tiempo real.

### 🎨 UI/UX y Diseño Corporativo

- **Identidad DavanteDent:** Paleta de colores personalizada (Azul `#0033a0` y Naranja `#ff6600`) integrada mediante variables CSS.
- **Tabla Responsive:** Diseño fluido con scroll horizontal automático en móviles y celdas que no rompen el texto (`white-space: nowrap`).
- **Ordenación Bidireccional:**
  - Por **Fecha/Hora** (Cronológico).
  - Por **Orden de Registro (#)** (Histórico).
- **Modal de Observaciones:** Visualización cómoda de textos largos sin deformar la tabla.
- **Favicon Adaptativo:** Icono SVG optimizado (Squircle) para alta visibilidad en modo claro y oscuro.

## 🛠️ Stack Tecnológico

- **HTML5:** Estructura semántica.
- **CSS3:** Variables CSS (`:root`), Flexbox y personalización de componentes.
- **Bootstrap 5.3:** Sistema de rejilla, componentes (Modales, Cartas) y clases de utilidad.
- **JavaScript (Vanilla):**
  - Manipulación del DOM.
  - Lógica de validación (`checkValidity`, `setCustomValidity`).
  - Algoritmos de ordenación (`Array.sort`).
  - Manejo de `localStorage`.
- **Bootstrap Icons:** Iconografía vectorial SVG.

## 📂 Estructura del Proyecto

```text
davante-dent/
├── css/
│   └── styles.css      # Variables corporativas y sobreescritura de Bootstrap
├── img/
│   └── favicon.svg     # Logo vectorial
├── js/
│   └── app.js          # Controlador principal: lógica, validación y eventos
├── index.html          # Vista principal de la aplicación
└── README.md           # Documentación del proyecto
```
