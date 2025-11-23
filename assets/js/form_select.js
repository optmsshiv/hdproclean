
// Wait for the DOM
document.addEventListener("DOMContentLoaded", () => {
    // --- Elements ---
    const contactForm = document.querySelector("#contact form");
    const bookingForm = document.getElementById("bookingForm");
    const bookingPopup = document.getElementById("bookingPopup");
    const successPopup = document.getElementById("successPopup");
    const closeBooking = document.getElementById("closeBooking");

    // --- Close booking popup ---
    closeBooking.addEventListener("click", () => {
        bookingPopup.style.display = "none";
    });

    // --- Function to submit forms via AJAX ---
    function ajaxSubmit(form, formType) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            formData.append("form_type", formType); // add form_type for PHP

            fetch("/backened/config/db.php", {
              // replace with your PHP file path
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === "success") {
                  // Reset form
                  form.reset();

                  // Close booking popup if it's the booking form
                  if (formType === "booking")
                    bookingPopup.style.display = "none";

                  // Show success popup
                  successPopup.style.display = "flex";

                  // Hide success popup after 3 seconds
                  setTimeout(() => {
                    successPopup.style.display = "none";
                  }, 3000);
                } else {
                  alert(data.message);
                }
              })
              .catch((error) => {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
              });
        });
    }

    // --- Attach AJAX submit to both forms ---
    if (contactForm) ajaxSubmit(contactForm, "contact");
    if (bookingForm) ajaxSubmit(bookingForm, "booking");
});

