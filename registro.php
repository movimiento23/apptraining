<?php
$conn = new mysqli("sql200.infinityfree.com", "if0_39232131", "sfcVRPaQXO", "if0_39232131_movimiento");

// Verificamos conexión
if ($conn->connect_error) {
  echo json_encode(["estado" => "error", "mensaje" => "Error en la conexión"]);
  exit;
}

$correo = $_POST['correo'] ?? '';
$clave = $_POST['clave'] ?? '';
$carpeta = $_POST['carpeta'] ?? '';

if (!$correo || !$clave || !$carpeta) {
  echo json_encode(["estado" => "error", "mensaje" => "Todos los campos son obligatorios"]);
  exit;
}

// Verificar si el correo ya existe
$sql = "SELECT id FROM clientes WHERE correo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
  echo json_encode(["estado" => "error", "mensaje" => "Este correo ya está registrado"]);
} else {
  $clave_segura = password_hash($clave, PASSWORD_DEFAULT);
  $sql = "INSERT INTO clientes (correo, clave, carpeta) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("sss", $correo, $clave_segura, $carpeta);
  $stmt->execute();

  echo json_encode(["estado" => "ok", "mensaje" => "Cliente creado con éxito"]);
}

$conn->close();
?>
