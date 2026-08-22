// ===========================================
// BTEC SYSTEM 2025 - JAVASCRIPT
// Interactive features and animations
// ===========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================
    // MOBILE NAVIGATION
    // ===========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container') && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    // ===========================================
    // SCROLL ANIMATIONS
    // ===========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // ===========================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ===========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore # only links
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // ===========================================
    // NAVBAR SCROLL EFFECT
    // ===========================================
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';
            navbar.style.padding = '1rem 0';
        }

        lastScroll = currentScroll;
    });

    // ===========================================
    // COUNTER ANIMATION FOR STATS
    // ===========================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    // Observe stat boxes for counter animation
    const statBoxes = document.querySelectorAll('.stat-box h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                if (!isNaN(number)) {
                    entry.target.textContent = '0+';
                    animateCounter(entry.target, number);
                }
            }
        });
    }, { threshold: 0.5 });

    statBoxes.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ===========================================
    // FEATURE CARDS STAGGER ANIMATION
    // ===========================================
    const featureCards = document.querySelectorAll('.feature-card');
    const featuresObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.2 });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        featuresObserver.observe(card);
    });

    // ===========================================
    // SUBJECT ITEMS HOVER EFFECT
    // ===========================================
    const subjectItems = document.querySelectorAll('.subject-item');
    
    subjectItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===========================================
    // LEVEL CARDS ENTRANCE ANIMATION
    // ===========================================
    const levelCards = document.querySelectorAll('.level-card');
    const levelObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.2 });

    levelCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(50px)';
        card.style.transition = 'all 0.6s ease-out';
        levelObserver.observe(card);
    });

    // ===========================================
    // BENEFIT ITEMS ANIMATION
    // ===========================================
    const benefitItems = document.querySelectorAll('.benefit-item');
    const benefitObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.2 });

    benefitItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(50px)';
        item.style.transition = 'all 0.5s ease-out';
        benefitObserver.observe(item);
    });

    // ===========================================
    // CTA BUTTONS FUNCTIONALITY
    // ===========================================
    const ctaBtn = document.querySelector('.btn-cta');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            alert('سيتم توجيهك إلى صفحة التواصل...');
            // In production: window.location.href = '/contact';
        });
    }

    const downloadBtn = document.querySelector('.btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Create a simple download simulation
            this.textContent = 'جاري التحميل...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = 'تم التحميل <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" style=\"vertical-align:middle;margin-right:0.3rem\"><polyline points=\"20 6 9 17 4 12\"/></svg>';
                
                setTimeout(() => {
                    this.textContent = 'تحميل الآن';
                    this.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // ===========================================
    // PARALLAX EFFECT FOR HERO
    // ===========================================
    const heroSection = document.querySelector('.btec-hero');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = heroSection.querySelectorAll('.page-hero-content, .hero-particles');
            
            parallaxElements.forEach(element => {
                const speed = element.classList.contains('hero-particles') ? 0.5 : 0.3;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ===========================================
    // SIDEBAR ACTIVE LINK ON SCROLL
    // ===========================================
    const sidebarLinks = document.querySelectorAll('.sidebar-links a');
    const sections = document.querySelectorAll('.content-section');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        sidebarLinks.forEach(link => {
            link.style.color = '#1e3a5f';
            link.style.fontWeight = '500';
            
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = '#c49560';
                link.style.fontWeight = '600';
            }
        });
    });

    // ===========================================
    // LOADING ANIMATION
    // ===========================================
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ===========================================
    // CONSOLE MESSAGE
    // ===========================================
    console.log('%c🎓 BTEC System 2025', 'color: #d4a574; font-size: 24px; font-weight: bold;');
    console.log('%cDeveloped with ❤️ for LearnMap', 'color: #1a1a2e; font-size: 14px;');
});

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Debounce function for performance
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

// Throttle function for scroll events
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