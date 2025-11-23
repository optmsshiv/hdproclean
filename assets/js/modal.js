// ==== MODAL POPUP ====
const modal = document.getElementById("serviceModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const closeModal = document.querySelector(".modal-close");

document.querySelectorAll(".view-details").forEach((btn) => {
  btn.addEventListener("click", () => {
    modalTitle.textContent = btn.dataset.title;
    modalDesc.textContent = btn.dataset.desc;

    modal.classList.add("show");
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});

 // Ripple effect for "Get a quote" button
const button = document.querySelector(".book-now");

button.addEventListener("click", function (e) {
  const ripple = document.createElement("span");
  ripple.classList.add("ripple");

  const rect = button.getBoundingClientRect();
  ripple.style.left = e.clientX - rect.left + "px";
  ripple.style.top = e.clientY - rect.top + "px";

  button.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
});

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("shrink");
  } else {
    navbar.classList.remove("shrink");
  }
});


