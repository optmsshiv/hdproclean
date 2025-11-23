// Wait for the DOM
document.addEventListener("DOMContentLoaded", () => {
  // --- Elements (safe queries) ---
  const contactForm = document.querySelector("#contactForm");
  const bookingForm = document.getElementById("bookingForm");
  const bookingPopup = document.getElementById("bookingPopup");
  const successPopup = document.getElementById("successPopup");
  const closeBooking = document.getElementById("closeBooking");

  const contactBtn = document.getElementById("contactSubmitBtn");
  const contactSuccess = document.getElementById("contactSuccessMessage");

  // Helper: safely add listener
  const safeOn = (el, evt, fn) => {
    if (el) el.addEventListener(evt, fn);
  };

  // --- Close booking popup (guarded) ---
  safeOn(closeBooking, "click", () => {
    if (bookingPopup) bookingPopup.style.display = "none";
  });

  // If bookingPopup exists, close when clicking overlay background
  if (bookingPopup) {
    safeOn(bookingPopup, "click", (e) => {
      if (e.target === bookingPopup) bookingPopup.style.display = "none";
    });
  }

  // --- Function to start/stop loader safely ---
  function startLoader(btn) {
    if (!btn) return;
    btn.classList.add("loading");
    btn.disabled = true;
  }
  function stopLoader(btn) {
    if (!btn) return;
    btn.classList.remove("loading");
    btn.disabled = false;
  }

  // --- Function to submit forms via AJAX (robust) ---
  function ajaxSubmit(form, formType) {
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Start loader only for contact form (if button exists)
      if (formType === "contact") startLoader(contactBtn);

      const formData = new FormData(form);
      // ensure form_type is present (your hidden input already does this but keep for safety)
      if (!formData.has("form_type")) formData.append("form_type", formType);

      fetch("/backened/config/db.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          // If server returns non-JSON, this will throw; handle that
          return response.json();
        })
        .then((data) => {
          // Stop loader for contact form
          if (formType === "contact") stopLoader(contactBtn);

          if (data && data.status === "success") {
            form.reset();

            if (formType === "booking") {
              // hide popup and show popup success if available
              if (bookingPopup) bookingPopup.style.display = "none";
              if (successPopup) {
                successPopup.style.display = "flex";
                setTimeout(() => {
                  successPopup.style.display = "none";
                }, 3000);
              }
            } else if (formType === "contact") {
              // Show success message below button (create fallback if missing)
              if (contactSuccess) {
                contactSuccess.innerHTML =
                  "<strong>Thank you!</strong> Your message has been submitted. Our team will contact you shortly.";
                contactSuccess.style.display = "block";
                setTimeout(() => {
                  contactSuccess.style.display = "none";
                }, 4000);
              } else {
                // fallback alert if container missing
                alert("Thank you! Your message was submitted.");
              }
            }
          } else {
            // server returned status error
            const msg = data && data.message ? data.message : "Server error";
            alert(msg);
            if (formType === "contact") stopLoader(contactBtn);
          }
        })
        .catch((error) => {
          console.error("AJAX error:", error);
          alert("Something went wrong. Please try again.");

          if (formType === "contact") stopLoader(contactBtn);
        });
    });
  }

  // Attach AJAX submit to both forms (only if they exist)
  ajaxSubmit(contactForm, "contact");
  ajaxSubmit(bookingForm, "booking");
});
