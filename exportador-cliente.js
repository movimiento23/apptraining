function exportarRutinaDesdeEditor(cliente, semana, dia) {
  console.log('exportarRutinaDesdeEditor llamado con:', cliente, semana);

  cliente = cliente.trim() || "Cliente";
  semana = semana.trim();
  if (!semana.startsWith("semana-")) {
    semana = "semana-" + semana;
  }
const mes = document.getElementById("mes")?.value.trim();
if (mes && !semana.includes(mes)) {
  semana += '-' + mes;
}

// FUNCION PARA OBTENER COLORES DE SUPERSERIES
    function obtenerColorSuperserie(letra) {
        switch (letra.toUpperCase()) {
            case 'A': return { fondo: '#2e7d32', borde: '#1b5e20' }; // Verde
            case 'B': return { fondo: '#0288d1', borde: '#01579b' }; // Azul
            case 'C': return { fondo: '#512da8', borde: '#311b92' }; // Púrpura
            case 'D': return { fondo: '#6d4c41', borde: '#3e2723' }; // Marrón
            case 'E': return { fondo: '#ea02e7', borde: '#9e029c' }; // Fucsia
            case 'F': return { fondo: '#008080', borde: '#006666' }; // Aguamarina oscuro
            default: return { fondo: '#e53935', borde: '#b71c1c' }; // Rojo por defecto
        }
    }
// INICIO: NUEVO CÓDIGO PARA CAPTURAR DATOS DE HIIT/CARDIO
const hiitCardioSection = document.getElementById('hiit-cardio-section');
let hiitTituloGeneral = '';
let hiitRondas = '';
let hiitTiempoTrabajo = '';
let hiitTiempoRecuperacion = '';
let hiitEjerciciosHtmlExportado = ''; // Aquí almacenaremos el HTML de los ejercicios HIIT seleccionados

// Solo si la sección de HIIT/Cardio está visible en el editor, capturamos sus datos
if (hiitCardioSection && hiitCardioSection.style.display === 'block') {
    hiitTituloGeneral = document.getElementById('hiitTituloGeneral').value.trim();
    hiitRondas = document.getElementById('hiitRondas').value.trim();
    hiitTiempoTrabajo = document.getElementById('hiitTiempoTrabajo').value.trim();
    hiitTiempoRecuperacion = document.getElementById('hiitTiempoRecuperacion').value.trim();

    // Recorremos las filas de la tabla de HIIT/Cardio en el editor
    const hiitTableBody = document.querySelector("#tabla-hiit-cardio tbody");
    if (hiitTableBody) { // Verificamos que la tabla exista
        hiitTableBody.querySelectorAll("tr").forEach((fila) => {
            const selectEjercicio = fila.querySelector(".hiit-ejercicio-select");
            const ejercicioSeleccionado = selectEjercicio ? selectEjercicio.value.trim() : '';

            // Solo incluimos la fila si se seleccionó un ejercicio válido (no la opción por defecto)
            if (ejercicioSeleccionado && ejercicioSeleccionado !== '-- Elegí un ejercicio --') {
                const serieNumero = fila.querySelector("td:first-child").textContent; // Obtenemos el número de la serie
                hiitEjerciciosHtmlExportado += `
                    <tr>
                        <td>${serieNumero}</td>
                        <td class="hiit-ejercicio-clicable">${ejercicioSeleccionado}</td>
                    </tr>
                `;
            }
        });
    }
}
// FIN: NUEVO CÓDIGO PARA CAPTURAR DATOS DE HIIT/CARDIO
  const filas = document.querySelectorAll("#tabla-rutina tbody tr");
const ejercicios = [];
let diaDetectado = "";
let bloqueActual = null;

filas.forEach(fila => {
  const cols = fila.querySelectorAll("td, th");

  if (
    cols.length === 1 &&
    cols[0].getAttribute("colspan") === "5" &&
    cols[0].textContent.includes("—")
  ) {
    // ⬇️ REEMPLAZAR DESDE AQUÍ ⬇️
    const textoDelEncabezado = cols[0].textContent.trim();
    const textoSinBoton = textoDelEncabezado.split("🗑")[0].trim();
    const [diaRaw, resto] = textoSinBoton.split("—");
    diaDetectado = diaRaw.trim().toLowerCase();

    let ejRaw = resto;
    let tipoAgrupamiento = "–";

    if ((resto || "").includes("Sup. Serie:")) {
      [ejRaw, tipoAgrupamiento] = resto.split("Sup. Serie:").map(s => s.trim());
      tipoAgrupamiento = "Sup. Serie: " + tipoAgrupamiento;
    } else if ((resto || "").includes("Triserie:")) {
      [ejRaw, tipoAgrupamiento] = resto.split("Triserie:").map(s => s.trim());
      tipoAgrupamiento = "Triserie: " + tipoAgrupamiento;
    }

    bloqueActual = {
      ejercicio: ejRaw.trim(),
      sup: tipoAgrupamiento,
      series: []
    };
  ejercicios.push(bloqueActual);
} else if (
  bloqueActual &&
  cols.length === 5 &&
  /^\d+$/.test(cols[0].textContent.trim())
) {
  bloqueActual.series.push({
    serie: cols[0].textContent.trim(),
    reps: cols[1].textContent.trim(),
    peso: cols[2].textContent.trim(),
    rir: cols[3].textContent.trim(),
    descanso: cols[4].textContent.trim()
  });
}
  });
// INICIO: NUEVO CÓDIGO PARA CONSTRUIR EL HTML Y ESTILOS DE HIIT/CARDIO PARA EL ARCHIVO FINAL
let hiitCardioHtml = ''; // Esta variable contendrá el HTML completo de la sección HIIT/Cardio

// Solo creamos el HTML de la sección si hay datos para mostrar (título, rondas, tiempos o ejercicios)
if (hiitTituloGeneral || hiitRondas || hiitTiempoTrabajo || hiitTiempoRecuperacion || hiitEjerciciosHtmlExportado) {
    hiitCardioHtml = `
        <div class="hiit-cardio-seccion">
            <h2 style="color: #6200ea; text-align: center; margin-bottom: 1rem;">${hiitTituloGeneral || "HIIT / Cardio"}</h2>
            <div class="hiit-info">
                ${hiitRondas ? `<p><strong>Rondas:</strong> ${hiitRondas}</p>` : ''}
                ${hiitTiempoTrabajo ? `<p><strong>Tiempo de Trabajo:</strong> ${hiitTiempoTrabajo}</p>` : ''}
                ${hiitTiempoRecuperacion ? `<p><strong>Tiempo de Recuperación:</strong> ${hiitTiempoRecuperacion}</p>` : ''}
            </div>
            ${hiitEjerciciosHtmlExportado ? `
            <h3 style="color: #e53935; text-align: center; margin-top: 1.5rem; margin-bottom: 1rem;">Ejercicios</h3>
            <table class="tabla-ejercicios-hiit">
                <thead>
                    <tr>
                        <th>Serie</th>
                        <th>Ejercicio</th>
                    </tr>
                </thead>
                <tbody>
                    ${hiitEjerciciosHtmlExportado}
                </tbody>
            </table>
            <div class="hiit-panel-interactivo oculto"></div>             
            ` : ''}
        </div>
    `;
}

// Estos son los estilos CSS para la sección de HIIT/Cardio en el archivo final
// Los guardamos en una variable para insertarlos fácilmente en el <style>
const estilosHiitCardio = `
    .hiit-cardio-seccion {
        margin-top: 3rem; /* Espacio superior para separarlo de la rutina principal */
        padding: 1.5rem;
        background-color: rgba(25, 25, 25, 0.9); /* Fondo oscuro con transparencia */
        border-radius: 12px;
        border: 2px solid #6200ea; /* Borde del color principal de HIIT */
        box-shadow: 0 0 15px rgba(98, 0, 234, 0.4); /* Sombra para resaltar */
    }
    .hiit-cardio-seccion h2 {
        font-size: 1.8rem;
        color: #6200ea;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 2px solid #6200ea;
        padding-bottom: 0.8rem;
        margin-bottom: 1.5rem;
    }
    .hiit-cardio-seccion .hiit-info p {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: #f2f2f2;
    }
    .hiit-cardio-seccion .hiit-info p strong {
        color: #7e57c2;
    }
    .hiit-cardio-seccion h3 {
        font-size: 1.4rem;
        color: #e53935;
        text-align: center;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    .tabla-ejercicios-hiit {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
    .tabla-ejercicios-hiit th, .tabla-ejercicios-hiit td {
        border: 1px solid #444;
        padding: 0.6rem;
        text-align: center;
    }
    .tabla-ejercicios-hiit th {
        background-color: #e53935;
        color: #fff;
        font-weight: bold;
    }
    .tabla-ejercicios-hiit tr:nth-child(even) {
        background-color: #1a1a1a;
    }
`;
// FIN: NUEVO CÓDIGO PARA CONSTRUIR EL HTML Y ESTILOS

  const contenido = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${diaDetectado.charAt(0).toUpperCase() + diaDetectado.slice(1)} – ${cliente}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
  <style>
    body {
      background-color: #000;
      background-image: url("../../img/fondo-rutina.jpg");
      background-size: cover;
      color: #fff;
      font-family: 'Montserrat', sans-serif;
      padding: 2rem;
      margin: 0;
      text-shadow: 1px 1px 2px #000;
    }
    header { text-align: center; margin-bottom: 1rem }
    header img { max-width: 140px; display: block; margin: 0 auto }
    h1 { color: #e53935; font-size: 1.6rem; margin: 0.5rem 0 }
    h2 { font-size: 1.1rem; text-align: center; margin-bottom: 2rem }
    .bloque-ejercicio {
      background: rgba(0,0,0,0.6);
      border: 1px solid #e53935;
      border-radius: 10px;
      padding: 1rem;
      margin: 1.5rem 0;
    }
    .bloque-ejercicio h3 {
      margin: 0;
      color: #e53935;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
    }
    .tabla-ejercicio {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.8rem;
      font-size: 0.95rem;
    }
    .tabla-ejercicio th {
      background: #e53935;
      color: #fff;
      padding: 0.5rem;
      border: 1px solid #333;
      text-transform: uppercase;
      font-weight: normal;
    }
    .tabla-ejercicio td {
      padding: 0.5rem;
      border: 1px solid #333;
      text-align: center;
      background: rgba(255,255,255,0.05);
    }
    .input-cliente {
      background: #fff;
      color: #000;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 0.4rem;
      width: 90%;
      box-sizing: border-box;
      text-align: center;
    }
    .btn-guardar-ejercicio {
      margin-top: 0.5rem;
      background: #2e7d32;
      color: #fff;
      border: none;
      padding: 0.4rem 1rem;
      cursor: pointer;
      border-radius: 6px;
    }
    .mensaje-ejercicio {
      color: #81c784;
      margin-top: 0.3rem;
      font-size: 0.9rem;
      opacity: 0;
      transition: opacity 0.3s;
    }
  ${estilosHiitCardio} 
  /* cursor mano al pasar sobre celdas HIIT clicables */
.hiit-cardio-seccion .hiit-ejercicio-clicable {
  cursor: pointer;
}   
  </style>
</head>
<body>
  <header>
    <img src="../../img/logo-movimiento.png" alt="Movimiento Training" />
    <h1>${diaDetectado.charAt(0).toUpperCase() + diaDetectado.slice(1)} – ${cliente}</h1>
    <p class="instruccion">Hacé clic en un ejercicio para completarlo con tus datos.</p>
  </header>

  ${ejercicios.map(ej => {
    // FUNCION PARA OBTENER COLORES DE TRISERIES
    function obtenerColorTriserie(letra) {
        switch (letra.toUpperCase()) {
            case 'A': return { fondo: '#d32f2f', borde: '#9a0007' }; // Rojo
            case 'B': return { fondo: '#ffc107', borde: '#ff8f00' }; // Amarillo
            case 'C': return { fondo: '#757575', borde: '#494949' }; // Gris
            case 'D': return { fondo: '#00bcd4', borde: '#00838f' }; // Cian
            default: return { fondo: '#e53935', borde: '#b71c1c' }; // Rojo por defecto
        }
    }

    // 1. Lógica para determinar los colores y el texto de agrupamiento
    let fondoH3 = '#e53935'; // Rojo por defecto para ejercicios normales
    let bordeDiv = '#e53935';
    let bordeTh = '#e53935';
    let tipoAgrupamientoHTML = '';
    
    // Si es una superserie, aplicamos sus colores
    if (ej.sup && ej.sup.startsWith('Sup. Serie:')) {
        const letra = ej.sup.split(':')[1].trim();
        const colores = obtenerColorSuperserie(letra);
        fondoH3 = colores.fondo;
        bordeDiv = colores.borde;
        bordeTh = colores.borde;
    }
    // Si es una triserie, aplicamos sus colores
    else if (ej.sup && ej.sup.startsWith('Triserie:')) {
        const letra = ej.sup.split(':')[1].trim();
        const colores = obtenerColorTriserie(letra);
        fondoH3 = colores.fondo;
        bordeDiv = colores.borde;
        bordeTh = colores.borde;
    }
    
    // Si hay algún tipo de agrupamiento (superserie o triserie), preparamos el HTML para mostrarlo
    if (ej.sup && ej.sup !== '–') {
        tipoAgrupamientoHTML = `<small style="color: #fff;">${ej.sup}</small>`;
    }
    
    // 2. Construcción de la estructura HTML usando las variables
    return `
<div class="bloque-ejercicio" style="border: 1px solid ${bordeDiv};">
  <h3 style="background: ${fondoH3}; margin: 0; padding: 0.5rem; border-radius: 8px; font-size: 0.9rem;">
    <span style="color: #fff;">${ej.ejercicio}</span>
    ${tipoAgrupamientoHTML}
  </h3>
      <div style="display:flex; justify-content:center;">
      <table class="tabla-ejercicio">
      <thead>
      <tr style="background: ${bordeTh}; color: #fff;">
        <th>Serie</th><th>Reps</th><th>Peso</th><th>RIR</th><th>Desc.</th>
        </tr>
        </thead>
        <tbody>
    ${ej.series.map(s => `
      <tr>
      <td>${s.serie}</td>
      <td>${s.reps || "-"}</td>
      <td>${s.peso || "-"}</td>
      <td>${s.rir || "-"}</td>
      <td>${s.descanso || "-"}</td>
      </tr>
    `).join('')}
    </tbody>
      </table>
    </div>
    <div class="panel-interactivo oculto" data-ejercicio="${ej.ejercicio}"></div>
</div>
`;
}).join('')}
${hiitCardioHtml}
  <footer style="text-align:center;margin-top:2rem;font-size:0.85rem;color:#aaa;">
    Estás entrenando en Movimiento Training — Cada sesión suma, y tu esfuerzo se nota 💪🏼
  </footer>

  <script>
    const cliente = "${cliente}";
    const semana  = "${semana}-${diaDetectado}";

    document.querySelectorAll('.bloque-ejercicio h3').forEach(h3 => {
      h3.addEventListener('click', () => {
        const nombre = h3.querySelector('span').textContent;
        const panel  = h3.parentElement.querySelector('.panel-interactivo');

        if (!panel.classList.contains('oculto')) {
          panel.classList.add('oculto');
          panel.innerHTML = '';
          return;
        }

        document.querySelectorAll('.panel-interactivo').forEach(p => {
          p.classList.add('oculto');
          p.innerHTML = '';
        });

        const gif = '../../../gifs/' + nombre.toLowerCase().replace(/\\s+/g, '-') + '.webp';
        const html = \`
          <img src="\${gif}" alt="\${nombre}" style="max-width:180px;display:block;margin:1rem auto;"/>
          <table style="width:100%;margin-top:1rem;border-collapse:collapse;font-size:0.9rem;">
            <thead><tr><th>Serie</th><th>Reps</th><th>Peso</th><th>RIR</th><th>Desc.</th></tr></thead>
            <tbody>
              \${[...Array(6)].map((_,i)=>\`
                <tr>
                  <td style="text-align:center;">\${i+1}</td>
                  <td><input name="repeticiones" class="input-cliente"/></td>
                  <td><input name="peso" class="input-cliente"/></td>
                  <td><input name="rir" class="input-cliente"/></td>
                  <td><input name="descanso" class="input-cliente"/></td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
          <textarea name="observaciones" placeholder="Cómo te fue..." style="width:100%;height:60px;margin-top:0.8rem;color:#fff;background:#000;"></textarea>
          <button class="btn-guardar-ejercicio">Guardar ejercicio</button>
          <div class="mensaje-ejercicio">✔ Ejercicio guardado</div>
        \`;

        panel.innerHTML = html;
        panel.classList.remove('oculto');

        const btn = panel.querySelector('.btn-guardar-ejercicio');
        const msg = panel.querySelector('.mensaje-ejercicio');
        const txt = panel.querySelector('textarea');
       console.log("📤 Pidiendo datos a:", '../../../../ver_ejercicio.php?cliente=' + cliente + '&semana=' + semana + '&ejercicio=' + encodeURIComponent(nombre));
        // 🔄 Cargar datos
        fetch('../../../ver_ejercicio.php?cliente=' + cliente + '&semana=' + semana + '&ejercicio=' + encodeURIComponent(nombre))
          .then(r => r.json())
          .then(series => {
            if (Array.isArray(series)) {
              series.forEach((serie, i) => {
                const fila = panel.querySelectorAll("tbody tr")[i];
                if (fila) {
                  fila.querySelector('[name="repeticiones"]').value = serie.repeticiones || "";
                  fila.querySelector('[name="peso"]').value         = serie.carga || "";
                  fila.querySelector('[name="rir"]').value          = serie.rir || "";
                  fila.querySelector('[name="descanso"]').value     = serie.descanso || "";
                }
              });
              if (series[0]) {
                txt.value = series[0].observaciones || "";
              }
            }
          });

        btn.addEventListener('click', () => {
          const data = new URLSearchParams();
          data.append("cliente", cliente);
          data.append("semana", semana);
          data.append("ejercicio", nombre);
          data.append("observaciones", txt.value);

          [...panel.querySelectorAll("tbody tr")].forEach((fila, i) => {
            const rep = fila.querySelector('[name="repeticiones"]').value.trim();
            const peso = fila.querySelector('[name="peso"]').value.trim();
            const rir = fila.querySelector('[name="rir"]').value.trim();
            const descanso = fila.querySelector('[name="descanso"]').value.trim();

            if (rep || peso || rir || descanso) {
              data.append("repeticiones[]", rep);
              data.append("carga[]", peso);
              data.append("rir[]", rir);
              data.append("descanso[]", descanso);
            }
          });

          fetch("../../../guardar.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data
          })
            .then(r => r.json())
            .then(res => {
              msg.textContent = res.mensaje || "✔ Guardado";
              msg.style.opacity = "1";
              setTimeout(() => msg.style.opacity = "0", 2000);
            })
            .catch(() => {
              msg.textContent = "❌ Error";
              msg.style.opacity = "1";
              setTimeout(() => msg.style.opacity = "0", 2000);
            });
        });
      });
    });
    // INICIO: NUEVA LÓGICA PARA EJERCICIOS DE HIIT/CARDIO (Mostrar GIF)
    document.querySelectorAll('.hiit-ejercicio-clicable').forEach(celda => {
        celda.addEventListener('click', () => {
            const nombreEjercicio = celda.textContent.trim(); // Obtiene el nombre del ejercicio
            const hiitPanel = celda.closest('.hiit-cardio-seccion').querySelector('.hiit-panel-interactivo');

            // Si el panel ya está abierto para este ejercicio, lo cierra
            if (!hiitPanel.classList.contains('oculto') && hiitPanel.dataset.currentExercise === nombreEjercicio) {
                hiitPanel.classList.add('oculto');
                hiitPanel.innerHTML = '';
                delete hiitPanel.dataset.currentExercise; // Limpiar ejercicio actual
                return;
            }

            // Cierra cualquier otro panel interactivo que pudiera estar abierto (tanto de pesas como de HIIT)
            document.querySelectorAll('.panel-interactivo').forEach(p => { p.classList.add('oculto'); p.innerHTML = ''; });
            document.querySelectorAll('.hiit-panel-interactivo').forEach(p => { p.classList.add('oculto'); p.innerHTML = ''; });


            // Construye la ruta del GIF (asumiendo que los GIFs de HIIT/Cardio están en la misma carpeta "gifs")
            // La ruta '../../../gifs/' es relativa desde el archivo exportado (clientes/jose/mesX/rutina.html)
            // hasta la carpeta raíz donde estaría la carpeta 'gifs'.
            const gifPath = '../../../gifs/' + nombreEjercicio.toLowerCase().replace(/\\s+/g, '-') + '.webp';

            const htmlPanel =
  '<img src="' + gifPath + '" style="max-width:180px;display:block;margin:1rem auto;"/>' +
  '<p style="text-align:center;color:#ccc;">' + nombreEjercicio + '</p>';


            hiitPanel.innerHTML = htmlPanel;
            hiitPanel.classList.remove('oculto');
            hiitPanel.dataset.currentExercise = nombreEjercicio; // Guardar qué ejercicio está abierto
        });
    });
    // FIN: NUEVA LÓGICA PARA EJERCICIOS DE HIIT/CARDIO
  </script>
</body>
</html>`;

  const nombreArchivo = `${semana}-${dia}`.replace(/--+/g, '-').replace(/-$/, '');
const blob = new Blob([contenido], { type: "text/html" });
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = `${nombreArchivo}.html`;
link.click();
}
