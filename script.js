/* Portfolio interactions: handles responsive navigation, active section highlighting, and reveal-on-scroll behavior. */
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const revealElements = document.querySelectorAll("[data-reveal]");
const sectionElements = document.querySelectorAll("[data-section]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function closeMenu() {
  if (!navToggle || !navPanel) {
    return;
  }

  navToggle.classList.remove("is-open");
  navPanel.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

function openMenu() {
  if (!navToggle || !navPanel) {
    return;
  }

  navToggle.classList.add("is-open");
  navPanel.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation menu");
}

function toggleMenu() {
  if (!navToggle || !navPanel) {
    return;
  }

  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    closeMenu();
  } else {
    openMenu();
  }
}

function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", isMatch);

    if (isMatch) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if (navToggle) {
  navToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (!navToggle || !navPanel) {
    return;
  }

  const clickedInsideNav = navToggle.contains(event.target) || navPanel.contains(event.target);
  if (!clickedInsideNav) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

if (!prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  {
    threshold: 0,
    rootMargin: "-40% 0px -55% 0px",
  }
);

sectionElements.forEach((section) => sectionObserver.observe(section));

setActiveLink("home");
