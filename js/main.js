// SparkCrux Website JavaScript
// Smooth scrolling, animations, form handling, and mobile menu

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const statNumbers = document.querySelectorAll('.stat-number');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initStatsCounter();
    initFormHandling();
    initSmoothScrolling();
    initFAQ();
});

// Navbar scroll effect
function initNavbar() {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
}

// Mobile menu toggle
function initMobileMenu() {
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger stats counter when stats section is visible
                if (entry.target.classList.contains('stats')) {
                    animateStats();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.problem-card, .service-card, .why-card, .testimonial-card, .tool-badge, .section-title, .pricing-card, .faq-item'
    );
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
    
    // Observe stats section
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Stats counter animation
function initStatsCounter() {
    // Stats will be animated when section becomes visible
}

function animateStats() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Close other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    const auditForm = document.getElementById('audit-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    if (auditForm) {
        auditForm.addEventListener('submit', handleAuditSubmit);
    }
    
    // Add input validation
    const requiredInputs = document.querySelectorAll('input[required], textarea[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => clearInputError(input));
    });
}

// Input validation
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Check if empty
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Website validation
    if (input.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            isValid = false;
            errorMessage = 'Please enter a valid website URL';
        }
    }
    
    if (!isValid) {
        showInputError(input, errorMessage);
    }
    
    return isValid;
}

function showInputError(input, message) {
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#FF5C00';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    input.parentNode.appendChild(errorElement);
}

function clearInputError(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate all required fields
    const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;
    
    requiredInputs.forEach(input => {
        if (!validateInput(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showMessage('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Prepare form data for API
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            website: formData.get('website'),
            service: formData.get('service'),
            budget: formData.get('budget'),
            message: formData.get('message'),
            source: formData.get('source')
        };
        
        // Send to backend API
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Show success message
            showMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            form.reset();
        } else {
            // Show error message from server or default error
            showMessage(result.error || 'Failed to send message. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        showMessage('Failed to send message. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

// Audit form submission
async function handleAuditSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate required fields
    const websiteInput = form.querySelector('input[name="website"]');
    if (!validateInput(websiteInput)) {
        showMessage('Please enter a valid website URL.', 'error');
        return;
    }
    
    // Show loading state
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Analyzing...';
    submitButton.disabled = true;
    
    try {
        // Prepare form data for API
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            website_url: formData.get('website'),
            audit_type: formData.get('audit-type')
        };
        
        // Send to backend API
        const response = await fetch('/api/audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Show success message
            showMessage('Audit request submitted! We\'ll analyze your website and send results within 24 hours.', 'success');
            
            // Reset form
            form.reset();
        } else {
            // Show error message from server or default error
            showMessage(result.error || 'Failed to submit audit request. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Audit form error:', error);
        showMessage('Failed to submit audit request. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

// Input sanitization
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
}

// Show message
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}-message`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        animation: slideInUp 0.3s ease;
        ${type === 'success' ? 'background: #25D366;' : 'background: #FF5C00;'}
    `;
    
    document.body.appendChild(messageElement);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageElement.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => messageElement.remove(), 300);
    }, 5000);
}

// Add slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutDown {
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// Utility functions
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization
const debouncedScroll = debounce(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScroll);

// Add CSS for form validation
const formStyles = document.createElement('style');
formStyles.textContent = `
    .form-input.error {
        border-color: #FF5C00 !important;
        box-shadow: 0 0 0 2px rgba(255, 92, 0, 0.2) !important;
    }
    
    .error-message {
        color: #FF5C00 !important;
        font-size: 0.875rem !important;
        margin-top: 0.25rem !important;
    }
    
    .success-message,
    .error-message {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    .success-message {
        background: #25D366;
    }
    
    .error-message {
        background: #FF5C00;
    }
`;
document.head.appendChild(formStyles);
