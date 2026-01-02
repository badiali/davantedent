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
