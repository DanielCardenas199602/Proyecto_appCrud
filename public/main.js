document.addEventListener("DOMContentLoaded", () => {

  const BASE_URL = window.API_URL;

  const btnAgregar = document.querySelector("#BTN_agregar");// se llama a los botones por su id para agregar funcionalidad a cada uno de ellos
  const btnConsultar = document.querySelector("#BTN_consultar");
  const btnActualizar = document.querySelector("#BTN_actualizar");
  const btnEliminar = document.querySelector("#BTN_eliminar");


// Función para obtener los datos del formulario
  function getFormData() {
    return {
      nombre: document.getElementById("nombre")?.value.trim() || "",
      // Normalizamos correo a minúsculas antes de enviarlo
      correo: document.getElementById("email")?.value.trim().toLowerCase() || "",
      comentarios: document.getElementById("comentarios")?.value.trim() || ""
    };
  }

  //agregar 

  btnAgregar.addEventListener("click", async () => { // se hace el evento click para el boton agregar y se hace una función asincrona para manejar la petición al backend
    const { nombre, correo, comentarios } = getFormData();

    // Validación básica en frontend
    if (!nombre || !correo) {
      alert("Nombre y correo son obligatorios");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/Ruta-Proyecto/crear`, {//se hace la petición al backend para crear un nuevo registro, se envían los datos en formato JSON
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, comentarios })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.mensaje); // éxito desde backend
      } else {

        if (res.status === 400 && data.mensaje === "El correo ya está registrado") {
          alert("Usuario ya registrado"); // alerta específica para duplicados
        } else {
          alert(data.mensaje || "Error al crear registro");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor"); // error de red
    }
  });



// Consultar por nombre

btnConsultar.addEventListener("click", async () => {
  const nombre = document.getElementById("nombre")?.value.trim();

  if (!nombre) {
    alert("⚠️Por favor ingresa un nombre para consultar");
    return;   
  }

  try {
    const res = await fetch(`${BASE_URL}/Ruta-Proyecto/consultarPorNombre/${encodeURIComponent(nombre)}`); // se hace la petición al backend para consultar por nombre, se envía el nombre como parte de la URL
    const data = await res.json();

    if (res.ok) {
      // 👇 Llenamos directamente los campos del formulario
      document.getElementById("nombre").value = data.nombre || "";//se hace que el campo nombre se llene con el valor obtenido del backend, si no hay valor
      document.getElementById("email").value = data.correo || "";
      document.getElementById("comentarios").value = data.comentarios || "";
    } else if (res.status === 404) {
      alert("No se encontró registro con ese nombre");
      // Opcional: limpiar campos si no se encuentra
      document.getElementById("email").value = "";
      document.getElementById("comentarios").value = "";
    } else {
      alert(`${data.mensaje || "Error al consultar por nombre"}`);
    }
  } catch (error) {
    console.error(error);
    alert("Error de conexión con el servidor");
  }
});





// Actualizar solo el correo por nombre
btnActualizar.addEventListener("click", async () => {
  const nombre = document.getElementById("nombre")?.value.trim();
  const correo = document.getElementById("email")?.value.trim().toLowerCase();

  if (!nombre || !correo) {
    alert("⚠️ Nombre y correo son obligatorios para actualizar");
    return;
  }

  try {

  const res = await fetch(`${BASE_URL}/Ruta-Proyecto/actualizarPorNombre/${encodeURIComponent(nombre)}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ correo })

    });

    const data = await res.json();

    if (res.ok) {
      alert(`✅ ${data.mensaje}`);
    } else if (res.status === 404) {
      alert("⚠️ No se encontró un usuario con ese nombre");
    } else if (res.status === 400) {
      alert(`⚠️ ${data.mensaje || "Correo inválido o duplicado"}`);
    } else {
      alert(`❌ ${data.mensaje || "Error al actualizar usuario"}`);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Error de conexión con el servidor");
  }
});






// Eliminar por nombre
btnEliminar.addEventListener("click", async () => {
  const nombre = document.getElementById("nombre")?.value.trim();

  if (!nombre) {
    alert("⚠️ Por favor ingresa un nombre para eliminar");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/Ruta-Proyecto/eliminarPorNombre/${encodeURIComponent(nombre)}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (res.ok) {
      alert(`✅ ${data.mensaje}`);
      // Opcional: limpiar campos del formulario después de eliminar
      document.getElementById("nombre").value = "";
      document.getElementById("email").value = "";
      document.getElementById("comentarios").value = "";
    } else if (res.status === 404) {
      alert("⚠️ No se encontró un usuario con ese nombre");
    } else {
      alert(`❌ ${data.mensaje || "Error al eliminar usuario"}`);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Error de conexión con el servidor");
  }
});



});


/**
 * localhost:3900/index.html s
 *  
 * se accede a la carpeta public y se abre el archivo index.html en el navegador, este archivo contiene un formulario con campos para nombre, correo y comentarios, así como dos botones: "Agregar" y "Consultar por Nombre".
 * 
 */
