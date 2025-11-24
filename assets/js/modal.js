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
    messageField.value = currentService; // optional, can be removed if not needed
    bookingPopup.classList.add("show");
    body.classList.add("popup-open");
  });

  const closeBookingFunc = () => {
    bookingPopup.classList.remove("show");
    body.classList.remove("popup-open");
  };
  closeBooking.addEventListener("click", closeBookingFunc);

  console.log("ADDING SUBMIT LISTENER");

  bookingPopup.addEventListener("click", (e) => {
    if (e.target === bookingPopup) closeBookingFunc();
  });

  // Handle form submission
  const successPopup = document.getElementById("successPopup");

  // Handle form submission (SEND TO DATABASE)
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("bookingSubmitBtn");

    // Start loader
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    let formData = new FormData(bookingForm);
    


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
          closeBookingFunc();

          successPopup.classList.add("show");
          body.classList.add("popup-open");

          // Clear form after success
          setTimeout(() => {
            successPopup.classList.remove("show");
            body.classList.remove("popup-open");
            bookingForm.reset();
          }, 2500);
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((err) => {
        alert("Network error: " + err);
      });
  });
});

// Close success popup after 3 seconds
const successPopup = document.getElementById("successPopup");
setTimeout(() => {
  successPopup.classList.remove("show");
}, 3000);
