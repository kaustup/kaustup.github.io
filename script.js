// Theme toggle
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;
const scrollBtn = document.getElementById("scroll-top");

// Load saved theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
}

// Toggle dark/light mode
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    const mode = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", mode);
  });
}

// Scroll to top button
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }

  // Fade in elements on scroll
  document.querySelectorAll(".fade-in").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
});

if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
