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
    observaciones
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

// --- RENDER PARA LA TABLA DE CITAS ---

function renderizarTabla() {
  const citas = obtenerCitas();
  const tbody = document.getElementById("tablaCuerpo");
  const contador = document.getElementById("contadorCitas");

  // Limpiamos la tabla antes de repintar
  tbody.innerHTML = "";

  // Actualizamos el badge contador
  contador.innerText = citas.length;

  // Si no hay datos, mostramos mensaje
  if (citas.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5 text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    <em>No hay citas programadas (dato vacío)</em>
                </td>
            </tr>`;
    return;
  }

  // Si hay datos, generamos las filas
  citas.forEach((cita) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
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
                <button class="btn btn-sm btn-outline-primary me-1" onclick="cargarCita(${cita.id})" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarCita(${cita.id})" title="Borrar">
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
  const nuevaCita = new Cita(
    idCita ? parseInt(idCita) : Date.now(), // Si editamos mantenemos ID, si no, generamos timestamp
    document.getElementById("fecha").value,
    document.getElementById("hora").value,
    document.getElementById("nombre").value,
    document.getElementById("apellidos").value,
    document.getElementById("dni").value,
    telefono,
    document.getElementById("fechaNacimiento").value,
    document.getElementById("observaciones").value
  );

  // LÓGICA DE NEGOCIO (Insertar o Actualizar)
  let citas = obtenerCitas();

  if (idCita) {
    // MODO EDICIÓN: Buscamos la posición y sobrescribimos
    const index = citas.findIndex((c) => c.id == idCita);
    if (index !== -1) {
      citas[index] = nuevaCita;
    }
  } else {
    // MODO CREACIÓN: Añadimos al final
    citas.push(nuevaCita);
  }

  // PERSISTENCIA Y REFRESCO
  guardarCitasEnStorage(citas); // Guardar en LocalStorage
  renderizarTabla(); // Repintar la tabla
  limpiarFormulario(); // Dejar el form listo para la siguiente
});

// Al cargar el DOM: Renderiza la tabla
document.addEventListener("DOMContentLoaded", renderizarTabla);
