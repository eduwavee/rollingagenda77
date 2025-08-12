let tareas = [];
let editandoId = null;

const taskForm = document.getElementById("taskForm");
const inputTarea = document.getElementById("inputTarea");
const selectEstado = document.getElementById("selectEstado");
const tablaBodyTareas = document.getElementById("tablaBodyTareas");
const mensajeListaVacia = document.getElementById("mensajeListaVacia");
const formTitle = document.getElementById("formTitle");
const btnGuardar = document.getElementById("btnGuardar");

document.addEventListener("DOMContentLoaded", () => {
  cargarTareas();
  mostrarTareas();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (editandoId) {
    editarTarea();
  } else {
    crearTarea();
  }
});

tablaBodyTareas.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-editar")) {
    const id = parseInt(e.target.dataset.id);
    cargarFormulario(id);
  }

  if (e.target.classList.contains("btn-borrar")) {
    const id = parseInt(e.target.dataset.id);
    borrarTarea(id);
  }
});

function cargarTareas() {
  tareas = JSON.parse(localStorage.getItem("tareas")) || [];
}

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function mostrarTareas() {
  tablaBodyTareas.innerHTML = "";

  if (tareas.length === 0) {
    mensajeListaVacia.classList.remove("d-none");
    return;
  } else {
    mensajeListaVacia.classList.add("d-none");
  }

  tareas.forEach((tarea, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${tarea.texto}</td>
            <td>${tarea.estado}</td>
            <td>${tarea.fechaCreacion}</td>
            <td>${tarea.fechaModificacion}</td>
            <td>
                <button class="btn btn-warning btn-sm btn-editar" data-id="${
                  tarea.id
                }">Editar</button>
                <button class="btn btn-danger btn-sm btn-borrar" data-id="${
                  tarea.id
                }">Borrar</button>
            </td>
        `;
    tablaBodyTareas.appendChild(fila);
  });
}

function crearTarea() {
  const nuevaTarea = {
    id: Date.now(),
    texto: inputTarea.value,
    estado: selectEstado.value,
    fechaCreacion: new Date().toLocaleString(),
    fechaModificacion: new Date().toLocaleString(),
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  mostrarTareas();
  taskForm.reset();
}

function borrarTarea(id) {
  tareas = tareas.filter((tarea) => tarea.id !== id);
  guardarTareas();
  mostrarTareas();
}

function cargarFormulario(id) {
  const tareaAEditar = tareas.find((tarea) => tarea.id === id);

  inputTarea.value = tareaAEditar.texto;
  selectEstado.value = tareaAEditar.estado;

  editandoId = id;
  formTitle.textContent = "Editar Tarea";
  btnGuardar.textContent = "Guardar Cambios";
}

function editarTarea() {
  const tareaIndex = tareas.findIndex((tarea) => tarea.id === editandoId);

  tareas[tareaIndex].texto = inputTarea.value;
  tareas[tareaIndex].estado = selectEstado.value;
  tareas[tareaIndex].fechaModificacion = new Date().toLocaleString();

  guardarTareas();
  mostrarTareas();

  editandoId = null;
  formTitle.textContent = "Agregar Nueva Tarea";
  btnGuardar.textContent = "Guardar Tarea";
  taskForm.reset();

  Swal.fire({
    icon: "success",
    title: "¡Tarea modificada!",
    text: "La tarea se ha actualizado correctamente.",
    showConfirmButton: false,
    timer: 1500,
  });
}
