const MAX_FILES = 25;

// Referencias a elementos del DOM
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');

// Función para actualizar la lista visible de archivos seleccionados
function actualizarLista(archivos) {
    fileList.innerHTML = '';
    if (!archivos || archivos.length === 0) return;

    archivos.forEach((file) => {
        const li = document.createElement('li');

        // Ícono según tipo de archivo
        const icon = document.createElement('span');
        icon.style.marginRight = '8px';
        if (/\.pdf$/i.test(file.name)) {
            icon.textContent = '📄'; // PDF
        } else if (/\.xml$/i.test(file.name)) {
            icon.textContent = '🗂️'; // XML
        }

        const text = document.createElement('span');
        text.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;

        // Botón eliminar
        const btn = document.createElement('button');
        btn.textContent = '❌';
        btn.style.marginLeft = '10px';
        btn.addEventListener('click', () => {
            eliminarArchivo(file);
        });

        li.appendChild(icon);
        li.appendChild(text);
        li.appendChild(btn);
        fileList.appendChild(li);
    });
}

function eliminarArchivo(file) {
    const archivos = Array.from(fileInput.files);
    const filtrados = archivos.filter(f => !(f.name === file.name && f.size === file.size));

    const dt = new DataTransfer();
    filtrados.forEach(f => dt.items.add(f));

    fileInput.files = dt.files;
    actualizarLista(filtrados);
}

// Array global para mantener todos los archivos seleccionados
let archivosSeleccionados = [];

function manejarArchivoSeleccionado(event) {
    const nuevos = Array.from(event.target.files);

    // Filtrar solo PDF y XML
    const filtrados = nuevos.filter(f => /\.pdf$|\.xml$/i.test(f.name));
    if (filtrados.length === 0) {
        alert('Solo se permiten archivos PDF o XML.');
        return;
    }

    // Combinar con los que ya estaban en nuestro arreglo
    archivosSeleccionados = [...archivosSeleccionados, ...filtrados];

    // Eliminar duplicados por nombre+size
    const unicos = [];
    archivosSeleccionados.forEach(f => {
        const key = `${f.name}_${f.size}`;
        if (!unicos.some(x => `${x.name}_${x.size}` === key)) {
            unicos.push(f);
        }
    });

    // Limitar al máximo permitido
    if (unicos.length > MAX_FILES) {
        alert(`Máximo ${MAX_FILES} archivos. Se tomarán los primeros ${MAX_FILES}.`);
    }
    archivosSeleccionados = unicos.slice(0, MAX_FILES);

    // Actualizar el input con DataTransfer
    const dt = new DataTransfer();
    archivosSeleccionados.forEach(f => dt.items.add(f));
    fileInput.files = dt.files;

    // Mostrar en la lista
    actualizarLista(archivosSeleccionados);
}

fileInput.addEventListener('change', manejarArchivoSeleccionado);

// Eventos visuales en el área de arrastre (drop zone)
['dragenter', 'dragover'].forEach(evt => {
    dropZone.addEventListener(evt, (event) => {
        event.preventDefault();
        dropZone.classList.add('dragover');
    });
});

['dragleave', 'drop'].forEach(evt => {
    dropZone.addEventListener(evt, (event) => {
        event.preventDefault();
        dropZone.classList.remove('dragover');
    });
});

// Manejo del evento drop
dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    const archivosDrop = Array.from(event.dataTransfer.files);

    const filtradosDrop = archivosDrop.filter(f => /\.pdf$|\.xml$/i.test(f.name));
    if (filtradosDrop.length === 0) {
        alert('Solo se permiten archivos PDF o XML.');
        return;
    }

    const existentes = Array.from(fileInput.files || []);// Archivos ya seleccionados
    const combinados = [...existentes, ...filtradosDrop];// Combinar y eliminar duplicados

    const unicos = [];// Eliminar duplicados por nombre+size
    combinados.forEach(f => {// Crear una clave única para cada archivo
        const key = `${f.name}_${f.size}`;
        if (!unicos.some(x => `${x.name}_${x.size}` === key)) {// Si no existe, agregarlo a la lista de únicos
            unicos.push(f);// Agregar a la lista de únicos
        }
    });

    if (unicos.length > MAX_FILES) {// Limitar al máximo permitido
        alert(`Máximo ${MAX_FILES} archivos. Se tomarán los primeros ${MAX_FILES}.`);
    }

    const seleccionados = unicos.slice(0, MAX_FILES);// Tomar solo los primeros MAX_FILES
    const dataTransfer = new DataTransfer();// Crear un nuevo DataTransfer para actualizar el input
    seleccionados.forEach(f => dataTransfer.items.add(f));// Agregar cada archivo seleccionado al DataTransfer

    fileInput.files = dataTransfer.files;
    actualizarLista(seleccionados);
});

// Click en la zona abre el selector
dropZone.addEventListener('click', () => fileInput.click());

// Accesibilidad con teclado
dropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        fileInput.click();
    }
});


// Botón eliminar todos
const clearAllBtn = document.getElementById('clear-all');
clearAllBtn.addEventListener('click', () => {
    archivosSeleccionados = []; // vacía el arreglo global
    const dt = new DataTransfer(); // crea un FileList vacío
    fileInput.files = dt.files;    // limpia el input
    actualizarLista([]);           // limpia la lista visible

    // Mostrar alerta propia
    alert('Todos los archivos han sido eliminados.');
});
