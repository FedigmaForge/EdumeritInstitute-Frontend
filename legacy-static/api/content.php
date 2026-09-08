<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dataFile = 'data.json';

if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    echo $content;
} else {
    $defaultData = [
        'banner' => [
            'title' => 'Welcome to EduMerit Institute',
            'subtitle' => 'Empowering minds, shaping futures'
        ],
        'about' => 'EduMerit Institute is dedicated to providing quality education and fostering excellence in learning. We believe in nurturing talent and building future leaders.',
        'courses' => [],
        'blogs' => [],
        'contact' => [
            'phone' => '+1 234 567 8900',
            'email' => 'info@edumerit.com',
            'address' => '123 Education Street, City'
        ]
    ];
    echo json_encode($defaultData);
}
?>
