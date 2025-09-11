<?php
header('Content-Type: application/json');

$cliente = $_GET['cliente'] ?? '';
$mes = $_GET['mes'] ?? '';

if (!$cliente || !$mes) {
    echo json_encode([]);
    exit;
}

try {
    $db = new PDO('sqlite:rutas.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Asegura que la tabla exista
    $db->exec("CREATE TABLE IF NOT EXISTS dias_completados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente TEXT,
        semana TEXT
    )");

    // Busca los días completados para ese cliente y mes
    $stmt = $db->prepare("SELECT semana FROM dias_completados WHERE cliente = ? AND semana LIKE ?");
    $stmt->execute([$cliente, "%$mes%"]);

    $dias = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($dias);

} catch (Exception $e) {
    echo json_encode([]);
}
