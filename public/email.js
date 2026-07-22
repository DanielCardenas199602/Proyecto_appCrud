const envioBTN = document.getElementById('envio');
const form = document.getElementById('formCorreo');

const BASE_URL = window.API_URL;

envioBTN.addEventListener('click', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  // 🔒 Desactivar el botón y mostrar "Enviando..."
  envioBTN.disabled = true;
  envioBTN.textContent = "Enviando...";

  try {
    // ⚠️ Usa el puerto correcto del backend (3900)
    const response = await fetch(`${BASE_URL}/Ruta-EnviarCorreo/enviarCorreo`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    console.log("Respuesta completa:", JSON.stringify(data));
    alert(data.mensaje);

    if (data.vista) {
      const link = document.createElement("a");
      link.href = data.vista;
      link.textContent = "Ver correo en Ethereal";
      window.open(data.vista, "_blank");
      document.body.appendChild(link);
    }

    form.reset();
    fileList.innerHTML = '';
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error al enviar el correo");
  } finally {
    // ✅ Reactivar el botón y restaurar texto
    envioBTN.disabled = false;
    envioBTN.textContent = "Enviar Archivos";
  }
});

// cargar registros del modal 

async function cargarRegistros() {

  try {

    const res = await fetch(`${BASE_URL}/Ruta-Proyecto/registros`);
    const registros = await res.json();

    const tabla = document.getElementById("tabla-registros");

    if (registros.length === 0) {
      tabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay registros aún</td></tr>`;
      return;
    }

    tabla.innerHTML = registros.map((r, index) => `
      <tr>
        <td data-label="#">${index + 1}</td>
        <td data-label="Nombre">${r.nombre}</td>
        <td data-label="Correo">${r.correo}</td>
        <td data-label="Archivos">${r.archivos.map(a => a.nombre).join(", ")}</td>
        <td data-label="Fecha">${new Date(r.fecha).toLocaleString()}</td>
        <td data-label="Eliminar">
          <button class="btn btn-sm btn-danger btn-eliminar-registro" data-id="${r._id}">✕</button>
        </td>
      </tr>
    `).join("");

    // Agregar eventos a los botones de eliminar individuales
    document.querySelectorAll(".btn-eliminar-registro").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("¿Eliminar este registro?")) {
          await fetch(`${BASE_URL}/Ruta-Proyecto/registros/${id}`, { method: "DELETE" });
          cargarRegistros();
        }
      });
    });





  } catch (error) {
    console.error("Error al cargar registros:", error);

  }

}

// Botón eliminar todos
document.getElementById("btn-eliminar-todos")?.addEventListener("click", async () => {
  if (confirm("¿Eliminar TODOS los registros? Esta acción no se puede deshacer.")) {
    try {
      await fetch(`${BASE_URL}/Ruta-Proyecto/registros`, { method: "DELETE" });
      cargarRegistros();
    } catch (error) {
      console.error("Error al eliminar todos:", error);
    }
  }
});


// Cargar registros cuando se abre el modal
document.getElementById("exampleModal")?.addEventListener("show.bs.modal", cargarRegistros);
