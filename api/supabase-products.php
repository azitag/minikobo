<?php
require_once 'supabase-config.php';

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all products or filtered by category
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    
    $query = '';
    if ($category && $category !== 'all') {
        $query = '?category=eq.' . urlencode($category);
    }
    
    $result = supabaseRequest('GET', 'products', null, $query);
    
    if ($result['code'] === 200) {
        echo json_encode($result['data']);
    } else {
        http_response_code($result['code']);
        echo json_encode(['error' => 'Failed to fetch products']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // For adding products (admin functionality)
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Basic validation
    if (!isset($data['name']) || !isset($data['price'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }
    
    $result = supabaseRequest('POST', 'products', $data);
    
    if ($result['code'] === 201) {
        echo json_encode(['message' => 'Product added successfully', 'data' => $result['data']]);
    } else {
        http_response_code($result['code']);
        echo json_encode(['error' => 'Failed to add product', 'details' => $result['data']]);
    }
}
?>