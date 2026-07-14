<?php
require_once 'config.php';
require_once 'db.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';
$uri_parts = explode('/', $endpoint);
$resource = $uri_parts[0];
$id = isset($uri_parts[1]) ? $uri_parts[1] : null;

switch ($resource) {
    case 'admin':
        require 'auth.php';
        break;
    case 'questions':
        require 'questions.php';
        break;
    case 'events':
        require 'events.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
        break;
}
