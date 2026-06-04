/* ---------- NAVBAR INJECT ---------- */
(function () {
  const navPlaceholder = document.getElementById("navbar");
  if (!navPlaceholder || navPlaceholder.children.length > 0) return;

  fetch("/components/navbar.html")
    .then(res => {
      if (!res.ok) throw new Error("navbar.html not found");
      return res.text();
    })
    .then(html => {
      // Replace placeholder div with actual <nav> content
      const temp = document.createElement("div");
      temp.innerHTML = html;
      const nav = temp.querySelector("nav") || temp.firstElementChild;
      if (nav) {
        // Copy id and classes from placeholder to nav
        nav.id = "navbar";
        navPlaceholder.replaceWith(nav);
      }

      // Re-init mobile menu after inject
      const mobileMenuBtn = document.getElementById("mobileMenu");
      const navLinksEl = document.querySelector(".nav-links");
      if (mobileMenuBtn && navLinksEl) {
        mobileMenuBtn.addEventListener("click", () => {
          navLinksEl.classList.toggle("show");
          const expanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
          mobileMenuBtn.setAttribute("aria-expanded", !expanded);
        });
      }

      // Re-init dropdown toggles for mobile after inject
      document.querySelectorAll('.has-dropdown > a, .has-submenu > a').forEach(link => {
        link.addEventListener('click', function (e) {
          if (window.innerWidth <= 900) {
            e.preventDefault();
            const parent = this.parentElement;
            const isOpen = parent.classList.contains('open');
            parent.parentElement.querySelectorAll(':scope > li.open').forEach(li => {
              if (li !== parent) {
                li.querySelectorAll('.open').forEach(n => n.classList.remove('open'));
                li.classList.remove('open');
              }
            });
            if (isOpen) {
              parent.querySelectorAll('.open').forEach(n => n.classList.remove('open'));
              parent.classList.remove('open');
            } else {
              parent.classList.add('open');
            }
          }
        });
      });

      // Mark active nav link based on current page
      const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
      document.querySelectorAll(".nav-links a").forEach(a => {
        const linkPath = new URL(a.href, window.location.origin).pathname.replace(/\/$/, "");
        if (linkPath === currentPath) a.classList.add("active");
      });
    })
    .catch(err => console.warn("Navbar inject failed:", err));
})();

/* ---------- PRELOADER ---------- */
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  if (!pre) return;
  pre.style.opacity = "0";
  setTimeout(() => (pre.style.display = "none"), 450);
});

/* ---------- DYNAMIC YEAR ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- SMOOTH SCROLL---------- 
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
    // Close mobile menu on click
    const navLinks = document.querySelector(".nav-links");
    navLinks && navLinks.classList.remove("show");
  });
}); */

/* ---------- SMOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

  anchor.addEventListener("click", function (e) {

    const href = this.getAttribute("href");

    // Ignore empty or "#" links
    if (!href || href === "#") return;

    const target = document.querySelector(href);

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth"
    });

    // Close mobile menu
    const navLinks = document.querySelector(".nav-links");

    if (navLinks) {
      navLinks.classList.remove("show");
    }

  });

});


/* ---------- MOBILE MENU TOGGLE ---------- */
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.querySelector(".nav-links");
if (mobileMenu && navLinks) {
  mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    const expanded = mobileMenu.getAttribute("aria-expanded") === "true";
    mobileMenu.setAttribute("aria-expanded", !expanded);
  });
}

/* ---------- NAVBAR SHRINK ON SCROLL 
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  if (window.scrollY > 90) {
    navbar.classList.add("shrink");
    gsap.to(navbar, { padding: "0.45rem 2rem", duration: 0.25 });
  } else {
    navbar.classList.remove("shrink");
    gsap.to(navbar, { padding: "1.1rem 2rem", duration: 0.25 });
  }
}); ---------- */

/* ---------- MOBILE DROPDOWN TOGGLE ---------- */
document.querySelectorAll('.has-dropdown > a, .has-submenu > a').forEach(link => {
  link.addEventListener('click', function (e) {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      const parent = this.parentElement;
      const isOpen = parent.classList.contains('open');

      // Close all siblings and their nested open children
      parent.parentElement.querySelectorAll(':scope > li.open').forEach(li => {
        if (li !== parent) {
          li.querySelectorAll('.open').forEach(n => n.classList.remove('open'));
          li.classList.remove('open');
        }
      });

      // Toggle current — if closing, clear its nested open children too
      if (isOpen) {
        parent.querySelectorAll('.open').forEach(n => n.classList.remove('open'));
        parent.classList.remove('open');
      } else {
        parent.classList.add('open');
      }
    }
  });
});

// Close dropdowns when clicking outside (desktop)
document.addEventListener('click', function (e) {
  if (!e.target.closest('.has-dropdown')) {
    document.querySelectorAll('.has-dropdown.open, .has-submenu.open').forEach(el => {
      el.classList.remove('open');
    });
  }
});

// Close dropdowns on mobile menu close
if (mobileMenu && navLinks) {
  mobileMenu.addEventListener('click', () => {
    // Reset all open dropdowns when hamburger closes the menu
    if (!navLinks.classList.contains('show')) {
      document.querySelectorAll('.has-dropdown.open, .has-submenu.open').forEach(el => {
        el.classList.remove('open');
      });
    }
  });
}

/* ---------- NAVBAR SHRINK ON SCROLL ---------- */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (!navbar) return;

  if (window.scrollY > 90) {
    navbar.classList.add("shrink");
  } else {
    navbar.classList.remove("shrink");
  }
});


/* ---------- GSAP ANIMATIONS ---------- */
if (typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // hero
  gsap.from(".hero h1", { opacity: 0, y: 40, duration: 1 });
  gsap.from(".hero p", { opacity: 0, y: 20, duration: 1, delay: 0.25 });

  // Reveal sections
  gsap.utils
    .toArray(".section, .how-we-work, .service-vehicle, .about-section")
    .forEach((section) => {
      gsap.from(section, {
        scrollTrigger: { trigger: section, start: "top 80%" },
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power2.out",
      });
    });

  // service cards stagger
  gsap.from(".service-card", {
    scrollTrigger: { trigger: ".service-container", start: "top 85%" },
    opacity: 0,
    y: 30,
    stagger: 0.12,
    duration: 0.7,
    ease: "power2.out",
  });


  // logo track — only animate if element exists
  if (document.querySelector(".logo-track")) {
    gsap.to(".logo-track", {
      repeat: -1,
      xPercent: -50,
      ease: "none",
      duration: 18,
    });
  }
}

/* ---------- TESTIMONIAL SLIDER ---------- */
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prevTest");
  const nextBtn = document.getElementById("nextTest");
  const dotsWrap = document.getElementById("dots");
  if (!slides.length || !dotsWrap) return;

  let idx = 0;
  let timer = null;

  // Create dots
  slides.forEach((slide, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.dataset.index = i;
    dotsWrap.appendChild(d);
    d.addEventListener("click", () => showSlide(i));
  });

  function showSlide(n) {
    slides.forEach(s => s.classList.remove("active"));
    Array.from(dotsWrap.children).forEach(d => d.classList.remove("active"));
    slides[n].classList.add("active");
    dotsWrap.children[n].classList.add("active");
    idx = n;
    resetTimer();
  }

  function next() { showSlide((idx + 1) % slides.length); }
  function prev() { showSlide((idx - 1 + slides.length) % slides.length); }

  nextBtn && nextBtn.addEventListener("click", next);
  prevBtn && prevBtn.addEventListener("click", prev);

  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 3500);
  }
  resetTimer();

  // Optional: Swipe support for mobile
  let startX = 0;
  const slider = document.getElementById("testimonialSlider");
  if (slider) {
    slider.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
    slider.addEventListener("touchend", e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (diff > 50) prev();
      else if (diff < -50) next();
    });
  }
})();

/* ---------- CLIENT LOGO CAROUSEL PAUSE ON HOVER ---------- */
(function () {
  const track = document.querySelector(".logo-track");
  if (!track) return;
  track.addEventListener("mouseenter", () => (track.style.animationPlayState = "paused"));
  track.addEventListener("mouseleave", () => (track.style.animationPlayState = "running"));
})();