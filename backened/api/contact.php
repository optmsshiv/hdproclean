<?php
header("Content-Type: text/plain");

require_once "../config/db.php";

$name    = $_POST['name'];
$phone   = $_POST['phone'];
$email   = $_POST['email'];
$message = $_POST['message'];

$stmt = $conn->prepare("INSERT INTO contact (name, phone, email, message) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $phone, $email, $message);

echo $stmt->execute() ? "Message sent!" : "Error: " . $stmt->error;

$stmt->close();
$conn->close();
?>
