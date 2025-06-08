// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const typingText = document.getElementById('typing-text');
const contactForm = document.getElementById('contactForm');
const whatsappBtn = document.getElementById('whatsapp-btn');


// Typing Animation
const phrases = [
    "🤖 Respuestas automáticas 24/7",
    "📈 Aumenta tus ventas un 40%",
    "⚡ Respuesta en menos de 5 segundos",
    "🎯 Personalizado para tu negocio",
    "💬 Integración con WhatsApp"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingDelay = 500; // Pause before typing next phrase
    }

    setTimeout(typeEffect, typingDelay);
}

// Mobile Navigation Toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu when clicking on links
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Smooth scroll for navigation links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Animated counters for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// Intersection Observer for scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation when stats section is visible
                if (entry.target.classList.contains('stats-container')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .benefit-item, .stats-container, .contact-method');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Contact form handling
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const telefono = formData.get('telefono');
    const servicio = formData.get('servicio');
    const mensaje = formData.get('mensaje');
    
    // Form validation
    if (!nombre || !email || !servicio) {
        showNotification('Por favor completa todos los campos requeridos.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Por favor ingresa un email válido.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.classList.add('loading');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Create WhatsApp message
        const whatsappMessage = createWhatsAppMessage(nombre, email, telefono, servicio, mensaje);
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('loading');
        
        // Show success message
        showNotification('¡Mensaje enviado! Te contactaremos pronto.', 'success');
        
        // Optional: Open WhatsApp with pre-filled message
        // window.open(`https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        
    }, 2000);
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Create WhatsApp message from form data
function createWhatsAppMessage(nombre, email, telefono, servicio, mensaje) {
    return `🤖 *Nueva Consulta - BOTNAME*\n\n` +
           `👤 *Nombre:* ${nombre}\n` +
           `📧 *Email:* ${email}\n` +
           `📱 *Teléfono:* ${telefono || 'No proporcionado'}\n` +
           `🏢 *Tipo de negocio:* ${servicio}\n` +
           `💬 *Mensaje:* ${mensaje || 'Sin mensaje adicional'}\n\n` +
           `_Consulta generada desde la web_`;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        margin-left: 1rem;
        cursor: pointer;
        opacity: 0.8;
    `;
    
    closeBtn.addEventListener('click', () => notification.remove());
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// WhatsApp button animation and tracking
function setupWhatsAppButton() {
    let isVisible = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isVisible) {
                    whatsappBtn.style.animation = 'pulse 2s infinite';
                    isVisible = true;
                }
            }
        });
    }, { threshold: 0.1 });
    
    // Start observing when user scrolls past hero section
    const heroSection = document.getElementById('inicio');
    if (heroSection) {
        observer.observe(heroSection);
    }
    
    // Track WhatsApp button clicks
    whatsappBtn.addEventListener('click', () => {
        // Analytics tracking could go here
        console.log('WhatsApp button clicked');
    });
}

// Lazy loading for images (if you add images later)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start typing animation
    setTimeout(typeEffect, 1000);
    
    // Setup event listeners
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
            closeMobileMenu();
        });
    });
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Scroll events
    window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
    
    // Setup animations and observers
    setupScrollAnimations();
    setupWhatsAppButton();
    setupLazyLoading();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
    
    // Add CSS for notifications animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
        }
        
        .notification-icon {
            margin-right: 0.5rem;
        }
        
        .notification-close:hover {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}
// Contact Form Submission with Validation and Alert

contactForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Evitar envío automático para mostrar alerta

  // Validación mínima, por ejemplo, que nombre y email no estén vacíos
    const nombre = this.nombre.value.trim();
    const email = this.email.value.trim();

    if (!nombre || !email) {
        alert('Por favor completa los campos requeridos.');
        return;
    }

    // Enviar el formulario manualmente
    fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: {
        'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
        alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
        contactForm.reset();
        } else {
        alert('Hubo un problema al enviar el mensaje, por favor intentá de nuevo.');
        }
    }).catch(error => {
        alert('Error de conexión, por favor intentá más tarde.');
        console.error(error);
    });
});
