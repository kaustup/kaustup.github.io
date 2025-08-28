// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Load saved theme
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
  // Try autoplay on page load
  const music = document.getElementById("bg-music");
  if (music) {
    music.play().catch(() => {
      console.warn("Autoplay blocked. User interaction required.");
    });
  }
});

// Scroll to top button
const scrollBtn = document.getElementById("scroll-top");
window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 200 ? "block" : "none";
});
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Fade-in on scroll
const fadeIns = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.1 });
fadeIns.forEach(el => observer.observe(el));

// Music toggle
const musicToggle = document.getElementById("music-toggle");
const music = document.getElementById("bg-music");
musicToggle.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicToggle.textContent = "🔊"; // Change icon to indicate music is playing
  } else {
    music.pause();
    musicToggle.textContent = "🔇"; // Change icon to indicate music is paused
  }
});

// Modal functionality
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

// Dev Login Panel Functions
function openDevLogin() {
  document.getElementById("dev-login-overlay").style.display = "flex";
  document.getElementById("devPasswordInput").focus();
}

function closeDevLogin() {
  document.getElementById("dev-login-overlay").style.display = "none";
  resetDevLogin();
}

function checkDevPassword() {
  const password = document.getElementById("devPasswordInput").value;
  const errorMessage = document.getElementById("devErrorMessage");
  const loginContainer = document.getElementById("devLoginContainer");
  const devPanel = document.getElementById("devPanel");
  
  if (password === "4153") {
    // Correct password
    loginContainer.style.display = "none";
    devPanel.classList.add("active");
    errorMessage.classList.remove("show");
  } else {
    // Wrong password
    errorMessage.classList.add("show");
    document.getElementById("devPasswordInput").value = "";
    
    // Shake animation for error feedback
    loginContainer.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      loginContainer.style.animation = "";
    }, 500);
  }
}

function backToLogin() {
  const loginContainer = document.getElementById("devLoginContainer");
  const devPanel = document.getElementById("devPanel");
  
  devPanel.classList.remove("active");
  loginContainer.style.display = "block";
  document.getElementById("devPasswordInput").value = "";
  document.getElementById("devErrorMessage").classList.remove("show");
}

function resetDevLogin() {
  const loginContainer = document.getElementById("devLoginContainer");
  const devPanel = document.getElementById("devPanel");
  
  loginContainer.style.display = "block";
  devPanel.classList.remove("active");
  document.getElementById("devPasswordInput").value = "";
  document.getElementById("devErrorMessage").classList.remove("show");
}

function downloadSchoolFile() {
  // Create a dummy file for download
  // In a real scenario, you would have the actual school.zip file on your server
  const link = document.createElement('a');
  
  // Check if school.zip exists, otherwise create a dummy download
  fetch('school.zip')
    .then(response => {
      if (response.ok) {
        // File exists, download it
        link.href = 'school.zip';
        link.download = 'school.zip';
        link.click();
      } else {
        // File doesn't exist, show a message or create dummy content
        alert('school.zip file not found on server. Please make sure to upload the school.zip file to your website root directory.');
      }
    })
    .catch(() => {
      // Network error or file doesn't exist
      alert('school.zip file not found. Please make sure to upload the school.zip file to your website root directory.');
    });
}

// Allow Enter key to submit password
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("devPasswordInput");
  if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        checkDevPassword();
      }
    });
  }
});

// Close dev login with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const devLoginOverlay = document.getElementById("dev-login-overlay");
    if (devLoginOverlay.style.display === "flex") {
      closeDevLogin();
    }
  }
});

// Add shake animation CSS dynamically
const shakeCSS = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Inject the shake animation CSS
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);
