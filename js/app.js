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

// Al cargar el DOM: Renderiza la tabla
document.addEventListener("DOMContentLoaded", renderizarTabla);
