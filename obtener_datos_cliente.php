<?php
header('Content-Type: application/json');
require_once 'conexion.php'; // Tu conexión a MySQL

$cliente_id = $_POST['cliente_id'] ?? null;

if (!$cliente_id) {
  echo json_encode(["error" => "Cliente ID no recibido"]);
  exit;
}

$sql = "SELECT fecha, ejercicio, series, reps, peso, rir, comentario 
        FROM estadisticas_clientes 
        WHERE cliente_id = ? 
        ORDER BY fecha ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $cliente_id);
$stmt->execute();
$result = $stmt->get_result();

$datos = [];
while ($row = $result->fetch_assoc()) {
  $datos[] = $row;
}

echo json_encode($datos);
?>
