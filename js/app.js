// --- VARIABLES GLOBALES ---
// Control de ordenación (True = Ascendente, False = Descendente)
let ordenFechaAscendente = true;
let ordenIdAscendente = true;

// --- CLASE CITA ---
class Cita {
  constructor(
    id,
    fecha,
    hora,
    nombre,
    apellidos,
    dni,
    telefono,
    fechaNacimiento,
    observaciones,
    numero
  ) {
    this.id = id;
    this.fecha = fecha;
    this.hora = hora;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.dni = dni;
    this.telefono = telefono;
    this.fechaNacimiento = fechaNacimiento;
    this.observaciones = observaciones;
    this.numero = numero;
  }
}

// --- ALMACENAMIENTO (LOCALSTORAGE) ---

// Recuperar el array de citas o un array vacío si es la primera
function obtenerCitas() {
  const citas = localStorage.getItem("citasDavanteDent");
  return citas ? JSON.parse(citas) : [];
}

// Guardar el array actualizado
function guardarCitasEnStorage(citas) {
  localStorage.setItem("citasDavanteDent", JSON.stringify(citas));
}

// --- FUNCIONES DE VALIDACIÓN ---

function esDniValido(dni) {
  dni = dni.toUpperCase().trim().replace(/\s/g, "").replace(/-/g, "");
  const patron = /^([XYZ]\d{7,8}|\d{8})([A-Z])$/;
  const coincidencias = dni.match(patron);
  if (!coincidencias) return false;
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  let numeroStr = coincidencias[1]
    .replace("X", "0")
    .replace("Y", "1")
    .replace("Z", "2");
  return letras[parseInt(numeroStr, 10) % 23] === coincidencias[2];
}

function esTelefonoValido(telefono) {
  return /^[6789]\d{8}$/.test(telefono.replace(/\s/g, ""));
}

// --- CONTROLADOR DEL FORMULARIO (CREATE / UPDATE) ---

document
  .getElementById("formCitas")
  .addEventListener("submit", function (event) {
    // Detener el envío automático
    event.preventDefault();
    event.stopPropagation();

    const form = this; // El formulario
    const dniInput = document.getElementById("dni");
    const telInput = document.getElementById("telefono");
    const errorDniDiv = document.getElementById("errorDni");
    const errorTelDiv = document.getElementById("errorTelefono");

    // RESETEAR VALIDACIONES PERSONALIZADAS
    // Quitamos 'is-invalid' manuales para volver a comprobar
    dniInput.setCustomValidity("");
    telInput.setCustomValidity("");

    // VALIDACIÓN PERSONALIZADA: DNI
    if (dniInput.value.trim() !== "") {
      if (!esDniValido(dniInput.value)) {
        // Truco: setCustomValidity marca el campo como inválido para Bootstrap
        dniInput.setCustomValidity("DNI Incorrecto");
        errorDniDiv.textContent =
          "El formato o la letra del DNI/NIE no son correctos.";
      } else {
        dniInput.setCustomValidity(""); // Es válido
      }
    } else {
      errorDniDiv.textContent = "El DNI es obligatorio.";
    }

    // VALIDACIÓN PERSONALIZADA: TELÉFONO
    if (telInput.value.trim() !== "") {
      if (!esTelefonoValido(telInput.value)) {
        telInput.setCustomValidity("Teléfono Incorrecto");
        errorTelDiv.textContent =
          "Debe ser un móvil o fijo válido (9 dígitos).";
      } else {
        telInput.setCustomValidity("");
      }
    } else {
      errorTelDiv.textContent = "El teléfono es obligatorio.";
    }

    // COMPROBACIÓN FINAL DE BOOTSTRAP
    if (!form.checkValidity()) {
      // Si algo falla (required o nuestros customValidity), mostramos colores
      form.classList.add("was-validated");
      return; // PARAMOS AQUÍ
    }

    // --- SI LLEGAMOS AQUÍ, TODO ESTÁ OK ---

    // Guardado de datos (Tu lógica de siempre)
    guardarDatosCita();
  });

function guardarDatosCita() {
  const idCita = document.getElementById("idCita").value;
  const citas = obtenerCitas();
  let nuevoNumero;

  if (idCita) {
    const citaExistente = citas.find((c) => c.id == idCita);
    nuevoNumero = citaExistente ? citaExistente.numero : 1;
  } else {
    const maxNumero =
      citas.length > 0 ? Math.max(...citas.map((c) => c.numero || 0)) : 0;
    nuevoNumero = maxNumero + 1;
  }

  const nuevaCita = new Cita(
    idCita ? parseInt(idCita) : Date.now(),
    document.getElementById("fecha").value,
    document.getElementById("hora").value,
    document.getElementById("nombre").value.trim(),
    document.getElementById("apellidos").value.trim(),
    document.getElementById("dni").value.toUpperCase().trim(),
    document.getElementById("telefono").value.trim(),
    document.getElementById("fechaNacimiento").value,
    document.getElementById("observaciones").value.trim(),
    nuevoNumero
  );

  if (idCita) {
    const index = citas.findIndex((c) => c.id == idCita);
    if (index !== -1) citas[index] = nuevaCita;
  } else {
    citas.push(nuevaCita);
  }

  guardarCitasEnStorage(citas);
  renderizarTabla();
  limpiarFormulario(); // Importante llamar a la nueva versión de abajo
}

window.limpiarFormulario = function () {
  const form = document.getElementById("formCitas");

  // Resetear valores nativos
  form.reset();
  document.getElementById("idCita").value = "";

  // ELIMINAR ESTILOS DE VALIDACIÓN (Verde/Rojo)
  form.classList.remove("was-validated");

  // Restaurar botón y título
  const btnGuardar = document.getElementById("btnGuardar");
  btnGuardar.innerHTML = '<i class="bi bi-save me-2"></i>Guardar Cita';
  btnGuardar.classList.remove("btn-warning");
  btnGuardar.classList.add("btn-primary");

  document.querySelector(".card-header h5").innerHTML =
    '<i class="bi bi-plus-circle me-2"></i>Nueva Cita';
};

// --- GESTIÓN DE LA TABLA (VISTA) ---
function renderizarTabla(listaCitas = null) {
  // Si recibimos una lista (ej. ordenada), la usamos.
  // Si no (es null o un evento), leemos del LocalStorage.
  const citas = Array.isArray(listaCitas) ? listaCitas : obtenerCitas();

  const tbody = document.getElementById("tablaCuerpo");
  const contador = document.getElementById("contadorCitas");

  // Limpiamos la tabla
  tbody.innerHTML = "";

  // Actualizamos el contador total
  if (contador) contador.innerText = citas.length;

  // Si no hay datos
  if (citas.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5 text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    <em>No hay citas programadas (dato vacío)</em>
                </td>
            </tr>`;
    return;
  }

  // Generamos las filas
  citas.forEach((cita, index) => {
    const fila = document.createElement("tr");

    const numeroVisual = cita.numero || index + 1;

    fila.innerHTML = `
            <td class="fw-bold text-center text-muted">${numeroVisual}</td>
            <td>
                <div class="fw-bold">${cita.fecha}</div>
                <div class="small text-muted"><i class="bi bi-stopwatch"></i> ${
                  cita.hora
                }</div>
            </td>
            <td>
                <div class="fw-bold text-dark">${cita.nombre} ${
      cita.apellidos
    }</div>
                <div class="small text-muted"><i class="bi bi-person-badge"></i> ${
                  cita.dni
                }</div>
            </td>
            <td>
                <a href="tel:${
                  cita.telefono
                }" class="text-decoration-none text-secondary">
                    <i class="bi bi-telephone"></i> ${cita.telefono}
                </a>
            </td>
            <td class="col-observaciones" onclick="verObservaciones(${
              cita.id
            })" title="Click para ver completo">
                ${
                  cita.observaciones ||
                  '<span class="text-muted fst-italic">Sin observaciones</span>'
                }
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-primary me-1" onclick="cargarCita(${
                  cita.id
                })" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-secondary" onclick="eliminarCita(${
                  cita.id
                })" title="Borrar">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </td>
        `;
    tbody.appendChild(fila);
  });
}

// --- ACCIONES (EDITAR / BORRAR / MODAL) ---

window.cargarCita = function (id) {
  const citas = obtenerCitas();
  const cita = citas.find((c) => c.id == id);

  if (cita) {
    // Rellenar campos
    document.getElementById("idCita").value = cita.id;
    document.getElementById("fecha").value = cita.fecha;
    document.getElementById("hora").value = cita.hora;
    document.getElementById("nombre").value = cita.nombre;
    document.getElementById("apellidos").value = cita.apellidos;
    document.getElementById("dni").value = cita.dni;
    document.getElementById("telefono").value = cita.telefono;
    document.getElementById("fechaNacimiento").value = cita.fechaNacimiento;
    document.getElementById("observaciones").value = cita.observaciones;

    // Cambiar estado del botón a "Actualizar"
    const btn = document.getElementById("btnGuardar");
    btn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Actualizar Cita';

    // Hacer scroll suave hacia el formulario (para móviles)
    document.getElementById("formCitas").scrollIntoView({ behavior: "smooth" });
  }
};

window.eliminarCita = function (id) {
  if (
    confirm(
      "¿Estás seguro de que deseas eliminar esta cita de la base de datos?"
    )
  ) {
    let citas = obtenerCitas();
    // Filtramos para quedarnos con todas MENOS la que queremos borrar
    citas = citas.filter((c) => c.id != id);

    guardarCitasEnStorage(citas);
    renderizarTabla();

    // Si el usuario estaba editando justo la cita que borró, limpiamos
    const idEditando = document.getElementById("idCita").value;
    if (idEditando == id) {
      limpiarFormulario();
    }
  }
};

window.verObservaciones = function (id) {
  const citas = obtenerCitas();
  const cita = citas.find((c) => c.id == id);
  if (cita) {
    // Rellenamos el título con el nombre del paciente
    document.getElementById("modalTitulo").innerHTML = `
            <i class="bi bi-file-text me-2"></i><strong>${cita.nombre} ${cita.apellidos}</strong>
        `;
    // Rellenamos el cuerpo. Si está vacío, ponemos un mensaje por defecto.
    const texto = cita.observaciones
      ? cita.observaciones
      : "No hay observaciones registradas para este paciente.";
    document.getElementById("modalTexto").innerText = texto;
    // Abrimos el modal usando la API de Bootstrap 5
    const modalElement = document.getElementById("modalObservaciones");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
};

// --- ORDENACIÓN Y EXPORTACIÓN ---

window.ordenarPorFecha = function () {
  let citas = obtenerCitas();

  // Invertimos el estado ANTES de ordenar
  ordenFechaAscendente = !ordenFechaAscendente;

  citas.sort((a, b) => {
    const fechaA = new Date(a.fecha + "T" + a.hora);
    const fechaB = new Date(b.fecha + "T" + b.hora);
    // Usamos el nuevo estado para decidir el orden
    return ordenFechaAscendente ? fechaA - fechaB : fechaB - fechaA;
  });

  actualizarIconosOrden("fecha");
  renderizarTabla(citas);
};

window.ordenarPorId = function () {
  let citas = obtenerCitas();

  // Invertimos el estado ANTES de ordenar
  // Como empieza en true, el primer clic lo pone en false (Descendente)
  ordenIdAscendente = !ordenIdAscendente;

  citas.sort((a, b) => {
    const numA = a.numero || 0;
    const numB = b.numero || 0;
    return ordenIdAscendente ? numA - numB : numB - numA;
  });

  actualizarIconosOrden("id");
  renderizarTabla(citas);
};

function actualizarIconosOrden(tipo) {
  const iconoFecha = document.getElementById("iconoOrden");
  const iconoId = document.getElementById("iconoOrdenId");

  // Iconos de Bootstrap:
  // sort-down = Mayor arriba (Descendente visualmente en listas) o A-Z
  // sort-up = Menor arriba

  if (tipo === "fecha") {
    iconoFecha.className = ordenFechaAscendente
      ? "bi bi-sort-down text-primary"
      : "bi bi-sort-up text-primary";
    if (iconoId) iconoId.className = "bi bi-filter text-muted";
  } else {
    // Si ordenIdAscendente es true (1-9), mostramos numeric-down
    // Si es false (9-1), mostramos numeric-up-alt
    if (iconoId)
      iconoId.className = ordenIdAscendente
        ? "bi bi-sort-numeric-down text-primary"
        : "bi bi-sort-numeric-up-alt text-primary";
    iconoFecha.className = "bi bi-filter text-muted";
  }
}

window.exportarCitasCSV = function () {
  const citas = obtenerCitas();

  if (citas.length === 0) {
    alert("No hay citas para exportar.");
    return;
  }

  // Definir las cabeceras del archivo
  // Usamos punto y coma (;) como separador porque Excel en español lo prefiere a la coma
  let csvContent =
    "ID;Número;Fecha;Hora;Nombre;Apellidos;DNI;Teléfono;Nacimiento;Observaciones\n";

  // Recorrer las citas y convertir cada una a una línea de texto
  citas.forEach((cita) => {
    // Limpiamos los saltos de línea en observaciones para no romper el CSV
    const observacionesLimpias = cita.observaciones.replace(
      /(\r\n|\n|\r)/gm,
      " "
    );

    const fila = [
      cita.id,
      cita.numero || "-",
      cita.fecha,
      cita.hora,
      cita.nombre,
      cita.apellidos,
      cita.dni,
      cita.telefono,
      cita.fechaNacimiento,
      `"${observacionesLimpias}"`, // Comillas para proteger el texto
    ].join(";"); // Unimos con punto y coma

    csvContent += fila + "\n";
  });

  // Crear el archivo Blob
  // \uFEFF es el BOM (Byte Order Mark) para que Excel sepa que es UTF-8 (Tildes/Ñ)
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  // Generar enlace de descarga invisible
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  // Generamos nombre con fecha: citas_davante_2026-01-03.csv
  const fechaHoy = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `citas_davante_${fechaHoy}.csv`);

  // Simular clic y limpiar
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- INICIALIZACIÓN ---

document.addEventListener("DOMContentLoaded", () => {
  renderizarTabla();
  // Marcamos visualmente que está ordenado por ID al inicio
  const iconoId = document.getElementById("iconoOrdenId");
  if (iconoId) {
    iconoId.className = "bi bi-sort-numeric-down text-primary";
  }
});
