<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, apikey');

// Supabase configuration
define('SUPABASE_URL', 'https://YOUR_PROJECT_ID.supabase.co');
define('SUPABASE_KEY', 'YOUR_ANON_KEY');
define('SUPABASE_SECRET', 'YOUR_SERVICE_ROLE_KEY');

// For local development, you can also use PostgreSQL directly
function getSupabaseClient() {
    return [
        'url' => SUPABASE_URL,
        'key' => SUPABASE_KEY,
        'headers' => [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY,
            'Content-Type: application/json'
        ]
    ];
}

// Make request to Supabase REST API
function supabaseRequest($method, $table, $data = null, $query = '') {
    $client = getSupabaseClient();
    $url = $client['url'] . '/rest/v1/' . $table . $query;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $client['headers']);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'DELETE') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    } elseif ($method === 'PATCH') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true)
    ];
}
?>