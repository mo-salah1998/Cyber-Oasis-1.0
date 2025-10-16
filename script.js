// Smooth scrolling for navigation links - explicitly define on window object for global access
window.scrollToSection = function(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile menu toggle - Enhanced with better error handling
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    console.log('Mobile menu elements:', { mobileMenuBtn, mobileMenu });
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu button clicked');
            
            // Toggle the mobile menu
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.style.display = 'block';
                console.log('Mobile menu opened');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.style.display = 'none';
                console.log('Mobile menu closed');
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.style.display = 'none';
                console.log('Mobile menu closed via link click');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.style.display = 'none';
            }
        });
    } else {
        console.error('Mobile menu elements not found:', { mobileMenuBtn, mobileMenu });
    }
});

// Registration modal functions - explicitly define on window object for global access
window.openRegistrationModal = function() {
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

window.closeRegistrationModal = function() {
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
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

// Download schedule functionality
window.downloadSchedule = function() {
    try {
        // Create a link element to download the Word document
        const link = document.createElement('a');
        link.href = '/assets/prog_cyber_oasisV_Ang.docx';
        link.download = 'Cyber_Oasis_1.0_Program_Schedule.docx';
        link.target = '_blank';
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success notification
        showNotification('Schedule downloaded successfully!', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Download failed. Please try again or contact us directly.', 'error');
    }
};

// Enhanced timeline animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation for each item
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.classList.add('animate-slide-in');
                }, index * 150);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        timelineObserver.observe(item);
    });
}

// Timeline item hover effects
function initTimelineHoverEffects() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Add glow effect
            this.style.boxShadow = '0 10px 30px rgba(234, 88, 12, 0.3)';
            
            // Animate the timeline dot
            const dot = this.querySelector('.w-4, .w-6');
            if (dot) {
                dot.style.transform = 'scale(1.5)';
                dot.style.transition = 'transform 0.3s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            // Remove glow effect
            this.style.boxShadow = '';
            
            // Reset timeline dot
            const dot = this.querySelector('.w-4, .w-6');
            if (dot) {
                dot.style.transform = 'scale(1)';
            }
        });
    });
}

// Progressive timeline reveal
function initProgressiveTimelineReveal() {
    const timelineContainer = document.querySelector('.relative');
    if (!timelineContainer) return;
    
    const timelineLine = timelineContainer.querySelector('.absolute');
    if (!timelineLine) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -200px 0px'
    };
    
    const lineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the timeline line
                timelineLine.style.height = '100%';
                timelineLine.style.transition = 'height 2s ease-in-out';
                
                // Add pulsing effect to the line
                timelineLine.classList.add('animate-pulse');
            }
        });
    }, observerOptions);
    
    lineObserver.observe(timelineContainer);
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure CSS is fully loaded on Vercel
    setTimeout(() => {
        initScrollAnimations();
        initParallaxEffect();
        initTimelineAnimations();
        initTimelineHoverEffects();
        initProgressiveTimelineReveal();
    }, 100);
});

// Note: All CSS animations are now defined in src/styles.css to prevent conflicts on Vercel

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
