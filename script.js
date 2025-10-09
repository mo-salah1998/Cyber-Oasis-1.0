// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
});

// Registration modal functions
function openRegistrationModal() {
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeRegistrationModal() {
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('registration-modal');
    if (event.target === modal) {
        closeRegistrationModal();
    }
});

// Hackathon experience radio button handler
document.addEventListener('DOMContentLoaded', function() {
    const hackathonRadios = document.querySelectorAll('input[name="hackathon-experience"]');
    const hackathonDetails = document.getElementById('hackathon-details');
    
    hackathonRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                hackathonDetails.classList.remove('hidden');
            } else {
                hackathonDetails.classList.add('hidden');
            }
        });
    });
});

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Registration form
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistrationSubmission();
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmission();
        });
    }
});

// Registration form submission
async function handleRegistrationSubmission() {
    const formData = {
        teamName: document.getElementById('team-name').value,
        university: document.getElementById('university').value,
        leaderName: document.getElementById('leader-name').value,
        memberName: document.getElementById('member-name').value,
        faculty: document.getElementById('faculty').value,
        studyLevel: document.getElementById('study-level').value,
        fieldStudy: document.getElementById('field-study').value,
        leaderEmail: document.getElementById('leader-email').value,
        leaderPhone: document.getElementById('leader-phone').value,
        cyberKnowledge: document.getElementById('cyber-knowledge').value,
        hackathonExperience: document.querySelector('input[name="hackathon-experience"]:checked')?.value,
        hackathonSpecify: document.getElementById('hackathon-specify').value
    };
    
    // Validate required fields
    if (!validateRegistrationForm(formData)) {
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('#registration-form button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
        submitBtn.disabled = true;
        
        // Submit to serverless function
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showNotification('Registration submitted successfully! We will contact you soon.', 'success');
            closeRegistrationModal();
            document.getElementById('registration-form').reset();
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button state
        const submitBtn = document.querySelector('#registration-form button[type="submit"]');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Contact form submission
async function handleContactSubmission() {
    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        message: document.getElementById('contact-message').value
    };
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('#contact-form button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitBtn.disabled = true;
        
        // Submit to serverless function
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            document.getElementById('contact-form').reset();
        } else {
            throw new Error('Message sending failed');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        showNotification('Failed to send message. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button state
        const submitBtn = document.querySelector('#contact-form button[type="submit"]');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Form validation
function validateRegistrationForm(formData) {
    const requiredFields = [
        'teamName', 'university', 'leaderName', 'memberName', 
        'faculty', 'studyLevel', 'fieldStudy', 'leaderEmail', 
        'leaderPhone', 'cyberKnowledge', 'hackathonExperience'
    ];
    
    for (const field of requiredFields) {
        if (!formData[field]) {
            showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.leaderEmail)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.leaderPhone)) {
        showNotification('Please enter a valid phone number.', 'error');
        return false;
    }
    
    return true;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 translate-x-full`;
    
    // Set colors based on type
    const colors = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        info: 'bg-blue-600 text-white',
        warning: 'bg-yellow-600 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-3"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Parallax effect for cover image
function initParallaxEffect() {
    const coverImage = document.querySelector('#home img');
    if (!coverImage) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        coverImage.style.transform = `translateY(${rate}px)`;
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initParallaxEffect();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-fade-in {
        animation: fadeIn 0.8s ease-in-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        backdrop-filter: blur(10px);
    }
`;
document.head.appendChild(style);

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // Close modal with Escape key
    if (event.key === 'Escape') {
        closeRegistrationModal();
    }
});

// Smooth scroll for all anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});
