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
        typingDelay = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingDelay = 500;
    }

    setTimeout(typeEffect, typingDelay);
}

// Mobile Navigation Toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

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

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('stats-container')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .benefit-item, .stats-container, .contact-method');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const nombre = formData.get('nombre')?.trim();
    const email = formData.get('email')?.trim();
    const telefono = formData.get('telefono')?.trim();
    const servicio = formData.get('servicio');
    const mensaje = formData.get('mensaje');

    if (!nombre || !email || !servicio) {
        showNotification('Por favor completa todos los campos requeridos.', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Por favor ingresa un email válido.', 'error');
        return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.classList.add('loading');

    setTimeout(() => {
        const whatsappMessage = createWhatsAppMessage(nombre, email, telefono, servicio, mensaje);
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('loading');
        showNotification('¡Mensaje enviado! Te contactaremos pronto.', 'success');
        // window.open(`https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    }, 2000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function createWhatsAppMessage(nombre, email, telefono, servicio, mensaje) {
    return `🤖 *Nueva Consulta - BOTNAME*\n\n` +
           `👤 *Nombre:* ${nombre}\n` +
           `📧 *Email:* ${email}\n` +
           `📱 *Teléfono:* ${telefono || 'No proporcionado'}\n` +
           `🏢 *Tipo de negocio:* ${servicio}\n` +
           `💬 *Mensaje:* ${mensaje || 'Sin mensaje adicional'}\n\n` +
           `_Consulta generada desde la web_`;
}

function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

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

    notification.querySelector('.notification-close').addEventListener('click', () => notification.remove());

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function setupWhatsAppButton() {
    let isVisible = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isVisible) {
                whatsappBtn.style.animation = 'pulse 2s infinite';
                isVisible = true;
            }
        });
    }, { threshold: 0.1 });

    const heroSection = document.getElementById('inicio');
    if (heroSection) {
        observer.observe(heroSection);
    }

    whatsappBtn.addEventListener('click', () => {
        console.log('WhatsApp button clicked');
    });
}

function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
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

function throttle(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(typeEffect, 1000);

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
            closeMobileMenu();
        });
    });

    //if (contactForm) {
      //  contactForm.addEventListener('submit', handleContactForm);
    //}

    window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
    setupScrollAnimations();
    setupWhatsAppButton();
    setupLazyLoading();

    document.addEventListener('click', function (e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content { display: flex; align-items: center; }
        .notification-icon { margin-right: 0.5rem; }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            margin-left: 1rem;
            cursor: pointer;
            opacity: 0.8;
        }
        .notification-close:hover {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
});

window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
});