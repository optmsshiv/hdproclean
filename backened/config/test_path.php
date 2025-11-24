<?php
echo "<h3>Testing PHPMailer Path</h3>";

$path = __DIR__ . "/../../PHPMailer/src/PHPMailer.php";

echo "Using path: $path<br>";

if (file_exists($path)) {
    echo "<span style='color:green'>FILE EXISTS ✔</span>";
} else {
    echo "<span style='color:red'>FILE NOT FOUND ❌</span>";
}
?>
