document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const modal = document.getElementById("serviceModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const closeModal = document.querySelector(".modal-close");
  const modalBtn = document.querySelector(".modal-btn");

  const bookingPopup = document.getElementById("bookingPopup");
  const closeBooking = document.getElementById("closeBooking");
  const bookingForm = document.getElementById("bookingForm");
  const serviceField = bookingForm.querySelector('input[name="serviceType"]');
  const messageField = bookingForm.querySelector('textarea[name="message"]');

  let currentService = "";

  // Open modal and store service info
  document.querySelectorAll(".view-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      modalTitle.textContent = btn.dataset.title;
      modalDesc.textContent = btn.dataset.desc;
      currentService = btn.dataset.title;
      modal.classList.add("show");
      body.classList.add("popup-open");
    });
  });

  const closeModalFunc = () => {
    modal.classList.remove("show");
    body.classList.remove("popup-open");
  };
  closeModal.addEventListener("click", closeModalFunc);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModalFunc();
  });

  // Open booking popup and pre-fill service type
  modalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModalFunc();
    serviceField.value = currentService;
    messageField.value = currentService;
    bookingPopup.classList.add("show");
    body.classList.add("popup-open");
  });

  const closeBookingFunc = () => {
    bookingPopup.classList.remove("show");
    body.classList.remove("popup-open");
  };
  closeBooking.addEventListener("click", closeBookingFunc);

  bookingPopup.addEventListener("click", (e) => {
    if (e.target === bookingPopup) closeBookingFunc();
  });

  // Handle form submission (SEND TO DATABASE)
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("bookingSubmitBtn");

    // Start loader
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    grecaptcha.ready(function () {
      grecaptcha.execute('6Lfv4HgsAAAAABM3fO6ktCVZgPJyBvynkkpBaKtL', { action: 'submit' }).then(function (token) {

        let formData = new FormData(bookingForm);
        formData.append("form_type", "booking");        // ← FIX: was missing, caused captcha failure
        formData.append("g-recaptcha-response", token);

        fetch("/backened/config/db.php", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            // Stop loader
            submitBtn.classList.remove("loading");
            submitBtn.disabled = false;

            if (data.status === "success") {
              bookingForm.reset();
              window.location.href = "/thank-you.html?type=booking";
            } else {
              alert("Error: " + data.message);
            }
          })
          .catch((err) => {
            submitBtn.classList.remove("loading");
            submitBtn.disabled = false;
            alert("Network error: " + err);
          });
      });
    });
  });
});
// NOTE: The stray successPopup setTimeout that was here has been removed.
// It was firing on page load and could interfere with popup state.