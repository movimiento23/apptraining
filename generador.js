const fs = require('fs');
const path = require('path');

// 🧩 Generar contenido básico de la semana
function generarContenidoSemana(semana) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Semana ${semana}</title>
</head>
<body>
  <h1>Rutina – Semana ${semana}</h1>
  <p>Ejercicios personalizados próximamente...</p>
</body>
</html>`;
}

// 💾 Guardar semana y actualizar el índice
function guardarSemana(cliente, semana) {
  const carpetaCliente = path.join(__dirname, 'rutinas', cliente);
  const archivoSemana = path.join(carpetaCliente, `semana-${semana}.html`);
  const contenido = generarContenidoSemana(semana);

  // Crear el archivo de la semana
  fs.writeFileSync(archivoSemana, contenido);
  console.log(\`✅ semana-\${semana}.html guardada para \${cliente}\`);

  // Agregar la línea al index.html
  const archivoIndex = path.join(carpetaCliente, 'index.html');
  let indexHTML = fs.readFileSync(archivoIndex, 'utf-8');
  const nuevaLinea = \`  <li><a href="semana-\${semana}.html">Semana \${semana}</a></li>\n\`;
  const ulCierre = '</ul>';

  if (!indexHTML.includes(nuevaLinea)) {
    indexHTML = indexHTML.replace(ulCierre, nuevaLinea + ulCierre);
    fs.writeFileSync(archivoIndex, indexHTML);
    console.log(\`🔗 Semana \${semana} agregada al index\`);
  } else {
    console.log(\`⚠️ Semana \${semana} ya estaba en el index\`);
  }
}

// 👇 Ejecutamos el ejemplo:
guardarSemana('cliente-general', 3);
