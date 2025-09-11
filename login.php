<?php
// Configuración de conexión a MySQL
$host = "sql200.infinityfree.com";
$usuario = "if0_39232131";
$contrasena = "sfcVRPaQXO";
$base_datos = "if0_39232131_movimiento";

// Conectar con MySQL
$conn = new mysqli($host, $usuario, $contrasena, $base_datos);
if ($conn->connect_error) {
  die(json_encode(["estado" => "error", "mensaje" => "Error de conexión a la base de datos"]));
}

// Recibir datos del login (POST)
$correo = $_POST['correo'] ?? '';
$clave = $_POST['clave'] ?? '';

if (!$correo || !$clave) {
  echo json_encode(["estado" => "error", "mensaje" => "Faltan datos"]);
  exit;
}

// Buscar cliente por correo
$sql = "SELECT clave, carpeta FROM clientes WHERE correo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
  $stmt->bind_result($clave_bd, $carpeta);
  $stmt->fetch();

  // Verificar contraseña
  if (password_verify($clave, $clave_bd)) {
    echo json_encode(["estado" => "ok", "carpeta" => $carpeta]);
  } else {
    echo json_encode(["estado" => "error", "mensaje" => "Contraseña incorrecta"]);
  }
} else {
  echo json_encode(["estado" => "error", "mensaje" => "Cliente no encontrado"]);
}

$stmt->close();
$conn->close();
?>
