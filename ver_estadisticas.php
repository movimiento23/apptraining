<?php
header('Content-Type: application/json');

// 📌 Configuración de conexión
$conexion = new mysqli("localhost", "usuario", "contraseña", "nombre_base");

if ($conexion->connect_error) {
    die(json_encode(["error" => "Conexión fallida"]));
}

// 🎯 ID del cliente que estamos consultando
$id_cliente = $_GET['id_cliente'] ?? null;

if (!$id_cliente) {
    echo json_encode(["error" => "Falta el id_cliente"]);
    exit;
}

// 🧠 Consulta SQL
$sql = "SELECT ejercicio, repeticiones, peso, rir, descanso, observaciones, fecha
        FROM rutina
        WHERE cliente_id = ?
        ORDER BY fecha DESC";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_cliente);
$stmt->execute();

$resultado = $stmt->get_result();
$datos = [];

while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

echo json_encode($datos);
?>
