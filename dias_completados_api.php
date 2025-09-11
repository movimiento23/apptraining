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
    $stmt = $db->prepare("SELECT semana FROM dias_completados WHERE cliente = ? AND semana LIKE ?");
    $stmt->execute([$cliente, "%$mes%"]);
    $dias = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode($dias);
} catch (Exception $e) {
    echo json_encode([]);
}
