<?php
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM events");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
elseif ($method === 'POST') {
    if (!verifyToken($pdo)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $startDate = $_POST['startDate'] ?? '';
    $endDate = $_POST['endDate'] ?? '';

    if (!$title || !$startDate || !$endDate) {
        http_response_code(400);
        echo json_encode(["error" => "Title, startDate, and endDate are required."]);
        exit;
    }

    $imagePath = "/bitimg/default-event.jpg";
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $filename = 'event-' . time() . '-' . basename($_FILES['image']['name']);
        if (!is_dir(UPLOAD_DIR)) {
            mkdir(UPLOAD_DIR, 0755, true);
        }
        $destination = rtrim(UPLOAD_DIR, '/') . '/' . $filename;
        move_uploaded_file($_FILES['image']['tmp_name'], $destination);
        $imagePath = "/uploads/" . $filename;
    }

    $id = time();
    $stmt = $pdo->prepare("INSERT INTO events (id, title, description, startDate, endDate, image) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $title, $description, $startDate, $endDate, $imagePath]);

    http_response_code(201);
    echo json_encode([
        "id" => $id,
        "title" => $title,
        "description" => $description,
        "startDate" => $startDate,
        "endDate" => $endDate,
        "image" => $imagePath
    ]);
}
elseif ($method === 'PUT' && $id) {
    if (!verifyToken($pdo)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $isMultipart = strpos($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') !== false;
    
    if (!$isMultipart && empty($_POST)) {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $title = $data['title'] ?? null;
        $description = $data['description'] ?? null;
        $startDate = $data['startDate'] ?? null;
        $endDate = $data['endDate'] ?? null;
    } else {
        $title = $_POST['title'] ?? null;
        $description = $_POST['description'] ?? null;
        $startDate = $_POST['startDate'] ?? null;
        $endDate = $_POST['endDate'] ?? null;
    }

    $imagePath = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $filename = 'event-' . time() . '-' . basename($_FILES['image']['name']);
        if (!is_dir(UPLOAD_DIR)) {
            mkdir(UPLOAD_DIR, 0755, true);
        }
        $destination = rtrim(UPLOAD_DIR, '/') . '/' . $filename;
        move_uploaded_file($_FILES['image']['tmp_name'], $destination);
        $imagePath = "/uploads/" . $filename;
    }

    $updates = [];
    $params = [];
    if ($title !== null) { $updates[] = "title = ?"; $params[] = $title; }
    if ($description !== null) { $updates[] = "description = ?"; $params[] = $description; }
    if ($startDate !== null) { $updates[] = "startDate = ?"; $params[] = $startDate; }
    if ($endDate !== null) { $updates[] = "endDate = ?"; $params[] = $endDate; }
    if ($imagePath !== null) { $updates[] = "image = ?"; $params[] = $imagePath; }

    if (!empty($updates)) {
        $params[] = $id;
        $stmt = $pdo->prepare("UPDATE events SET " . implode(", ", $updates) . " WHERE id = ?");
        $stmt->execute($params);
    }

    $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
}
elseif ($method === 'DELETE' && $id) {
    if (!verifyToken($pdo)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
    $stmt->execute([$id]);
    http_response_code(204);
}
