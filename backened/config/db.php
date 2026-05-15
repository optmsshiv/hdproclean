<?php

header("Content-Type: application/json");

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

// ─── Database credentials ───────────────────────────────────────────────────
$host = "localhost";
$db   = "edrppymy_hdprocleaning";
$user = "edrppymy_hdproclean";
$pass = "135#@Hdproclean";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Server error. Please try again later.']);
    exit;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function clean($data, $conn) {
    return htmlspecialchars($conn->real_escape_string(trim($data)));
}

function emailTemplate($title, $content) {
    $year = date("Y");
    return "
    <div style='background:#f5f7fa;padding:30px;font-family:Arial,sans-serif;color:#333;'>
        <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #ddd;'>

            <div style='background:#01c3cc;padding:20px;text-align:center;'>
                <img src='https://hdproclean.us/assets/logo/main_logo.png' style='max-width:160px;'>
            </div>

            <div style='padding:25px;'>
                <h2 style='margin-top:0;color:#0b2540;'>$title</h2>
                <p style='font-size:15px;line-height:1.6;'>$content</p>
            </div>

            <div style='background:#f0f3f7;padding:15px;text-align:center;font-size:13px;color:#666;'>
                © $year HD Pro Cleaning — Professional Cleaning Services
            </div>

        </div>
    </div>";
}

// ─── Only handle POST ────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

// ─── reCAPTCHA verification ──────────────────────────────────────────────────
$captcha   = $_POST['g-recaptcha-response'] ?? '';
$secretKey = "6Lfv4HgsAAAAAG6jijncVeixGbxBVor1Jj0xAsOs";
$verify    = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$captcha}");
$captchaData = json_decode($verify);

if (!$captchaData->success || $captchaData->score < 0.5) {
    echo json_encode(['status' => 'error', 'message' => 'Captcha verification failed']);
    exit;
}

// ─── Security firewall ───────────────────────────────────────────────────────
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

// Honeypot
if (!empty($_POST['website'])) {
    echo json_encode(['status' => 'error', 'message' => 'Bot detected']);
    exit;
}

// Token check
if (($_POST['form_token'] ?? '') !== md5('hdproclean_secure')) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit;
}

// Spam keyword filter
$spamWords = ['viagra', 'casino', 'crypto', 'loan', 'sex', 'porn'];
foreach ($spamWords as $word) {
    if (stripos($_POST['message'] ?? '', $word) !== false) {
        echo json_encode(['status' => 'error', 'message' => 'Spam blocked']);
        exit;
    }
}

// Rate limit — 1 request per 30 seconds per IP
$rateDir      = sys_get_temp_dir() . '/hdproclean_limits';
if (!is_dir($rateDir)) {
    mkdir($rateDir, 0700, true);
}
$cooldownFile = $rateDir . '/rate_' . md5($ip) . '.txt';

if (file_exists($cooldownFile) && (time() - (int)file_get_contents($cooldownFile)) < 30) {
    echo json_encode(['status' => 'error', 'message' => 'Please wait before submitting again.']);
    exit;
}
file_put_contents($cooldownFile, time());

// ─── Sanitize inputs ─────────────────────────────────────────────────────────
$form_type    = clean($_POST['form_type']    ?? 'contact', $conn);
$name         = clean($_POST['name']         ?? '', $conn);
$phone        = clean($_POST['phone']        ?? '', $conn);
$email        = clean($_POST['email']        ?? '', $conn);
$service_type = clean($_POST['serviceType']  ?? '', $conn);
$message      = clean($_POST['message']      ?? '', $conn);

// ─── Insert into database ────────────────────────────────────────────────────
$stmt = $conn->prepare(
    "INSERT INTO contacts_bookings (form_type, name, phone, email, service_type, message)
     VALUES (?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("ssssss", $form_type, $name, $phone, $email, $service_type, $message);

if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Could not save your request. Please try again.']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// ─── Email limit per IP (max 5 emails) ───────────────────────────────────────
$emailLimitFile = $rateDir . '/mail_limit_' . md5($ip) . '.txt';
$emailCount     = file_exists($emailLimitFile) ? (int)file_get_contents($emailLimitFile) : 0;

if ($emailCount > 5) {
    echo json_encode(['status' => 'success', 'message' => 'Saved without email']);
    $conn->close();
    exit;
}
file_put_contents($emailLimitFile, $emailCount + 1);

// ─── Load PHPMailer ───────────────────────────────────────────────────────────
require __DIR__ . '/../../PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../../PHPMailer/src/SMTP.php';
require __DIR__ . '/../../PHPMailer/src/Exception.php';

// ─── SMTP config helper ───────────────────────────────────────────────────────
function makeSMTP() {
    $m = new PHPMailer\PHPMailer\PHPMailer(true);
    $m->isSMTP();
    $m->Host       = 'smtp.gmail.com';
    $m->SMTPAuth   = true;
    $m->Username   = 'cleanduct88@gmail.com';
    $m->Password   = 'xcll nhxm lnfn dciw';
    $m->SMTPSecure = 'tls';
    $m->Port       = 587;
    return $m;
}

// ─── 1. Admin notification email ─────────────────────────────────────────────
try {
    $mail = makeSMTP();
    $mail->setFrom('no-reply@hdproclean.us', 'HD Pro Cleaning');
    $mail->addAddress('cleanduct88@gmail.com', 'HD Pro Cleaning');
    $mail->isHTML(true);
    $mail->Subject = "New Submission — HD Pro Cleaning";
    $mail->Body    = emailTemplate(
        "New {$form_type} Request",
        "<strong>Name:</strong> {$name}<br>
         <strong>Phone:</strong> {$phone}<br>
         <strong>Email:</strong> {$email}<br>
         <strong>Service:</strong> {$service_type}<br><br>
         <strong>Message:</strong><br>{$message}"
    );
    $mail->send();
} catch (Exception $e) {
    error_log("Admin email failed: " . $e->getMessage());
}

// ─── 2. Auto-reply to user ────────────────────────────────────────────────────
if (!empty($email)) {
    try {
        $reply = makeSMTP();
        $reply->setFrom('cleanduct88@gmail.com', 'HD Pro Cleaning');
        $reply->addReplyTo('cleanduct88@gmail.com', 'HD Pro Cleaning');
        $reply->addAddress($email, $name);
        $reply->isHTML(true);
        $reply->Subject = "We Received Your Request — HD Pro Cleaning";
        $reply->Body    = emailTemplate(
            "Thank You for Contacting HD Pro Cleaning",
            "Hi <strong>{$name}</strong>,<br><br>
             Thank you for reaching out! We have received your request and our team will get in touch with you within <strong>24 hours</strong>.<br><br>
             <strong>Your Submitted Details:</strong><br>
             📞 Phone: {$phone}<br>
             🛠️ Service: {$service_type}<br><br>
             If you need immediate assistance, feel free to call us directly at <strong>+1 718-360-0226</strong>.<br><br>
             — HD Pro Cleaning Support Team<br>
             <a href='https://hdproclean.us' style='color:#01c3cc;'>hdproclean.us</a>"
        );
        $reply->send();
    } catch (Exception $e) {
        error_log("User auto-reply failed: " . $e->getMessage());
    }
}

// ─── Done ─────────────────────────────────────────────────────────────────────
echo json_encode(['status' => 'success', 'message' => 'Form submitted successfully']);
$conn->close();
?>