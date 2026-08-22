/**
 * LearnMap - Mobile Menu Controller (FIXED)
 * ==========================================
 * Fixes applied:
 * - Fixed removeEventListener issue by using named functions
 * - Added proper ARIA attributes in Arabic
 * - Added keyboard navigation support
 * - Added focus trap for accessibility
 * ==========================================
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        hamburgerId: 'hamburger',
        menuId: 'navMenu',
        overlayId: 'navOverlay',
        breakpoint: 968,
        animationDuration: 400
    };

    // State
    let isOpen = false;
    let hamburger = null;
    let navMenu = null;
    let overlay = null;
    let focusableElements = [];
    let firstFocusable = null;
    let lastFocusable = null;

    /**
     * Initialize the mobile menu
     */
    function init() {
        // Wait for elements to be available
        hamburger = document.getElementById(CONFIG.hamburgerId);
        navMenu = document.getElementById(CONFIG.menuId);
        overlay = document.getElementById(CONFIG.overlayId);

        if (!hamburger || !navMenu) {
            // Retry if navbar hasn't loaded yet
            const navHost = document.getElementById('navbar');
            if (document.readyState === 'loading' || (navHost && !navHost.innerHTML.trim())) {
                setTimeout(init, 100);
            }
            return;
        }

        // Set initial ARIA attributes
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', CONFIG.menuId);
        hamburger.setAttribute('aria-label', 'فتح القائمة');
        navMenu.setAttribute('aria-hidden', 'true');

        // Bind event listeners
        bindEvents();

        console.log('✅ Mobile menu initialized');
    }

    /**
     * Bind all event listeners
     */
    function bindEvents() {
        // Hamburger click
        hamburger.addEventListener('click', handleHamburgerClick);

        // Overlay click
        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);

        // Dropdown toggles for mobile
        setupDropdownToggles();

        // Window resize
        window.addEventListener('resize', handleResize);

        // Close menu when clicking a link (for same-page navigation)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Only close if it's a hash link or same page
                const href = link.getAttribute('href');
                if (href && (href.startsWith('#') || href.startsWith('/') || href.startsWith('./'))) {
                    // Close menu after a small delay to allow navigation
                    setTimeout(closeMenu, 100);
                }
            });
        });
    }

    /**
     * Handle hamburger button click
     */
    function handleHamburgerClick() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /**
     * Open the mobile menu
     */
    function openMenu() {
        isOpen = true;

        // Update classes
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'إغلاق القائمة');

        navMenu.classList.add('active');
        navMenu.setAttribute('aria-hidden', 'false');

        if (overlay) {
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Setup focus trap
        setupFocusTrap();

        // Focus first menu item
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), CONFIG.animationDuration);
        }
    }

    /**
     * Close the mobile menu
     */
    function closeMenu() {
        if (!isOpen) return;

        isOpen = false;

        // Update classes
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'فتح القائمة');

        navMenu.classList.remove('active');
        navMenu.setAttribute('aria-hidden', 'true');

        if (overlay) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
        }

        // Restore body scroll
        document.body.style.overflow = '';

        // Close all dropdowns
        closeAllDropdowns();

        // Return focus to hamburger
        hamburger.focus();
    }

    /**
     * Handle keyboard events
     */
    function handleKeyDown(e) {
        // Close on Escape
        if (e.key === 'Escape' && isOpen) {
            closeMenu();
            return;
        }

        // Tab trap when menu is open
        if (isOpen && e.key === 'Tab') {
            handleTabTrap(e);
        }
    }

    /**
     * Handle Tab key trap for accessibility
     */
    function handleTabTrap(e) {
        if (!firstFocusable || !lastFocusable) return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }

    /**
     * Setup focus trap elements
     */
    function setupFocusTrap() {
        const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        focusableElements = navMenu.querySelectorAll(selector);

        if (focusableElements.length > 0) {
            firstFocusable = focusableElements[0];
            lastFocusable = focusableElements[focusableElements.length - 1];
        }
    }

    /**
     * Setup dropdown toggles for mobile
     */
    function setupDropdownToggles() {
        const dropdownParents = navMenu.querySelectorAll('li.has-submenu');

        dropdownParents.forEach(parent => {
            const link = parent.querySelector(':scope > a');
            if (!link) return;

            // Create unique ID for submenu
            const submenu = parent.querySelector('.dropdown-menu, .dropdown-submenu');
            if (submenu) {
                const submenuId = 'submenu-' + Math.random().toString(36).substr(2, 9);
                submenu.id = submenuId;
                link.setAttribute('aria-controls', submenuId);
                link.setAttribute('aria-expanded', 'false');
            }

            // Use named function for event listener (fixes removeEventListener issue)
            link.addEventListener('click', handleDropdownClick);
            link.addEventListener('keydown', handleDropdownKeydown);
        });
    }

    /**
     * Handle dropdown link click (named function for proper event management)
     */
    function handleDropdownClick(e) {
        if (window.innerWidth > CONFIG.breakpoint) return;

        e.preventDefault();

        const parent = this.closest('li.has-submenu');
        if (!parent) return;

        const isExpanded = parent.classList.contains('active');

        // Close all other dropdowns at the same level
        const siblings = parent.parentElement.querySelectorAll(':scope > li.has-submenu.active');
        siblings.forEach(sibling => {
            if (sibling !== parent) {
                sibling.classList.remove('active');
                const siblingLink = sibling.querySelector(':scope > a');
                if (siblingLink) {
                    siblingLink.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Toggle current dropdown
        parent.classList.toggle('active');
        this.setAttribute('aria-expanded', !isExpanded);
    }

    /**
     * Handle dropdown keyboard navigation
     */
    function handleDropdownKeydown(e) {
        if (window.innerWidth > CONFIG.breakpoint) return;

        const parent = this.closest('li.has-submenu');
        if (!parent) return;

        // Enter or Space to toggle
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDropdownClick.call(this, e);
        }

        // Arrow keys for navigation
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const submenu = parent.querySelector('.dropdown-menu, .dropdown-submenu');
            if (submenu) {
                const firstItem = submenu.querySelector('a');
                if (firstItem) firstItem.focus();
            }
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const submenu = parent.querySelector('.dropdown-menu, .dropdown-submenu');
            if (submenu) {
                const items = submenu.querySelectorAll('a');
                if (items.length > 0) {
                    items[items.length - 1].focus();
                }
            }
        }
    }

    /**
     * Close all open dropdowns
     */
    function closeAllDropdowns() {
        const openDropdowns = navMenu.querySelectorAll('li.has-submenu.active');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const link = dropdown.querySelector(':scope > a');
            if (link) {
                link.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        if (window.innerWidth > CONFIG.breakpoint) {
            closeMenu();
        }
    }

    /**
     * Public API
     */
    window.LearnMapMobileMenu = {
        open: openMenu,
        close: closeMenu,
        toggle: handleHamburgerClick,
        isOpen: () => isOpen
    };

    // Initialize on DOM ready or after navbar loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
