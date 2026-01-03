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

// --- VARIABLES GLOBALES ---
let ordenFechaAscendente = true; // Controla el sentido de la ordenación
let ordenIdAscendente = true; // Controla el orden por ID

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

// --- RENDER PARA LA TABLA DE CITAS ---

// --- LÓGICA DE VISUALIZACIÓN (RENDER) ---

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
                <div class="small text-muted"><i class="bi bi-stopwatch"></i> ${cita.hora}</div>
            </td>
            <td>
                <div class="fw-bold text-dark">${cita.nombre} ${cita.apellidos}</div>
                <div class="small text-muted"><i class="bi bi-person-badge"></i> ${cita.dni}</div>
            </td>
            <td>
                <a href="tel:${cita.telefono}" class="text-decoration-none text-secondary">
                    <i class="bi bi-telephone"></i> ${cita.telefono}
                </a>
            </td>
            <td><small class="text-truncate d-inline-block" style="max-width: 150px;">${cita.observaciones}</small></td>
            <td class="text-end">
                <button class="btn btn-sm btn-primary me-1" onclick="cargarCita(${cita.id})" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-secondary" onclick="eliminarCita(${cita.id})" title="Borrar">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </td>
        `;
    tbody.appendChild(fila);
  });
}

// --- UTILIDADES ---

function limpiarFormulario() {
  // Resetear inputs nativos
  document.getElementById("formCitas").reset();

  // Limpiar ID oculto (volvemos a modo creación)
  document.getElementById("idCita").value = "";

  // Restaurar estado visual del botón guardar (Color Davante Blue)
  const btn = document.getElementById("btnGuardar");
  btn.innerHTML = '<i class="bi bi-save me-2"></i>Guardar Cita';
  btn.classList.remove("btn-warning", "text-dark");
  btn.classList.add("btn-primary");

  // Ocultar alertas de error si las hubiera
  const errorDiv = document.getElementById("mensajeError");
  errorDiv.classList.add("d-none");
}

// --- CONTROLADOR DEL FORMULARIO (CREATE / UPDATE) ---

document.getElementById("formCitas").addEventListener("submit", function (e) {
  e.preventDefault(); // Evitamos que la página se recargue

  const idCita = document.getElementById("idCita").value;
  const telefono = document.getElementById("telefono").value;
  const errorDiv = document.getElementById("mensajeError");
  const textoError = document.getElementById("textoError");

  // VALIDACIÓN
  // Reiniciamos errores
  errorDiv.classList.add("d-none");

  // Expresión regular para validar teléfono a 9 números
  const telefonoRegex = /^[0-9]{9}$/;

  if (!telefonoRegex.test(telefono)) {
    textoError.innerText =
      "Error: El teléfono debe contener exactamente 9 números.";
    errorDiv.classList.remove("d-none");
    return; // Detenemos la función (no se guarda nada)
  }

  // RECOGIDA DE DATOS
  let citas = obtenerCitas(); // Leemos las citas ANTES de crear la nueva
  let nuevoNumero;

  if (idCita) {
    // Si editamos, mantenemos el número que ya tenía
    const citaExistente = citas.find((c) => c.id == idCita);
    nuevoNumero = citaExistente ? citaExistente.numero : 1;
  } else {
    // Si es nueva, calculamos el siguiente número (max + 1)
    // Si no hay citas, empezamos en 1
    const maxNumero =
      citas.length > 0 ? Math.max(...citas.map((c) => c.numero || 0)) : 0;
    nuevoNumero = maxNumero + 1;
  }

  const nuevaCita = new Cita(
    idCita ? parseInt(idCita) : Date.now(),
    document.getElementById("fecha").value,
    document.getElementById("hora").value,
    document.getElementById("nombre").value,
    document.getElementById("apellidos").value,
    document.getElementById("dni").value,
    telefono,
    document.getElementById("fechaNacimiento").value,
    document.getElementById("observaciones").value,
    nuevoNumero // <--- Pasamos el número calculado
  );

  // LÓGICA DE NEGOCIO (Insertar o Actualizar)
  if (idCita) {
    const index = citas.findIndex((c) => c.id == idCita);
    if (index !== -1) citas[index] = nuevaCita;
  } else {
    citas.push(nuevaCita);
  }

  // PERSISTENCIA Y REFRESCO
  guardarCitasEnStorage(citas); // Guardar en LocalStorage
  renderizarTabla(); // Repintar la tabla
  limpiarFormulario(); // Dejar el form listo para la siguiente
});

// --- ACCIONES DE TABLA (BORRAR / EDITAR) ---

// Función para cargar datos en el formulario para editar
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

// Función para eliminar
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

// --- ORDENACIÓN POR FECHA ---
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

// --- ORDENACIÓN POR ID ---
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

// --- ACTUALIZACIÓN DE ICONOS ---
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

// Al cargar el DOM: Renderiza la tabla
document.addEventListener("DOMContentLoaded", () => {
  renderizarTabla();
  // Marcamos visualmente que está ordenado por ID al inicio
  const iconoId = document.getElementById("iconoOrdenId");
  if (iconoId) {
    iconoId.className = "bi bi-sort-numeric-down text-primary";
  }
});
