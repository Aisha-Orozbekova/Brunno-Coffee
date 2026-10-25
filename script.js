// Mobile navigation can be opened with the menu button and closes after a link is chosen.
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("is-open");
  });
});

// The selected theme is remembered on this device between visits.
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeIcon = document.querySelector(".theme-icon");
const savedTheme = localStorage.getItem("bruno-coffee-theme");

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  themeLabel.textContent = isDark ? "Light" : "Dark";
  themeIcon.textContent = isDark ? "☼" : "◐";
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  themeToggle.setAttribute("title", `Switch to ${isDark ? "light" : "dark"} theme`);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", isDark ? "#211a16" : "#f8f3ed");
}

setTheme(savedTheme === "dark" ? "dark" : "light");
themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("bruno-coffee-theme", nextTheme);
});

// Menu buttons show only the matching drinks and expose their selected state.
const filterButtons = document.querySelectorAll(".filter-button");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    menuCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

// Validate the demo form accessibly; this page does not send or store submissions.
const contactForm = document.querySelector("#contact-form");
const formSuccess = document.querySelector("#form-success");
const formFields = [
  { input: document.querySelector("#name"), error: document.querySelector("#name-error"), message: "Please enter at least 2 characters." },
  { input: document.querySelector("#email"), error: document.querySelector("#email-error"), message: "Please enter a valid email address." },
  { input: document.querySelector("#message"), error: document.querySelector("#message-error"), message: "Please enter at least 10 characters." },
];

function validateField(field) {
  const { input, error, message } = field;
  const valid = input.checkValidity() && input.value.trim().length >= Number(input.getAttribute("minlength") || 0);
  input.setAttribute("aria-invalid", String(!valid));
  error.textContent = valid ? "" : message;
  return valid;
}

formFields.forEach((field) => {
  field.input.addEventListener("input", () => {
    if (field.input.hasAttribute("aria-invalid")) validateField(field);
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formSuccess.hidden = true;
  const isValid = formFields.map(validateField).every(Boolean);
  if (!isValid) {
    formFields.find((field) => field.input.getAttribute("aria-invalid") === "true").input.focus();
    return;
  }
  contactForm.reset();
  formFields.forEach(({ input }) => input.removeAttribute("aria-invalid"));
  formSuccess.hidden = false;
});

// Keep the up-arrow out of the way until the visitor has scrolled down.
const backToTop = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => {
  backToTop.hidden = window.scrollY < 500;
}, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelector("#current-year").textContent = new Date().getFullYear();