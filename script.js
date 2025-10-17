// Enhanced smooth scrolling for navigation links - Vercel compatible
window.scrollToSection = function(sectionId) {
    const element = document.getElementById(sectionId);
    if (!element) {
        console.warn(`Section with id "${sectionId}" not found`);
        return;
    }

    // Get current scroll position
    const startPosition = window.pageYOffset;
    const targetPosition = element.offsetTop - 80; // Account for fixed navbar
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
    let startTime = null;

    // Check if smooth scrolling is supported
    const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    
    if (supportsSmoothScroll && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Use native smooth scrolling if supported
        document.body.classList.add('scrolling');
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Remove scrolling class after animation
        setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, duration + 100);
    } else {
        // Fallback to custom smooth scrolling animation
        document.body.classList.add('scrolling');
        
        function smoothScrollAnimation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic);
            
            if (progress < 1) {
                requestAnimationFrame(smoothScrollAnimation);
            } else {
                // Remove scrolling class when animation completes
                document.body.classList.remove('scrolling');
            }
        }
        
        requestAnimationFrame(smoothScrollAnimation);
    }
    
    console.log(`Scrolling to section: ${sectionId}`);
}

// Mobile menu toggle - Enhanced with better error handling and Vercel compatibility
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    console.log('Mobile menu elements:', { mobileMenuBtn, mobileMenu });
    
    if (mobileMenuBtn && mobileMenu) {
        // Enhanced mobile menu toggle with smooth animations
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu button clicked');
            
            // Toggle the mobile menu with smooth animation
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                // Show menu with animation
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('show');
                console.log('Mobile menu opened with animation');
            } else {
                // Hide menu with animation
                mobileMenu.classList.remove('show');
                
                // Hide after animation completes
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
                
                console.log('Mobile menu closed with animation');
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Animate out before hiding
                mobileMenu.classList.remove('show');
                
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
                
                console.log('Mobile menu closed via link click');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    // Animate out before hiding
                    mobileMenu.classList.remove('show');
                    
                    setTimeout(() => {
                        mobileMenu.classList.add('hidden');
                    }, 300);
                }
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

// Success modal functions
window.openSuccessModal = function() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

window.closeSuccessModal = function() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const registrationModal = document.getElementById('registration-modal');
    const successModal = document.getElementById('success-modal');
    
    if (event.target === registrationModal) {
        closeRegistrationModal();
    }
    
    if (event.target === successModal) {
        closeSuccessModal();
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
            handleRegistrationSubmission(e);
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

// Simple form submission handler
function handleFormSubmission(event) {
    // Show loading state
    const submitBtn = document.querySelector('#registration-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
    submitBtn.disabled = true;
    
    // Let the form submit naturally to the server
    // The server will handle the processing and return a response
    return true;
}

// Registration form submission (old method - keeping for fallback)
async function handleRegistrationSubmission(event) {
    // Prevent default form submission if called from event
    if (event) {
        event.preventDefault();
    }
    
    console.log('Form submission started');
    
    // Get form data using FormData for reliable data collection
    const form = document.getElementById('registration-form');
    if (!form) {
        console.error('Form not found!');
        showNotification('Form error: Please refresh the page and try again.', 'error');
        return false;
    }
    
    const formDataObj = new FormData(form);
    
    // Convert FormData to object
    const formData = {};
    for (let [key, value] of formDataObj.entries()) {
        formData[key] = value;
    }
    
    // Map form field names to API field names
    const apiFormData = {
        teamName: formData['team-name'] || '',
        university: formData['university'] || '',
        leaderName: formData['leader-name'] || '',
        memberName: formData['member-name'] || '',
        faculty: formData['faculty'] || '',
        studyLevel: formData['study-level'] || '',
        fieldStudy: formData['field-study'] || '',
        leaderEmail: formData['leader-email'] || '',
        leaderPhone: formData['leader-phone'] || '',
        cyberKnowledge: formData['cyber-knowledge'] || '',
        hackathonExperience: formData['hackathon-experience'] || '',
        hackathonSpecify: formData['hackathon-specify'] || ''
    };
    
    // Debug: Log the form data to see what's being sent
    console.log('Raw form data:', formData);
    console.log('API form data:', apiFormData);
    
    // Debug: Check FormData object
    console.log('FormData entries:');
    for (let [key, value] of formDataObj.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    // Check for empty required fields before validation
    const requiredFields = ['teamName', 'university', 'leaderName', 'memberName', 'faculty', 'studyLevel', 'fieldStudy', 'leaderEmail', 'leaderPhone', 'cyberKnowledge', 'hackathonExperience'];
    const emptyFields = requiredFields.filter(field => !apiFormData[field] || apiFormData[field].trim() === '');
    
    if (emptyFields.length > 0) {
        console.error('Empty required fields:', emptyFields);
        showNotification(`Please fill in the following required fields: ${emptyFields.join(', ')}`, 'error');
        return false;
    }
    
    // Validate required fields
    if (!validateRegistrationForm(apiFormData)) {
        return false;
    }
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('#registration-form button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
        submitBtn.disabled = true;
        
        // Debug logging
        console.log('Submitting registration form with data:', apiFormData);
        
        // Submit to serverless function
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiFormData)
        });
        
        const responseData = await response.json();
        console.log('Registration response:', responseData);
        
        if (response.ok) {
            showNotification('Registration submitted successfully! We will contact you soon.', 'success');
            closeRegistrationModal();
            document.getElementById('registration-form').reset();
            return false; // Prevent form submission
        } else {
            // Show specific error message from server
            const errorMessage = responseData.error || responseData.message || 'Registration failed';
            console.error('Registration failed with response:', responseData);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Registration error:', error);
        // Show more specific error message
        const errorMessage = error.message || 'Registration failed. Please try again or contact us directly.';
        showNotification(errorMessage, 'error');
        return false; // Prevent form submission
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

// Vercel animation fallback - ensure animations work even if CSS fails
function ensureAnimationsWork() {
    // Check if animations are working by testing a simple animation
    const testElement = document.createElement('div');
    testElement.style.cssText = `
        position: fixed;
        top: -100px;
        left: -100px;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        animation: fadeIn 0.1s ease-in-out;
    `;
    document.body.appendChild(testElement);
    
    // If animations don't work, add fallback styles
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(testElement);
        if (computedStyle.animationName === 'none' || computedStyle.animationName === '') {
            console.warn('CSS animations not working, applying JavaScript fallbacks');
            applyAnimationFallbacks();
        }
        document.body.removeChild(testElement);
    }, 100);
}

// Apply JavaScript animation fallbacks
function applyAnimationFallbacks() {
    // Add inline styles for critical animations
    const style = document.createElement('style');
    style.textContent = `
        /* JavaScript fallback animations */
        .animate-fade-in {
            opacity: 0;
            transform: scale(1.1);
            transition: all 2s ease-in-out;
        }
        
        .animate-slide-up {
            opacity: 0;
            transform: translateY(50px);
            transition: all 1.5s ease-out;
        }
        
        .animate-float-1, .animate-float-2, .animate-float-3, 
        .animate-float-4, .animate-float-5 {
            animation: none;
            transition: transform 0.3s ease;
        }
        
        .animate-pulse-slow, .animate-pulse {
            animation: none;
            transition: opacity 0.5s ease;
        }
        
        .animate-bounce-slow {
            animation: none;
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Trigger animations with JavaScript
    setTimeout(() => {
        const fadeElements = document.querySelectorAll('.animate-fade-in');
        fadeElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
        });
        
        const slideElements = document.querySelectorAll('.animate-slide-up');
        slideElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 100);
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if animations work on Vercel
    ensureAnimationsWork();
    
    // Test navigation animations specifically
    testNavigationAnimations();
    
    // Test smooth scrolling functionality
    testSmoothScrolling();
    
    initScrollAnimations();
    initParallaxEffect();
    initTimelineAnimations();
    initTimelineHoverEffects();
    initProgressiveTimelineReveal();
    
    // Handle error messages from URL parameters
    handleErrorMessages();
});

// Handle error messages and success messages from URL parameters
function handleErrorMessages() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');
    
    if (success === 'true') {
        // Show success modal
        openSuccessModal();
        
        // Remove success parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    } else if (error) {
        const errorMessage = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        
        if (errorMessage && errorText) {
            let errorMsg = 'Please fill in all required fields.';
            
            if (error.startsWith('missing_')) {
                const field = error.replace('missing_', '').replace(/([A-Z])/g, ' $1').toLowerCase();
                errorMsg = `Please fill in the ${field} field.`;
            }
            
            errorText.textContent = errorMsg;
            errorMessage.classList.remove('hidden');
            
            // Open the registration modal if it's not already open
            const modal = document.getElementById('registration-modal');
            if (modal && modal.classList.contains('hidden')) {
                openRegistrationModal();
            }
            
            // Remove error parameter from URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }
}

// Test navigation animations for Vercel compatibility
function testNavigationAnimations() {
    console.log('Testing navigation animations...');
    
    // Test if CSS animations are supported
    const testElement = document.createElement('div');
    testElement.style.cssText = `
        position: fixed;
        top: -100px;
        left: -100px;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(testElement);
    
    // Test transition
    testElement.style.opacity = '1';
    const hasTransitions = window.getComputedStyle(testElement).transition !== 'none';
    
    // Test transform
    testElement.style.transform = 'translateY(10px)';
    const hasTransforms = window.getComputedStyle(testElement).transform !== 'none';
    
    // Test smooth scrolling support
    const hasSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    const supportsRequestAnimationFrame = typeof requestAnimationFrame !== 'undefined';
    
    document.body.removeChild(testElement);
    
    console.log('Animation support:', { 
        hasTransitions, 
        hasTransforms, 
        hasSmoothScroll, 
        supportsRequestAnimationFrame 
    });
    
    // If animations don't work, add fallback classes
    if (!hasTransitions || !hasTransforms) {
        console.warn('Limited animation support detected, applying fallbacks');
        document.body.classList.add('animation-fallback');
    }
    
    // If smooth scrolling doesn't work, enhance the scrollToSection function
    if (!hasSmoothScroll || !supportsRequestAnimationFrame) {
        console.warn('Limited smooth scroll support detected, using enhanced fallback');
        document.body.classList.add('scroll-fallback');
        enhanceScrollToSection();
    }
}

// Enhanced scroll function for environments with limited smooth scroll support
function enhanceScrollToSection() {
    const originalScrollToSection = window.scrollToSection;
    
    window.scrollToSection = function(sectionId) {
        const element = document.getElementById(sectionId);
        if (!element) {
            console.warn(`Section with id "${sectionId}" not found`);
            return;
        }

        // Always use custom animation for fallback
        const startPosition = window.pageYOffset;
        const targetPosition = element.offsetTop - 80;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) / 1.5, 800);
        let startTime = null;

        // Add visual feedback during scroll
        document.body.classList.add('scrolling');

        function smoothScrollAnimation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Enhanced easing function
            const easeInOutQuart = progress < 0.5 
                ? 8 * progress * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 4) / 2;
            
            window.scrollTo(0, startPosition + distance * easeInOutQuart);
            
            if (progress < 1) {
                if (typeof requestAnimationFrame !== 'undefined') {
                    requestAnimationFrame(smoothScrollAnimation);
                } else {
                    // Fallback for very old browsers
                    setTimeout(() => smoothScrollAnimation(currentTime + 16), 16);
                }
            } else {
                // Remove scrolling class when animation completes
                document.body.classList.remove('scrolling');
            }
        }
        
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(smoothScrollAnimation);
        } else {
            smoothScrollAnimation(0);
        }
        
        console.log(`Enhanced scrolling to section: ${sectionId}`);
    };
}

// Test smooth scrolling functionality
function testSmoothScrolling() {
    console.log('Testing smooth scrolling functionality...');
    
    // Test if scrollToSection function works
    const testSection = document.getElementById('about');
    if (testSection) {
        console.log('✅ Smooth scrolling test: About section found');
        
        // Test scroll behavior support
        const supportsScrollBehavior = 'scrollBehavior' in document.documentElement.style;
        const supportsRequestAnimationFrame = typeof requestAnimationFrame !== 'undefined';
        
        console.log('Scroll support:', {
            supportsScrollBehavior,
            supportsRequestAnimationFrame,
            hasScrollToSection: typeof window.scrollToSection === 'function'
        });
        
        if (supportsScrollBehavior && supportsRequestAnimationFrame) {
            console.log('✅ Full smooth scrolling support detected');
        } else {
            console.log('⚠️ Limited smooth scrolling support, using fallbacks');
        }
    } else {
        console.warn('❌ Test section not found for smooth scrolling test');
    }
}

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
    
    .animate-slide-in {
        animation: slideInFromLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .timeline-item {
        position: relative;
        overflow: hidden;
    }
    
    .timeline-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(234, 88, 12, 0.1), transparent);
        transition: left 0.6s ease;
    }
    
    .timeline-item:hover::before {
        left: 100%;
    }
    
    .timeline-item:hover {
        transform: translateX(10px) scale(1.02);
    }
    
    .notification {
        backdrop-filter: blur(10px);
    }
    
    /* Enhanced timeline line animation */
    .timeline-line {
        background: linear-gradient(180deg, 
            #ea580c 0%, 
            #f59e0b 25%, 
            #fbbf24 50%, 
            #f59e0b 75%, 
            #ea580c 100%);
        background-size: 100% 200%;
        animation: gradientFlow 3s ease-in-out infinite;
    }
    
    @keyframes gradientFlow {
        0%, 100% {
            background-position: 0% 0%;
        }
        50% {
            background-position: 0% 100%;
        }
    }
    
    /* Day header animations */
    .day-header {
        transition: all 0.3s ease;
    }
    
    .day-header:hover {
        transform: scale(1.05);
        text-shadow: 0 0 20px rgba(234, 88, 12, 0.5);
    }
    
    /* Timeline dot pulse animation */
    .timeline-dot {
        position: relative;
    }
    
    .timeline-dot::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        transform: translate(-50%, -50%);
        animation: pulse-ring 2s infinite;
        opacity: 0.6;
    }
    
    @keyframes pulse-ring {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    /* Special event highlighting */
    .special-event {
        position: relative;
        background: linear-gradient(45deg, 
            rgba(234, 88, 12, 0.2) 0%, 
            rgba(245, 158, 11, 0.2) 50%, 
            rgba(251, 191, 36, 0.2) 100%);
        border: 2px solid transparent;
        background-clip: padding-box;
    }
    
    .special-event::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, #ea580c, #f59e0b, #fbbf24);
        border-radius: inherit;
        padding: 2px;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
    }
    
    /* Responsive design for mobile devices */
    @media (max-width: 768px) {
        .timeline-item {
            margin-left: 0 !important;
            padding: 1rem !important;
        }
        
        .timeline-item .flex {
            flex-direction: column;
            align-items: flex-start !important;
        }
        
        .timeline-item .flex > div:first-child {
            margin-bottom: 0.5rem;
            margin-left: 0 !important;
        }
        
        .day-header {
            flex-direction: column;
            text-align: center;
        }
        
        .day-header .md\\:ml-6 {
            margin-left: 0 !important;
            margin-top: 1rem;
        }
        
        .timeline-line {
            left: 0.5rem !important;
        }
        
        .timeline-dot {
            position: relative;
            left: auto !important;
            top: auto !important;
        }
        
        .timeline-item:hover {
            transform: none;
        }
        
        .timeline-item:hover::before {
            display: none;
        }
        
        /* Improve mobile button layout */
        .hero-button {
            width: 100%;
            margin-bottom: 0.5rem;
        }
        
        /* Hero buttons container for mobile */
        .hero-buttons-container {
            min-height: auto;
            padding: 2rem 1rem 3rem 1rem;
            align-items: center;
        }
        
        /* Better mobile text sizing */
        .hero-text-shadow {
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 10px rgba(234, 88, 12, 0.3);
        }
        
        /* Additional mobile overflow prevention */
        .timeline-item .text-lg, .timeline-item .text-sm {
            word-break: break-word;
            hyphens: auto;
        }
        
        /* Fix any wide elements */
        .bg-white, .rounded-xl {
            max-width: 100%;
        }
        
        /* Ensure images don't overflow */
        img {
            max-width: 100%;
            height: auto;
        }
    }
    
    @media (max-width: 480px) {
        .timeline-item {
            padding: 0.75rem !important;
        }
        
        .timeline-item .text-lg {
            font-size: 0.875rem;
        }
        
        .timeline-item .text-sm {
            font-size: 0.8rem;
        }
        
        .day-header h4 {
            font-size: 1.25rem;
        }
        
        .day-header p {
            font-size: 0.875rem;
        }
        
        /* Even smaller text for very small screens */
        .hero-text-shadow h1 {
            font-size: 2rem;
        }
        
        .hero-text-shadow h2 {
            font-size: 1.5rem;
        }
        
        .hero-text-shadow p {
            font-size: 0.9rem;
        }
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
// Deployment trigger 16 أكتوبر, 2025 CET 05:07:25 م
