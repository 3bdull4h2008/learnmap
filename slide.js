/**
 * LearnMap - Slider Controller (FIXED with Throttling)
 * =====================================================
 * Fixes applied:
 * - Added throttle to scroll listeners for better performance
 * - Added debounce for resize events
 * - Added support for RTL sliders
 * =====================================================
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        scrollThrottle: 100,  // ms between scroll event processing
        resizeDebounce: 150, // ms between resize event processing
        sliderSelectors: ['.news-grid', '.fields-grid', '.fields-grid2'],
        cardSelectors: ['.news-card', '.field-card']
    };

    /**
     * Throttle function - limits execution rate
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     */
    function throttle(func, limit) {
        let inThrottle;
        let lastFunc;
        let lastRan;
        
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                lastRan = Date.now();
                inThrottle = true;
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    /**
     * Debounce function - delays execution until after wait period
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Initialize mobile sliders
     */
    function initSliders() {
        // Only run on mobile/tablet
        if (window.innerWidth > 768) return;

        const sliders = document.querySelectorAll(CONFIG.sliderSelectors.join(', '));
        if (sliders.length === 0) return;

        sliders.forEach(slider => {
            // Get direct children cards
            const cards = Array.from(slider.children).filter(child =>
                CONFIG.cardSelectors.some(selector => child.matches(selector))
            );

            if (cards.length === 0) return;

            // Check if dots already exist
            if (slider.nextElementSibling?.classList.contains('slider-dots')) return;

            // Create dots container
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slider-dots';
            dotsContainer.setAttribute('role', 'tablist');
            dotsContainer.setAttribute('aria-label', 'مؤشرات الشرائح');
            
            slider.parentNode.insertBefore(dotsContainer, slider.nextSibling);

            // Create dots
            const dots = [];
            cards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'slider-dot';
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `شريحة ${index + 1}`);
                dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
                
                // Click to scroll
                dot.addEventListener('click', () => {
                    const cardWidth = slider.offsetWidth;
                    const isRTL = getComputedStyle(slider).direction === 'rtl';
                    const scrollPosition = isRTL 
                        ? (cards.length - 1 - index) * cardWidth 
                        : index * cardWidth;
                    
                    slider.scrollTo({
                        left: scrollPosition,
                        behavior: 'smooth'
                    });
                });

                dotsContainer.appendChild(dot);
                dots.push(dot);
            });

            // Throttled scroll handler
            const handleScroll = throttle(() => {
                const cardWidth = slider.offsetWidth;
                const isRTL = getComputedStyle(slider).direction === 'rtl';
                let scrollPosition;
                
                if (isRTL) {
                    // For RTL, scrollLeft is negative when scrolling right
                    // We need to convert it to a positive value for calculation
                    const normalizedScroll = Math.abs(slider.scrollLeft);
                    scrollPosition = normalizedScroll;
                } else {
                    // For LTR, scrollLeft is positive when scrolling right
                    scrollPosition = slider.scrollLeft;
                }
                
                const activeIndex = Math.round(scrollPosition / cardWidth);

                dots.forEach((dot, index) => {
                    const isActive = index === activeIndex;
                    dot.classList.toggle('active', isActive);
                    dot.setAttribute('aria-selected', isActive.toString());
                });
            }, CONFIG.scrollThrottle);

            // Add throttled scroll listener
            slider.addEventListener('scroll', handleScroll, { passive: true });

            // Initialize first dot as active
            if (dots.length > 0) {
                dots[0].classList.add('active');
            }
        });
    }

    /**
     * Debounced resize handler
     */
    const handleResize = debounce(() => {
        // Remove existing dots on resize to desktop
        if (window.innerWidth > 768) {
            document.querySelectorAll('.slider-dots').forEach(dots => {
                if (dots.parentElement) {
                    dots.parentElement.removeChild(dots);
                }
            });
        } else {
            // Re-initialize sliders on mobile
            initSliders();
        }
    }, CONFIG.resizeDebounce);

    /**
     * Initialize
     */
    function init() {
        initSliders();

        // Add resize listener with debounce
        window.addEventListener('resize', handleResize, { passive: true });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    window.LearnMapSlider = {
        init: initSliders,
        throttle,
        debounce
    };

})();
