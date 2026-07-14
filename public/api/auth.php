<?php
if ($uri_parts[1] === 'login' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        $token = bin2hex(random_bytes(16));
        $stmt = $pdo->prepare("INSERT INTO tokens (token, created_at) VALUES (?, ?)");
        $stmt->execute([$token, time()]);
        echo json_encode(["token" => $token, "message" => "Login successful."]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid username or password."]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Not found"]);
}
