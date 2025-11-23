<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Database credentials
$host = "localhost";
$db   = "edrppymy_hdprocleaning";
$user = "hdproclean";
$pass = "123@Hdproclean";

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to sanitize input
function clean($data, $conn) {
    return htmlspecialchars($conn->real_escape_string(trim($data)));
}

// Determine which form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Detect form type
    $form_type = isset($_POST['form_type']) ? clean($_POST['form_type'], $conn) : 'contact';

    $name = isset($_POST['name']) ? clean($_POST['name'], $conn) : '';
    $phone = isset($_POST['phone']) ? clean($_POST['phone'], $conn) : '';
    $email = isset($_POST['email']) ? clean($_POST['email'], $conn) : NULL;
    $service_type = isset($_POST['serviceType']) ? clean($_POST['serviceType'], $conn) : NULL;
    $message = isset($_POST['message']) ? clean($_POST['message'], $conn) : NULL;

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO contacts_bookings (form_type, name, phone, email, service_type, message) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $form_type, $name, $phone, $email, $service_type, $message);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Form submitted successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
