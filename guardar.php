<?php
$host = "sql200.infinityfree.com";
$usuario = "if0_39232131";
$contrasena = "sfcVRPaQXO";
$base_datos = "if0_39232131_movimiento";

$conn = new mysqli($host, $usuario, $contrasena, $base_datos);
if ($conn->connect_error) {
  die("Conexión fallida: " . $conn->connect_error);
}

// Datos generales
$cliente = $_POST['cliente'] ?? '';
$semana = $_POST['semana'] ?? '';
$ejercicio = $_POST['ejercicio'] ?? '';
$observaciones = $_POST['observaciones'] ?? '';

// Arrays de series
$reps = $_POST['repeticiones'] ?? [];
$cargas = $_POST['carga'] ?? [];
$rirs = $_POST['rir'] ?? [];
$descansos = $_POST['descanso'] ?? [];

$respuestas = [];

for ($i = 0; $i < count($reps); $i++) {
    // Limpiar valores
    $rep = trim($reps[$i] ?? '');
    $carga = trim($cargas[$i] ?? '');
    $rir = trim($rirs[$i] ?? '');
    $descanso = trim($descansos[$i] ?? '');

    // Verificamos que haya al menos un dato cargado en la fila
    if ($rep === '' && $carga === '' && $rir === '' && $descanso === '') {
        continue; // Saltar fila vacía
    }

    $serie_num = $i + 1;

    $sql = "INSERT INTO rutinas (cliente, semana, ejercicio, serie_num, repeticiones, carga, rir, descanso, observaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssss", $cliente, $semana, $ejercicio, $serie_num, $rep, $carga, $rir, $descanso, $observaciones);

    if (!$stmt->execute()) {
        $respuestas[] = ["estado" => "error", "mensaje" => "Error en la serie $serie_num"];
    }

    $stmt->close();
}

$conn->close();

if (empty($respuestas)) {
    echo json_encode(["estado" => "ok", "mensaje" => "✅ Ejercicio guardado correctamente"]);
} else {
    echo json_encode(["estado" => "error", "mensaje" => $respuestas]);
}
?>
