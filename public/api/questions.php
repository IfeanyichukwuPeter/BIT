<?php
if ($method === 'GET') {
    $status = $_GET['status'] ?? null;
    if ($status) {
        $stmt = $pdo->prepare("SELECT * FROM questions WHERE status = ?");
        $stmt->execute([$status]);
    } else {
        $stmt = $pdo->query("SELECT * FROM questions");
    }
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = isset($data['name']) ? trim($data['name']) : 'Anonymous';
    $question = isset($data['question']) ? trim($data['question']) : '';

    if (!$question) {
        http_response_code(400);
        echo json_encode(["error" => "Question is required."]);
        exit;
    }

    $id = time();
    $stmt = $pdo->prepare("INSERT INTO questions (id, name, question, answer, status) VALUES (?, ?, ?, '', 'pending')");
    $stmt->execute([$id, $name, $question]);

    http_response_code(201);
    echo json_encode([
        "id" => $id,
        "name" => $name,
        "question" => $question,
        "answer" => "",
        "status" => "pending"
    ]);
}
elseif ($method === 'PUT' && $id) {
    if (!verifyToken($pdo)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['answer'])) {
        $answer = trim($data['answer']);
        $status = $answer ? 'answered' : 'pending';
        $stmt = $pdo->prepare("UPDATE questions SET answer = ?, status = ? WHERE id = ?");
        $stmt->execute([$answer, $status, $id]);
    }

    $stmt = $pdo->prepare("SELECT * FROM questions WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
}
elseif ($method === 'DELETE' && $id) {
    if (!verifyToken($pdo)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM questions WHERE id = ?");
    $stmt->execute([$id]);
    http_response_code(204);
}
