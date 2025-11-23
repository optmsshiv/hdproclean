// Wait for the DOM
document.addEventListener("DOMContentLoaded", () => {
  // --- Elements ---
  const contactForm = document.querySelector("#contactForm");
  const bookingForm = document.getElementById("bookingForm");
  const bookingPopup = document.getElementById("bookingPopup");
  const successPopup = document.getElementById("successPopup");
  const closeBooking = document.getElementById("closeBooking");

  const contactBtn = document.getElementById("contactSubmitBtn");
  const contactSuccess = document.getElementById("contactSuccessMessage");

  // --- Close booking popup ---
  closeBooking.addEventListener("click", () => {
    bookingPopup.style.display = "none";
  });

  // --- Function to submit forms via AJAX ---
  function ajaxSubmit(form, formType) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Start loader only for contact form
      if (formType === "contact") {
        contactBtn.classList.add("loading");
        contactBtn.disabled = true;
      }

      const formData = new FormData(form);
      formData.append("form_type", formType);

      fetch("/backened/config/db.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Stop loader for contact form
          if (formType === "contact") {
            contactBtn.classList.remove("loading");
            contactBtn.disabled = false;
          }

          if (data.status === "success") {
            form.reset();

            if (formType === "booking") {
              bookingPopup.style.display = "none";
              successPopup.style.display = "flex";

              setTimeout(() => {
                successPopup.style.display = "none";
              }, 3000);
            } else if (formType === "contact") {
              // Show success message below button
              contactSuccess.innerHTML =
                "<strong>Thank you!</strong> Your message has been submitted. Our team will contact you shortly.";
              contactSuccess.style.display = "block";

              setTimeout(() => {
                contactSuccess.style.display = "none";
              }, 4000);
            }
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Something went wrong. Please try again.");

          if (formType === "contact") {
            contactBtn.classList.remove("loading");
            contactBtn.disabled = false;
          }
        });
    });
  }

  // Attach AJAX submit to both forms
  if (contactForm) ajaxSubmit(contactForm, "contact");
  if (bookingForm) ajaxSubmit(bookingForm, "booking");
});
