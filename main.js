// Lista de todos los ejercicios disponibles
const ejercicios = [
  { nombre: "Flexiones de brazo", gif: "flexiones-de-brazo.gif" },
  { nombre: "Remo con polea", gif: "remo-con-polea.gif" },
  { nombre: "Biceps banco Scott", gif: "biceps-banco-scott.gif" },
  { nombre: "Peck Deck", gif: "peck-deck.gif" },
  { nombre: "Curl de biceps barra ez", gif: "curl-de-biceps-barra-ez.gif" },
  { nombre: "Fondo de triceps en el suelo", gif: "fondo-de-triceps-en-el-suelo.gif" },
  { nombre: "Apertura Plana", gif: "apertura-plana.gif" },
  { nombre: "Press militar", gif: "press-militar.gif" },
  { nombre: "Crunch con peso", gif: "crunch-con-peso.gif" },
  { nombre: "Press plano con mancuerna", gif: "press-plano-con-mancuerna.gif" }
];

// Acciones cuando se clickea un nombre de ejercicio en la tabla sugerida
document.querySelectorAll(".ejercicio-toggle").forEach(td => {
  td.addEventListener("click", () => {
    const nombre = td.dataset.ejercicio;
    const panel = td.parentElement.nextElementSibling;

    // Si está abierto, cerrarlo
    if (!panel.classList.contains("oculto")) {
      panel.classList.add("oculto");
      panel.innerHTML = "<td colspan='7'></td>";
      return;
    }

    // Cerrar todos los demás paneles primero
    document.querySelectorAll(".panel-interactivo").forEach(p => {
      p.classList.add("oculto");
      p.innerHTML = "<td colspan='7'></td>";
    });

    const ejercicio = ejercicios.find(e => e.nombre === nombre);
    if (!ejercicio) return;

    const contenido = `
      <img src="../gifs/${ejercicio.gif}" class="gif-ejercicio" alt="${ejercicio.nombre}">
      <table>
        <thead>
          <tr><th>Serie</th><th>Peso (kg)</th><th>Desc. min</th><th>Desc. seg</th><th>RIR</th></tr>
        </thead>
        <tbody>
          ${[...Array(6)].map((_, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><input type="number" name="peso${i + 1}"></td>
              <td><input type="number" name="min${i + 1}"></td>
              <td><input type="number" name="seg${i + 1}"></td>
              <td><input type="number" name="rir${i + 1}"></td>
            </tr>`).join("")}
        </tbody>
      </table>
      <textarea placeholder="Observaciones..."></textarea>
      <button class="btn-guardar-ejercicio">Guardar ejercicio</button>
      <div class="mensaje-ejercicio">Ejercicio guardado con éxito</div>
    `;

    panel.classList.remove("oculto");
    panel.innerHTML = `<td colspan="7">${contenido}</td>`;

    // Activar lógica de guardado
    const boton = panel.querySelector(".btn-guardar-ejercicio");
    const mensaje = panel.querySelector(".mensaje-ejercicio");

    if (boton && mensaje) {
      boton.addEventListener("click", () => {
        mensaje.style.opacity = 1;
        setTimeout(() => mensaje.style.opacity = 0, 2000);
      });
    }
  });
});
