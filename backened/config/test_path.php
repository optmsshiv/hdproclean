<?php
$path = __DIR__ . '/../../PHPMailer/src/PHPMailer.php';

echo $path . "<br>";

echo file_exists($path) ? "✔ FOUND" : "❌ NOT FOUND";
