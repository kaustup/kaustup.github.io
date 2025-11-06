// Theme Management
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  // Check for saved theme preference or default to 'light' mode
  const savedTheme = localStorage.getItem("theme") || "light";
  
  if (savedTheme === "dark") {
    body.classList.add("dark");
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }

  // Try to autoplay music
  const music = document.getElementById("bg-music");
  if (music) {
    music.volume = 0.3; // Set volume to 30%
    music.play().catch(() => {
      console.log("Autoplay blocked. User interaction required.");
    });
  }
});

// Theme toggle functionality
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
  });
}

function updateThemeIcon(isDark) {
  const icon = themeToggle.querySelector(".theme-icon");
  if (icon) {
    icon.textContent = isDark ? "☀️" : "🌙";
  }
}

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active");
  });

  // Close mobile menu when clicking on a nav link
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
    });
  });
}

// Scroll to Top Button
const scrollBtn = document.getElementById("scroll-top");

if (scrollBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.style.display = "flex";
    } else {
      scrollBtn.style.display = "none";
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  });
}

// Fade-in Animation on Scroll
const fadeElements = document.querySelectorAll(".fade-in");

const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      fadeObserver.unobserve(entry.target); // Stop observing once shown
    }
  });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

// Music Toggle Functionality
const musicToggle = document.getElementById("music-toggle");
const music = document.getElementById("bg-music");

if (musicToggle && music) {
  musicToggle.addEventListener("click", () => {
    const icon = musicToggle.querySelector(".music-icon");
    
    if (music.paused) {
      music.play().then(() => {
        if (icon) icon.textContent = "🔊";
      }).catch(err => {
        console.error("Error playing music:", err);
      });
    } else {
      music.pause();
      if (icon) icon.textContent = "🔇";
    }
  });

  // Update icon based on music state
  music.addEventListener("play", () => {
    const icon = musicToggle.querySelector(".music-icon");
    if (icon) icon.textContent = "🔊";
  });

  music.addEventListener("pause", () => {
    const icon = musicToggle.querySelector(".music-icon");
    if (icon) icon.textContent = "🔇";
  });
}

// Modal Functionality
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restore scrolling
  }
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    closeModal(event.target.id);
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
      if (modal.style.display === "block") {
        closeModal(modal.id);
      }
    });
    
    // Also close dev login if open
    const devLoginOverlay = document.getElementById("dev-login-overlay");
    if (devLoginOverlay && devLoginOverlay.style.display === "flex") {
      closeDevLogin();
    }
  }
});

// Add keyboard navigation for skill items and project cards
document.addEventListener("DOMContentLoaded", () => {
  const clickableItems = document.querySelectorAll('[onclick]');
  
  clickableItems.forEach(item => {
    item.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });
});

// Developer Panel Functions
function openDevLogin() {
  const overlay = document.getElementById("dev-login-overlay");
  const passwordInput = document.getElementById("devPasswordInput");
  
  if (overlay) {
    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  
  if (passwordInput) {
    setTimeout(() => passwordInput.focus(), 100);
  }
}

function closeDevLogin() {
  const overlay = document.getElementById("dev-login-overlay");
  
  if (overlay) {
    overlay.style.display = "none";
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  
  resetDevLogin();
}

function checkDevPassword() {
  const passwordInput = document.getElementById("devPasswordInput");
  const errorMessage = document.getElementById("devErrorMessage");
  const loginContainer = document.getElementById("devLoginContainer");
  const devPanel = document.getElementById("devPanel");
  
  if (!passwordInput || !errorMessage || !loginContainer || !devPanel) {
    console.error("Dev panel elements not found");
    return;
  }
  
  const password = passwordInput.value;
  
  if (password === "4153") {
    // Correct password
    loginContainer.style.display = "none";
    devPanel.classList.add("active");
    errorMessage.classList.remove("show");
    passwordInput.value = "";
  } else {
    // Wrong password
    errorMessage.classList.add("show");
    passwordInput.value = "";
    
    // Shake animation
    loginContainer.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      loginContainer.style.animation = "";
    }, 500);
    
    // Hide error after 3 seconds
    setTimeout(() => {
      errorMessage.classList.remove("show");
    }, 3000);
  }
}

function backToLogin() {
  const loginContainer = document.getElementById("devLoginContainer");
  const devPanel = document.getElementById("devPanel");
  const passwordInput = document.getElementById("devPasswordInput");
  const errorMessage = document.getElementById("devErrorMessage");
  
  if (devPanel) devPanel.classList.remove("active");
  if (loginContainer) loginContainer.style.display = "block";
  if (passwordInput) passwordInput.value = "";
  if (errorMessage) errorMessage.classList.remove("show");
}

function resetDevLogin() {
  const loginContainer = document.getElementById("devLoginContainer");
  const devPanel = document.getElementById("devPanel");
  const passwordInput = document.getElementById("devPasswordInput");
  const errorMessage = document.getElementById("devErrorMessage");
  
  if (loginContainer) loginContainer.style.display = "block";
  if (devPanel) devPanel.classList.remove("active");
  if (passwordInput) passwordInput.value = "";
  if (errorMessage) errorMessage.classList.remove("show");
}

function downloadSchoolFile() {
  // Check if file exists and download
  fetch('school.zip', { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        // File exists, initiate download
        const link = document.createElement('a');
        link.href = 'school.zip';
        link.download = 'school.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        showNotification('Download started!', 'success');
      } else {
        // File doesn't exist
        showNotification('school.zip file not found on server. Please upload the file to your website root directory.', 'error');
      }
    })
    .catch(() => {
      showNotification('Error: Could not access school.zip. Please make sure the file exists in your website root directory.', 'error');
    });
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Add CSS for notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(notificationStyles);

// Enter key to submit password
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("devPasswordInput");
  
  if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkDevPassword();
      }
    });
  }
});

// Smooth scroll for all anchor links
document.addEventListener("DOMContentLoaded", () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      
      // Skip if it's just "#" or empty
      if (!href || href === "#") return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });
});

// Active nav link highlighting
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav ul li a");
  
  let current = "";
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Form submission handling (optional enhancement)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    // You can add custom validation or handling here if needed
    // For now, it will use the default mailto: behavior
    console.log("Contact form submitted");
  });
}

// Console message for developers
console.log("%c👋 Hi there, Developer!", "color: #3b82f6; font-size: 20px; font-weight: bold;");
console.log("%cInterested in how this portfolio works? Check out the code on GitHub!", "color: #8b5cf6; font-size: 14px;");
console.log("%cDeveloper access password hint: It's a 4-digit number 😉", "color: #10b981; font-size: 12px;");

// Performance: Lazy load images (optional enhancement)
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img[data-src]");
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});