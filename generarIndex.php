<?php
$carpeta = $_POST['carpeta'];
$nombre = $_POST['nombre'];

$base = "plantillas/plantilla-index.html";
$destino = "clientes/$carpeta/index.html";

if (!is_dir("clientes/$carpeta")) {
    mkdir("clientes/$carpeta", 0777, true);
}

$contenido = file_get_contents($base);
$contenido = str_replace("CLIENTE-NOMBRE", strtoupper($nombre), $contenido);

file_put_contents($destino, $contenido);
echo json_encode(["estado" => "ok"]);
?>
