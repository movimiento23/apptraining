<?php
// Configuración de conexión
$host = "sql200.infinityfree.com";
$usuario = "if0_39232131";
$contrasena = "sfcVRPaQXO";
$base_datos = "if0_39232131_movimiento";

$conn = new mysqli($host, $usuario, $contrasena, $base_datos);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Error de conexión"]);
  exit;
}

// Validar parámetros
$cliente   = $_GET['cliente']  ?? '';
$semana    = $_GET['semana']   ?? '';
$ejercicio = $_GET['ejercicio'] ?? '';

if (!$cliente || !$semana || !$ejercicio) {
  http_response_code(400);
  echo json_encode(["error" => "Faltan parámetros"]);
  exit;
}

// Consulta a la base de datos
$sql = "SELECT serie_num, repeticiones, carga, rir, descanso, observaciones
        FROM rutinas
        WHERE cliente = ? AND semana = ? AND ejercicio = ?
        ORDER BY serie_num ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $cliente, $semana, $ejercicio);
$stmt->execute();
$resultado = $stmt->get_result();

// Armar array para respuesta JSON
$series = [];
$observaciones = "";

while ($fila = $resultado->fetch_assoc()) {
  $series[] = [
    "repeticiones" => $fila["repeticiones"],
    "carga"        => $fila["carga"],
    "rir"          => $fila["rir"],
    "descanso"     => $fila["descanso"]
  ];
  $observaciones = $fila["observaciones"]; // Es igual en todas las filas
}

// Devolver respuesta
echo json_encode(array_map(function($s) use ($observaciones) {
  return $s + ["observaciones" => $observaciones];
}, $series));

$stmt->close();
$conn->close();
?>
