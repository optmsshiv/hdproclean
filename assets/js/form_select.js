document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector("#contactForm");
  const bookingForm = document.getElementById("bookingForm");

  const contactBtn = document.getElementById("contactSubmitBtn");
  const contactSuccess = document.getElementById("contactSuccessMessage");

  function ajaxSubmit(form, formType) {
    if (!form) return;

    console.log("AJAX attached to", formType);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("FORM SUBMITTED VIA AJAX");

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
          console.log("SERVER RESPONSE:", data);

          if (formType === "contact") {
            contactBtn.classList.remove("loading");
            contactBtn.disabled = false;
          }

          if (data.status === "success") {
            form.reset();
            contactSuccess.innerHTML =
              "<strong>Thank you!</strong> Your message has been submitted.";
            contactSuccess.style.display = "block";

            setTimeout(() => {
              contactSuccess.style.display = "none";
            }, 4000);
          }
        })
        .catch((err) => {
          console.log("ERROR:", err);
        });
    });
  }

  ajaxSubmit(contactForm, "contact");
  ajaxSubmit(bookingForm, "booking");
});
