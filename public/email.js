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