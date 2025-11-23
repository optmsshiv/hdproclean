/* ---------- PRELOADER ---------- */
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  if (!pre) return;
  pre.style.opacity = "0";
  setTimeout(() => (pre.style.display = "none"), 450);
});

/* ---------- YEAR ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- MOBILE MENU ---------- */
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.querySelector(".nav-links");
if (mobileMenu && navLinks) {
  mobileMenu.addEventListener("click", () => navLinks.classList.toggle("show"));
  // close menu on link click
  navLinks
    .querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("show"))
    );
}

/* ---------- NAVBAR SHRINK ON SCROLL ---------- */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  if (window.scrollY > 90) navbar.classList.add("shrink");
  else navbar.classList.remove("shrink");
});

/* ---------- GSAP ANIMATIONS ---------- */
if (typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // hero
  gsap.from(".hero h1", { opacity: 0, y: 40, duration: 1 });
  gsap.from(".hero p", { opacity: 0, y: 20, duration: 1, delay: 0.25 });

  // reveal sections
  gsap.utils.toArray(".section").forEach((section) => {
    gsap.from(section, {
      scrollTrigger: { trigger: section, start: "top 80%" },
      opacity: 0,
      y: 30,
      duration: 0.9,
    });
  });

  // service cards stagger
  gsap.from(".service-card", {
    scrollTrigger: { trigger: ".service-container", start: "top 85%" },
    opacity: 0,
    y: 30,
    stagger: 0.12,
    duration: 0.7,
  });

  // logo track speed little bounce
  gsap.to(".logo-track", {
    repeat: -1,
    xPercent: -50,
    ease: "none",
    duration: 18,
  });
}

/* ---------- TESTIMONIAL SLIDER (auto + manual + dots) ---------- */
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prevTest");
  const nextBtn = document.getElementById("nextTest");
  const dotsWrap = document.getElementById("dots");
  if (!slides.length || !dotsWrap) return;

  let idx = 0;
  let timer = null;

  // create dots
  slides.forEach((s, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.dataset.index = i;
    dotsWrap.appendChild(d);
    d.addEventListener("click", () => showSlide(i));
  });

  function showSlide(n) {
    slides.forEach((s) => s.classList.remove("active"));
    Array.from(dotsWrap.children).forEach((d) => d.classList.remove("active"));
    slides[n].classList.add("active");
    dotsWrap.children[n].classList.add("active");
    idx = n;
    resetTimer();
  }

  function next() {
    showSlide((idx + 1) % slides.length);
  }
  function prev() {
    showSlide((idx - 1 + slides.length) % slides.length);
  }

  nextBtn && nextBtn.addEventListener("click", next);
  prevBtn && prevBtn.addEventListener("click", prev);

  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 3500);
  }
  resetTimer();
})();

/* ---------- CLIENT LOGO CAROUSEL PAUSE ON HOVER ---------- */
(function () {
  const track = document.querySelector(".logo-track");
  if (!track) return;
  track.addEventListener(
    "mouseenter",
    () => (track.style.animationPlayState = "paused")
  );
  track.addEventListener(
    "mouseleave",
    () => (track.style.animationPlayState = "running")
  );
})();



