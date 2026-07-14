<?php
define('ADMIN_USERNAME', getenv('ADMIN_USERNAME') ?: 'admin');
define('ADMIN_PASSWORD', getenv('ADMIN_PASSWORD') ?: 'BITadmin123');

$dataDir = getenv('DATA_DIR');
if (!$dataDir) {
    $dataDir = realpath(__DIR__ . '/../../data');
    if (!$dataDir || !is_dir($dataDir)) {
        $dataDir = __DIR__ . '/../data';
    }
}

if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

define('DATA_DIR', $dataDir);
define('UPLOAD_DIR', realpath(__DIR__ . '/../uploads') ?: __DIR__ . '/../uploads');
