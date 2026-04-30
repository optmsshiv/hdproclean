// Wait for the DOM
document.addEventListener("DOMContentLoaded", () => {
  // --- Elements ---
  const contactForm = document.querySelector("#contactForm");

  const contactBtn = document.getElementById("contactSubmitBtn");
  const contactSuccess = document.getElementById("contactSuccessMessage");

  // --- Function to submit contact form via AJAX ---
  function ajaxSubmitContact(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Start loader
      contactBtn.classList.add("loading");
      contactBtn.disabled = true;

      grecaptcha.ready(function () {
        grecaptcha.execute('6Lfv4HgsAAAAABM3fO6ktCVZgPJyBvynkkpBaKtL', { action: 'submit' }).then(function (token) {

          const formData = new FormData(form);
          formData.append("form_type", "contact");
          formData.append("g-recaptcha-response", token);

          fetch("/backened/config/db.php", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              // Stop loader
              contactBtn.classList.remove("loading");
              contactBtn.disabled = false;

              if (data.status === "success") {
                form.reset();

                // Show success message below button
                contactSuccess.innerHTML =
                  "<strong>Thank you!</strong> Your message has been submitted. Our team will contact you shortly.";
                contactSuccess.style.display = "block";

                setTimeout(() => {
                  contactSuccess.style.display = "none";
                }, 4000);
              } else {
                alert(data.message);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("Something went wrong. Please try again.");
              contactBtn.classList.remove("loading");
              contactBtn.disabled = false;
            });
        });
      });
    });
  }

  // Attach AJAX submit to contact form only
  // NOTE: Booking form is fully handled by modal.js — do NOT attach it here
  if (contactForm) ajaxSubmitContact(contactForm);
});