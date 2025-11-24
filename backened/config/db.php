<?php

header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database credentials
$host = "localhost";
$db   = "edrppymy_hdprocleaning";
$user = "edrppymy_hdproclean";
$pass = "123@Hdproclean";

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Sanitize input
function clean($data, $conn) {
    return htmlspecialchars($conn->real_escape_string(trim($data)));
}

// HTML Email Template
function emailTemplate($title, $content) {
    return "
    <div style='background:#f5f7fa;padding:30px;font-family:Arial,sans-serif;color:#333;'>
        <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #ddd;'>

            <div style='background:#e5e5e5;padding:20px;text-align:center;'>
                <img src='https://hdproclean.us/assets/logo/logo.png' style='max-width:160px;'>
            </div>

            <div style='padding:25px;'>
                <h2 style='margin-top:0;color:#0b2540;'>$title</h2>
                <p style='font-size:15px;line-height:1.6;'>$content</p>
            </div>

            <div style='background:#f0f3f7;padding:15px;text-align:center;font-size:13px;color:#666;'>
                © " . date("Y") . " HDProClean — Professional Cleaning Services
            </div>

        </div>
    </div>";
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $form_type = isset($_POST['form_type']) ? clean($_POST['form_type'], $conn) : 'contact';

    $name         = clean($_POST['name']      ?? '', $conn);
    $phone        = clean($_POST['phone']     ?? '', $conn);
    $email        = clean($_POST['email']     ?? '', $conn);
    $service_type = clean($_POST['serviceType'] ?? '', $conn);
    $message      = clean($_POST['message']   ?? '', $conn);

    // Insert into DB
    $stmt = $conn->prepare("INSERT INTO contacts_bookings (form_type, name, phone, email, service_type, message)
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $form_type, $name, $phone, $email, $service_type, $message);

    if ($stmt->execute()) {

        // Load PHPMailer
        require __DIR__ . '/../../PHPMailer/src/PHPMailer.php';
        require __DIR__ . '/../../PHPMailer/src/SMTP.php';
        require __DIR__ . '/../../PHPMailer/src/Exception.php';

        // -------------------------
        // 1️⃣ SEND ADMIN EMAIL
        // -------------------------
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'help.listmybusiness@gmail.com';
            $mail->Password   = 'elei qeff snro dgcc';
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;

            $mail->setFrom('no-reply@hdproclean.us', 'HDProClean');
            $mail->addAddress('help.listmybusiness@gmail.com');

            $mail->isHTML(true);
            $mail->Subject = "New Contact Submission  HDProClean";

            $adminBody = emailTemplate(
                "New Contact Request",
                "
                <strong>Name:</strong> $name<br>
                <strong>Phone:</strong> $phone<br>
                <strong>Email:</strong> $email<br>
                <strong>Service:</strong> $service_type<br><br>
                <strong>Message:</strong><br>$message
                "
            );

            $mail->Body = $adminBody;
            $mail->send();
        } catch (Exception $e) {}


        // -------------------------
        // 2️⃣ AUTO-REPLY TO USER
        // -------------------------
        if (!empty($email)) {

            $reply = new PHPMailer\PHPMailer\PHPMailer(true);

            try {
                $reply->isSMTP();
                $reply->Host       = 'smtp.gmail.com';
                $reply->SMTPAuth   = true;
                $reply->Username   = 'help.listmybusiness@gmail.com';
                $reply->Password   = 'elei qeff snro dgcc';
                $reply->SMTPSecure = 'tls';
                $reply->Port       = 587;

                $reply->setFrom('info@hdproclean.us', 'HDProClean');
                $reply->addAddress($email, $name);

                $reply->isHTML(true);
                $reply->Subject = "We Received Your Request  HDProClean";

                $replyBody = emailTemplate(
                    "Thank You for Contacting HDProClean",
                    "
                    Hi <strong>$name</strong>,<br><br>
                    Thank you for contacting us.<br>
                    Our team will get in touch with you soon.<br><br>

                    <strong>Your Details:</strong><br>
                    Phone: $phone<br>
                    Service: $service_type<br><br>

                    — HDProClean Support Team
                    "
                );

                $reply->Body = $replyBody;
                $reply->send();

            } catch (Exception $e) {}
        }

        // Single output
        echo json_encode(['status' => 'success', 'message' => 'Form submitted successfully']);
    }
    else {
        echo json_encode(['status' => 'error', 'message' => 'Database error: '.$stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
