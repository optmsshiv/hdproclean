// Wait for the DOM
document.addEventListener("DOMContentLoaded", () => {
  // --- Elements ---
  const contactForm = document.querySelector("#contactForm"); // FIXED
  const bookingForm = document.getElementById("bookingForm");
  const bookingPopup = document.getElementById("bookingPopup");
  const successPopup = document.getElementById("successPopup");
  const closeBooking = document.getElementById("closeBooking");

  const contactBtn = document.getElementById("contactSubmitBtn");
  const contactSuccess = document.getElementById("contactSuccessMessage");

  // Close booking popup
  if (closeBooking) {
    closeBooking.addEventListener("click", () => {
      bookingPopup.style.display = "none";
    });
  }

  function ajaxSubmit(form, formType) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

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
        .then((res) => res.json())
        .then((data) => {
          if (formType === "contact") {
            contactBtn.classList.remove("loading");
            contactBtn.disabled = false;
          }

          if (data.status === "success") {
            form.reset();

            if (formType === "contact") {
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
        .catch((err) => {
          alert("Something went wrong. Try again.");

          if (formType === "contact") {
            contactBtn.classList.remove("loading");
            contactBtn.disabled = false;
          }
        });
    });
  }

  if (contactForm) ajaxSubmit(contactForm, "contact");
  if (bookingForm) ajaxSubmit(bookingForm, "booking");
});
