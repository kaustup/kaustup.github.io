// ============================================
// THEME MANAGEMENT WITH SMOOTH TRANSITIONS
// ============================================

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const themeIcon = document.querySelector(".theme-icon");

// Initialize theme on page load
window.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeMusic();
  initializeParticles();
  initializeCursor();
  initializeScrollAnimations();
});

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  
  if (savedTheme === "dark") {
    body.classList.add("dark");
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }
  
  // Add smooth transition after initial load
  setTimeout(() => {
    body.style.transition = "background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
  }, 100);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
    
    // Create theme transition effect
    createThemeTransitionEffect(isDark);
  });
}

function updateThemeIcon(isDark) {
  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
}

function createThemeTransitionEffect(isDark) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${isDark ? '#020617' : '#ffffff'};
    opacity: 0;
    pointer-events: none;
    z-index: 9999;
    transition: opacity 0.3s ease;
  `;
  
  document.body.appendChild(overlay);
  
  requestAnimationFrame(() => {
    overlay.style.opacity = '0.5';
  });
  
  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
  }, 300);
}

// ============================================
// MOBILE MENU WITH ANIMATIONS
// ============================================

const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navMenu.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active");
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Close mobile menu when clicking on a nav link
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("active") && 
        !navMenu.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
      navMenu.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// ============================================
// SCROLL TO TOP BUTTON WITH PROGRESS
// ============================================

const scrollBtn = document.getElementById("scroll-top");
let scrollProgress = 0;

if (scrollBtn) {
  window.addEventListener("scroll", () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress = (winScroll / height) * 100;
    
    if (window.scrollY > 300) {
      scrollBtn.style.display = "flex";
      scrollBtn.style.animation = "buttonFloat 3s ease-in-out infinite";
    } else {
      scrollBtn.style.display = "none";
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
    
    // Create ripple effect
    createRipple(scrollBtn);
  });
}

// ============================================
// ADVANCED SCROLL ANIMATIONS
// ============================================

function initializeScrollAnimations() {
  const fadeElements = document.querySelectorAll(".fade-in");
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -80px 0px"
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        
        // Animate children with stagger effect
        const children = entry.target.querySelectorAll('.skill-item, .project-card, .website-card');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, index * 100);
        });
        
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));
}

// ============================================
// MUSIC TOGGLE WITH VISUALIZER
// ============================================

const musicToggle = document.getElementById("music-toggle");
const music = document.getElementById("bg-music");
const musicIcon = document.querySelector(".music-icon");

function initializeMusic() {
  if (music) {
    music.volume = 0.3;
    
    // Try autoplay with user gesture detection
    const tryAutoplay = () => {
      music.play().then(() => {
        if (musicIcon) musicIcon.textContent = "🔊";
      }).catch(() => {
        console.log("Autoplay blocked. Waiting for user interaction.");
      });
    };
    
    // Attempt autoplay on various user interactions
    const userInteractionEvents = ['click', 'touchstart', 'keydown'];
    userInteractionEvents.forEach(event => {
      document.addEventListener(event, tryAutoplay, { once: true });
    });
  }
}

if (musicToggle && music) {
  musicToggle.addEventListener("click", () => {
    if (music.paused) {
      music.play().then(() => {
        if (musicIcon) musicIcon.textContent = "🔊";
        createMusicPulse();
      }).catch(err => {
        console.error("Error playing music:", err);
        showNotification("Unable to play music", "error");
      });
    } else {
      music.pause();
      if (musicIcon) musicIcon.textContent = "🔇";
    }
    
    createRipple(musicToggle);
  });

  // Update icon based on music state
  music.addEventListener("play", () => {
    if (musicIcon) musicIcon.textContent = "🔊";
  });

  music.addEventListener("pause", () => {
    if (musicIcon) musicIcon.textContent = "🔇";
  });
}

function createMusicPulse() {
  musicToggle.style.animation = "none";
  setTimeout(() => {
    musicToggle.style.animation = "";
  }, 10);
}

// ============================================
// MODAL FUNCTIONALITY WITH ANIMATIONS
// ============================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    
    // Animate modal content
    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.style.animation = "none";
      setTimeout(() => {
        modalContent.style.animation = "modalSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      }, 10);
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.style.animation = "modalSlideOut 0.3s ease";
      
      setTimeout(() => {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }, 300);
    } else {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }
}

// Add modal slide out animation
const style = document.createElement('style');
style.textContent = `
  @keyframes modalSlideOut {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
  }
`;
document.head.appendChild(style);

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
    
    const devLoginOverlay = document.getElementById("dev-login-overlay");
    if (devLoginOverlay && devLoginOverlay.style.display === "flex") {
      closeDevLogin();
    }
  }
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const clickableItems = document.querySelectorAll('[onclick], [role="button"]');
  
  clickableItems.forEach(item => {
    item.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });
});

// ============================================
// DEVELOPER PANEL FUNCTIONS
// ============================================

function openDevLogin() {
  const overlay = document.getElementById("dev-login-overlay");
  const passwordInput = document.getElementById("devPasswordInput");
  
  if (overlay) {
    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  
  if (passwordInput) {
    setTimeout(() => passwordInput.focus(), 200);
  }
}

function closeDevLogin() {
  const overlay = document.getElementById("dev-login-overlay");
  
  if (overlay) {
    overlay.style.animation = "overlayFadeOut 0.3s ease";
    
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      overlay.style.animation = "";
      resetDevLogin();
    }, 300);
  }
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
    // Correct password - smooth transition
    loginContainer.style.animation = "containerPopOut 0.4s ease";
    
    setTimeout(() => {
      loginContainer.style.display = "none";
      devPanel.classList.add("active");
      errorMessage.classList.remove("show");
      passwordInput.value = "";
    }, 400);
    
    // Confetti effect
    createConfetti();
    showNotification("Access granted! Welcome to Developer Panel", "success");
    
  } else {
    // Wrong password - shake and show error
    errorMessage.classList.add("show");
    passwordInput.value = "";
    
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
  
  if (devPanel) {
    devPanel.style.animation = "panelSlideOut 0.4s ease";
    
    setTimeout(() => {
      devPanel.classList.remove("active");
      if (loginContainer) loginContainer.style.display = "block";
      if (passwordInput) passwordInput.value = "";
      if (errorMessage) errorMessage.classList.remove("show");
      devPanel.style.animation = "";
    }, 400);
  }
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

// ============================================
// PASSWORD PROTECTED FILE DOWNLOADS
// ============================================

// Password configuration
const filePasswords = {
  website: 'school.zip4153',
  jarvis: 'jarvis.zip4143'
};

// File URLs
const fileUrls = {
  website: 'school.zip',
  jarvis: 'jarvis4.0.zip'
};

function openPasswordModal(type) {
  const modalId = type + 'PasswordModal';
  const modal = document.getElementById(modalId);
  const inputId = type + 'PasswordInput';
  const errorId = type + 'ErrorMessage';
  
  if (modal) {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    
    // Clear previous input and error
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.value = "";
    if (error) error.textContent = "";
    
    // Focus on password input
    setTimeout(() => {
      if (input) input.focus();
    }, 100);
  }
}

function closePasswordModal(type) {
  const modalId = type + 'PasswordModal';
  const modal = document.getElementById(modalId);
  const inputId = type + 'PasswordInput';
  const errorId = type + 'ErrorMessage';
  
  if (modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    
    // Clear input and error
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.value = "";
    if (error) error.textContent = "";
  }
}

function verifyPassword(type) {
  const inputId = type + 'PasswordInput';
  const errorId = type + 'ErrorMessage';
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  
  if (!input || !error) {
    console.error("Password input elements not found");
    return;
  }
  
  const enteredPassword = input.value;
  const correctPassword = filePasswords[type];
  
  if (enteredPassword === correctPassword) {
    // Correct password
    error.textContent = "";
    error.style.color = "#10b981";
    error.textContent = "✓ Password correct! Starting download...";
    
    setTimeout(() => {
      closePasswordModal(type);
      startDownload(type);
    }, 1000);
    
  } else {
    // Wrong password
    error.style.color = "#e74c3c";
    error.textContent = "❌ Incorrect password. Please try again.";
    
    // Shake animation
    const modalContent = document.querySelector(`#${type}PasswordModal .modal-content`);
    if (modalContent) {
      modalContent.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => {
        modalContent.style.animation = "";
      }, 500);
    }
    
    // Clear password input
    input.value = "";
    input.focus();
  }
}

// Handle Enter key in password inputs
document.addEventListener("DOMContentLoaded", () => {
  const websiteInput = document.getElementById("websitePasswordInput");
  const jarvisInput = document.getElementById("jarvisPasswordInput");
  
  if (websiteInput) {
    websiteInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        verifyPassword('website');
      }
    });
  }
  
  if (jarvisInput) {
    jarvisInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        verifyPassword('jarvis');
      }
    });
  }
});

// ============================================
// DOWNLOAD FUNCTIONALITY WITH PROGRESS
// ============================================

function startDownload(type) {
  const progressModal = document.getElementById("downloadProgressModal");
  const progressFill = document.getElementById("progressBarFill");
  const statusText = document.getElementById("downloadStatusText");
  const filenameText = document.getElementById("downloadFilename");
  const filename = fileUrls[type];
  
  if (!progressModal) {
    // Fallback if modal doesn't exist
    initiateDownload(type);
    return;
  }
  
  // Show progress modal
  progressModal.style.display = "block";
  progressModal.setAttribute("aria-hidden", "false");
  
  // Reset progress
  if (progressFill) progressFill.style.width = "0%";
  if (statusText) statusText.textContent = "Preparing download...";
  if (filenameText) filenameText.textContent = `File: ${filename}`;
  
  // Simulate download progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      if (progressFill) progressFill.style.width = "100%";
      if (statusText) statusText.textContent = "✓ Download complete!";
      
      // Trigger actual download
      initiateDownload(type);
      
      // Close progress modal after 1.5 seconds
      setTimeout(() => {
        progressModal.style.display = "none";
        progressModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        showNotification(`${filename} downloaded successfully!`, "success");
      }, 1500);
    } else {
      if (progressFill) progressFill.style.width = progress + "%";
      if (statusText) statusText.textContent = `Downloading... ${Math.round(progress)}%`;
    }
  }, 200);
}

function initiateDownload(type) {
  const filename = fileUrls[type];
  const link = document.createElement('a');
  link.href = filename;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadFlappyBird() {
  showNotification("Starting Flappy Bird download...", "info");
  
  setTimeout(() => {
    const link = document.createElement('a');
    link.href = 'flappybirdgame.zip';
    link.download = 'flappybirdgame.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification("Flappy Bird game downloaded successfully!", "success");
  }, 500);
}

// Enter key to submit dev password
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

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };
  
  notification.innerHTML = `
    <span class="notification-icon">${icons[type] || icons.info}</span>
    <span class="notification-message">${message}</span>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-width: 350px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s ease';
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      
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
        
        // Create scroll indicator
        createScrollIndicator(target);
      }
    });
  });
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================

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

// ============================================
// RIPPLE EFFECT
// ============================================

function createRipple(element) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: rippleEffect 0.6s ease-out;
    pointer-events: none;
  `;
  
  const rippleContainer = element.querySelector('.ripple-container') || element;
  rippleContainer.style.position = 'relative';
  rippleContainer.style.overflow = 'hidden';
  rippleContainer.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleEffect {
    to {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
  
  @keyframes overlayFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes containerPopOut {
    to {
      opacity: 0;
      transform: scale(0.8) rotate(10deg);
    }
  }
  
  @keyframes panelSlideOut {
    to {
      opacity: 0;
      transform: translateX(100px) scale(0.9);
    }
  }
`;
document.head.appendChild(rippleStyle);

// ============================================
// CONFETTI EFFECT
// ============================================

function createConfetti() {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${color};
      top: 50%;
      left: 50%;
      opacity: 1;
      z-index: 10000;
      pointer-events: none;
      animation: confettiFall ${Math.random() * 2 + 2}s ease-out forwards;
      transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 4000);
  }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
  @keyframes confettiFall {
    to {
      transform: translate(${Math.random() * 400 - 200}px, ${Math.random() * 600 + 200}px) rotate(${Math.random() * 720}deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(confettiStyle);

// ============================================
// CUSTOM CURSOR (Optional Enhancement)
// ============================================

function initializeCursor() {
  if (window.innerWidth < 768) return; // Skip on mobile
  
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--primary);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transition: all 0.1s ease;
    opacity: 0;
  `;
  
  document.body.appendChild(cursor);
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });
  
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Enlarge cursor on hover
  const hoverElements = document.querySelectorAll('a, button, .skill-item, .project-card, .website-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursor.style.background = 'rgba(59, 130, 246, 0.2)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.background = 'transparent';
    });
  });
}

// ============================================
// PARTICLES BACKGROUND (Optional Enhancement)
// ============================================

function initializeParticles() {
  // Lightweight particle system
  const particlesCount = 30;
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-container';
  particlesContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  `;
  
  for (let i = 0; i < particlesCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: var(--primary);
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.3 + 0.1};
      animation: particleFloat ${Math.random() * 20 + 10}s linear infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    
    particlesContainer.appendChild(particle);
  }
  
  document.body.insertBefore(particlesContainer, document.body.firstChild);
}

// Add particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes particleFloat {
    0%, 100% {
      transform: translateY(0) translateX(0);
    }
    25% {
      transform: translateY(-100px) translateX(50px);
    }
    50% {
      transform: translateY(-200px) translateX(-50px);
    }
    75% {
      transform: translateY(-100px) translateX(100px);
    }
  }
`;
document.head.appendChild(particleStyle);

// ============================================
// SCROLL INDICATOR
// ============================================

function createScrollIndicator(target) {
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: fixed;
    top: 50%;
    right: 20px;
    width: 4px;
    height: 60px;
    background: linear-gradient(to bottom, var(--primary), transparent);
    border-radius: 2px;
    animation: scrollPulse 0.6s ease;
    z-index: 1000;
    pointer-events: none;
  `;
  
  document.body.appendChild(indicator);
  
  setTimeout(() => indicator.remove(), 600);
}

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log("%c👋 Hey Developer!", "color: #3b82f6; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);");
console.log("%c🚀 Welcome to Kaustup's Portfolio!", "color: #8b5cf6; font-size: 16px; font-weight: 600;");
console.log("%c💡 Interested in the code? Check it out on GitHub!", "color: #10b981; font-size: 14px;");
console.log("%c🔐 Developer access password hint: It's a 4-digit number 😉", "color: #f59e0b; font-size: 12px;");
console.log("%c⚡ Built with HTML, CSS, and Vanilla JavaScript", "color: #ec4899; font-size: 12px; font-style: italic;");

// ============================================
// PERFORMANCE MONITORING
// ============================================

if (window.PerformanceObserver) {
  const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) {
        console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
      }
    }
  });
  
  try {
    perfObserver.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Long task API not supported
  }
}

// ============================================
// END OF SCRIPT
// ============================================

console.log("%c✨ Portfolio loaded successfully!", "color: #3b82f6; font-size: 14px; font-weight: bold;");