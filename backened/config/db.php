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

         // ---- SEND EMAIL VIA PHPMailer SMTP ----
    require __DIR__ . '/PHPMailer-master/src/PHPMailer.php';
    require __DIR__ . '/PHPMailer-master/src/SMTP.php';
    require __DIR__ . '/PHPMailer-master/src/Exception.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);

    try {
        // SMTP settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'help.listmybusiness@gmail.com';   // <-- your Gmail
        $mail->Password   = 'elei qeff snro dgcc';     // <-- 16-char app password
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Sender & Receiver
        $mail->setFrom('info@hdprocleaning.us', 'HDProClean');
        $mail->addAddress('help.listmybusiness@gmail.com'); // send to yourself

        // Email content
        $mail->isHTML(true);
        $mail->Subject = "New Contact Form Submission - HDProClean";

        $mail->Body = "
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Service:</strong> $service_type</p>
            <p><strong>Message:</strong><br>$message</p>
            <p><hr>Sent on " . date('d M Y, h:i A') . "</p>
        ";

        $mail->Body = $adminBody;
        $mail->send();

        echo json_encode(['status' => 'success', 'message' => 'Form submitted successfully']);
    }
    catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
    // ---- END EMAIL VIA PHPMailer SMTP ----

    } 
    else {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
    }

        // 3️⃣ SEND AUTO-REPLY TO USER (ADD IT HERE)
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

            $reply->setFrom('info@hdprocleaning.us', 'HDProClean');
            $reply->addAddress($email, $name);

            $reply->isHTML(true);
            $reply->Subject = "We Received Your Request – HDProClean";

            $reply->Body = emailTemplate(
                "Thank You for Contacting HDProClean",
                "
                Hi <strong>$name</strong>,<br><br>
                Thank you for reaching out to us. 
                Our team will contact you shortly.<br><br>

                <strong>Your Details:</strong><br>
                Phone: $phone<br>
                Service: $service_type<br><br>

                — HDProClean Support Team
                "
            );

            $reply->send();
        } catch (Exception $e) {
            // Ignore errors
        }
    }

    // 4️⃣ Finally return response to frontend
    echo json_encode([
        'status' => 'success',
        'message' => 'Form submitted successfully'
    ]);

    $stmt->close();
}

$conn->close();
?>
