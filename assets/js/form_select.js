document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector("#contactForm");
  const bookingForm = document.getElementById("bookingForm");
  const bookingPopup = document.getElementById("bookingPopup");
  const successPopup = document.getElementById("successPopup");
  const closeBooking = document.getElementById("closeBooking");

  const contactBtn = document.getElementById("contactSubmitBtn");
  const contactSuccess = document.getElementById("contactSuccessMessage");

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

            if (formType === "booking") {
              bookingPopup.style.display = "none";
              successPopup.style.display = "flex";
              setTimeout(() => {
                successPopup.style.display = "none";
              }, 3000);
            }

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
          console.error(err);
          alert("Something went wrong. Please try again.");
        });
    });
  }

  if (contactForm) ajaxSubmit(contactForm, "contact");
  if (bookingForm) ajaxSubmit(bookingForm, "booking");
});
