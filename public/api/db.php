<?php
require_once 'config.php';

$db_file = DATA_DIR . '/database.sqlite';
$is_new = !file_exists($db_file);

try {
    $pdo = new PDO('sqlite:' . $db_file);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($is_new) {
        // Create tables
        $pdo->exec("CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            question TEXT NOT NULL,
            answer TEXT,
            status TEXT DEFAULT 'pending'
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            startDate TEXT,
            endDate TEXT,
            image TEXT
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS tokens (
            token TEXT PRIMARY KEY,
            created_at INTEGER
        )");

        // Migrate existing JSON data if available
        $questions_file = DATA_DIR . '/questions.json';
        if (file_exists($questions_file)) {
            $questions = json_decode(file_get_contents($questions_file), true);
            if (is_array($questions)) {
                $stmt = $pdo->prepare("INSERT INTO questions (id, name, question, answer, status) VALUES (?, ?, ?, ?, ?)");
                foreach ($questions as $q) {
                    $stmt->execute([$q['id'], $q['name'], $q['question'], $q['answer'] ?? '', $q['status']]);
                }
            }
        }

        $events_file = DATA_DIR . '/events.json';
        if (file_exists($events_file)) {
            $events = json_decode(file_get_contents($events_file), true);
            if (is_array($events)) {
                $stmt = $pdo->prepare("INSERT INTO events (id, title, description, startDate, endDate, image) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($events as $e) {
                    $stmt->execute([$e['id'], $e['title'], $e['description'] ?? '', $e['startDate'], $e['endDate'], $e['image'] ?? '']);
                }
            }
        }
    }
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

function verifyToken($pdo) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        }
    }
    
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        $stmt = $pdo->prepare("SELECT * FROM tokens WHERE token = ?");
        $stmt->execute([$token]);
        if ($stmt->fetch()) {
            return true;
        }
    }
    return false;
}
