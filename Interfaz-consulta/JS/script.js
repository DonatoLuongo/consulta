let lastRemesa = null;
let lastNit = null;

function searchData() {
  const remesa = document.getElementById("remesaInput").value;
  const nit = document.getElementById("nitInput").value;

  // Validar que se haya ingresado ambos campos
  if (!remesa || !nit) {
    document.getElementById("errorMessage").innerText = "Por favor ingrese el número de remesa y el NIT.";
    document.getElementById("errorMessage").style.color = "red";  // Color rojo para error
    document.getElementById("errorMessage").style.display = "block";  // Mostrar mensaje de error
    return;
  }

  // Si la remesa y el NIT son los mismos que la última consulta, solo mostramos "Cargando..."
  if (remesa === lastRemesa && nit === lastNit) {
    showLoadingMessage();  // Mostrar mensaje de carga
    setTimeout(() => {
      hideLoadingMessage();
    }, 2000); // Mostrar "Cargando..." por 2 segundos
    return;
  }

  // Si son nuevos valores, mostrar el mensaje "Cargando..." y ocultar los resultados previos
  showLoadingMessage();  // Mostrar mensaje de carga
  hideResults();  // Ocultamos los resultados anteriores

  // Limpiar el mensaje de error y establecer valores previos
  document.getElementById("errorMessage").innerText = "";
  document.getElementById("errorMessage").style.display = "none";  // Ocultar mensaje de error
  lastRemesa = remesa;
  lastNit = nit;

  // Construir la URL con ambos valores
  const apiUrl = `https://api-remesas-transportadora.netlify.app/.netlify/functions/consulta_remesa/${remesa}/${nit}`;

  // Usar el proxy CORS para hacer la solicitud
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const url = proxyUrl + encodeURIComponent(apiUrl);  // Combinamos el proxy con la URL de la API

  fetch(url)
    .then(response => {
      console.log('Estado de la respuesta:', response.status); // Depuración
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Error en la respuesta de la API: ${response.statusText}. Detalles: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      hideLoadingMessage();  // Ocultar el "Cargando..." después de recibir la respuesta

      // Comprobar si data es un objeto y contiene el campo 'data'
      if (data && data.contents) {
        const apiResponse = JSON.parse(data.contents); // Los datos de la API vienen dentro de 'contents'
        
        // Verificar si los datos están en la respuesta
        if (apiResponse && apiResponse.data) {
          displaySearchResults(apiResponse.data);

          // Limpiar los campos después de la consulta exitosa
          document.getElementById("remesaInput").value = "";
          document.getElementById("nitInput").value = "";
        } else {
          document.getElementById("errorMessage").innerText = "No se encontraron resultados para esta remesa o NIT.";
          document.getElementById("errorMessage").style.color = "red";  // Color rojo para error
          document.getElementById("errorMessage").style.display = "block";  // Mostrar mensaje de error
        }
      } else {
        document.getElementById("errorMessage").innerText = "Error en la respuesta de la API.";
        document.getElementById("errorMessage").style.color = "red";  // Color rojo para error
        document.getElementById("errorMessage").style.display = "block";  // Mostrar mensaje de error
      }
    })
    .catch(error => {
      hideLoadingMessage();  // Ocultar el loader en caso de error
      console.error('Error al realizar la solicitud:', error); // Depuración: mostrar el error completo
      document.getElementById("errorMessage").innerText = `Error: ${error.message}`;
      document.getElementById("errorMessage").style.color = "red";  // Color rojo para error
      document.getElementById("errorMessage").style.display = "block";  // Mostrar mensaje de error
    });
}

function showLoadingMessage() {
  // Mostrar mensaje azul de carga
  document.getElementById("loadingMessage").innerText = "Cargando...";  // Mensaje azul
  document.getElementById("loadingMessage").style.color = "blue";  // Color azul
  document.getElementById("loadingMessage").style.display = "block";  // Mostrar mensaje
}

function hideLoadingMessage() {
  document.getElementById("loadingMessage").style.display = "none";  // Ocultar mensaje
}

function hideResults() {
  // Limpiar y ocultar los resultados previos
  document.querySelector(".container").style.display = "none";
  document.getElementById("remisiones").innerText = "";
  document.getElementById("remitente-ciudad").innerText = "";
  document.getElementById("remitente-contacto").innerText = "";
  document.getElementById("remitente-fecha").innerText = "";
  document.getElementById("remitente-direccion").innerText = "";
  document.getElementById("remitente-telefono").innerText = "";
  document.getElementById("remitente-nit").innerText = "";
  document.getElementById("destinatario-ciudad").innerText = "";
  document.getElementById("destinatario-contacto").innerText = "";
  document.getElementById("destinatario-fecha").innerText = "";
  document.getElementById("destinatario-direccion").innerText = "";
  document.getElementById("destinatario-telefono").innerText = "";
  document.getElementById("destinatario-nit").innerText = "";
  document.getElementById("fecha-envio").innerText = "";
  document.getElementById("fecha-estimada").innerText = "";
  document.getElementById("fecha-final").innerText = "";
  document.getElementById("ultimo-status").innerText = "";
  document.getElementById("novedades").innerHTML = "";
}

function displaySearchResults(data) {
  // Mostrar la información obtenida de la API
  document.getElementById("remisiones").innerText = data.remisiones;

  document.getElementById("remitente-ciudad").innerText = data.remitente.ciudad;
  document.getElementById("remitente-contacto").innerText = data.remitente.contacto;
  document.getElementById("remitente-fecha").innerText = data.remitente.fechaSolicitud;
  document.getElementById("remitente-direccion").innerText = data.remitente.direccion;
  document.getElementById("remitente-telefono").innerText = data.remitente.telefono;
  document.getElementById("remitente-nit").innerText = data.remitente.nit;

  document.getElementById("destinatario-ciudad").innerText = data.destinatario.ciudad;
  document.getElementById("destinatario-contacto").innerText = data.destinatario.contacto;
  document.getElementById("destinatario-fecha").innerText = data.destinatario.fechaRecibido;
  document.getElementById("destinatario-direccion").innerText = data.destinatario.direccion;
  document.getElementById("destinatario-telefono").innerText = data.destinatario.telefono;
  document.getElementById("destinatario-nit").innerText = data.destinatario.nit;

  document.getElementById("fecha-envio").innerText = data.fechaEnvio;
  document.getElementById("fecha-estimada").innerText = data.fechaEstimadaEntrega;
  document.getElementById("fecha-final").innerText = data.fechaFinalEntrega;
  document.getElementById("ultimo-status").innerText = data.ultimoStatus;

  // Aquí formateamos las novedades para que se muestren enumeradas correctamente
  if (data.novedades && data.novedades.length > 0) {
    const novedadesList = document.getElementById("novedades");
    novedadesList.innerHTML = '';  // Limpiar lista de novedades antes de agregar nuevas

    data.novedades.forEach((novedad, index) => {
      const li = document.createElement("li");
      li.innerText = `${novedad.posicion}. ${novedad.novedad} (Fecha: ${novedad.fecha})`;  // Numeración y texto de la novedad
      novedadesList.appendChild(li);
    });
  } else {
    document.getElementById("novedades").innerHTML = "<li>No hay novedades disponibles.</li>";
  }

  // Mostrar los resultados
  document.querySelector(".container").style.display = "block";
}




// Función para el botón de imprimir

function printTable() {
  const tableContent = document.querySelector(".container").innerHTML;
  const newWindow = window.open('', '_blank', 'width=800,height=600');
  
  newWindow.document.write(`
    <html>
    <head>
      <title>Imprimir Tabla</title>
      <style>
        /* Estilos para la impresión */
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .detail-item {
          border: 1px solid #ddd;
          padding: 8px;
          margin: 5px 0;
        }
        .detail-item h3 {
          margin-top: 0;
        }
        /* Ocultar el botón de imprimir en la vista de impresión */
        @media print {
          .print-button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      ${tableContent}
    </body>
    </html>
  `);
  
  newWindow.document.close();
  newWindow.print();
}

// Función para el botón de imprimir


