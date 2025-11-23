document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // ===== SERVICE MODAL =====
  const modal = document.getElementById("serviceModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const closeModal = document.querySelector(".modal-close");
  const modalBtn = document.querySelector(".modal-btn");

  document.querySelectorAll(".view-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      modalTitle.textContent = btn.dataset.title;
      modalDesc.textContent = btn.dataset.desc;
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

  // ===== BOOKING POPUP =====
  const bookingPopup = document.getElementById("bookingPopup");
  const closeBooking = document.getElementById("closeBooking");

  modalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModalFunc();
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

  // ===== SUCCESS POPUP =====
  const successPopup = document.getElementById("successPopup");
  const bookingForm = document.getElementById("bookingForm");

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    closeBookingFunc();
    successPopup.classList.add("show");
    setTimeout(() => {
      successPopup.classList.remove("show");
      body.classList.remove("popup-open");
      bookingForm.reset();
    }, 2500);
  });
});
