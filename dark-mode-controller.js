(function() {
    'use strict';

    const STORAGE_KEY = 'learnMapDarkMode';
    const DARK_CLASS = 'dark-mode';
    const BUTTON_ID = 'darkModeToggle';
    const FLOAT_BUTTON_ID = 'darkModeFloatToggle';

    function applyInitialTheme() {
        try {
            const savedMode = localStorage.getItem(STORAGE_KEY);
            const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const shouldBeDark = savedMode === 'true' || (savedMode === null && systemDark);
            if (shouldBeDark) {
                document.documentElement.classList.add(DARK_CLASS);
                document.body.classList.add(DARK_CLASS);
            }
        } catch (e) {}
    }

    applyInitialTheme();

    function svgMoon() {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }

    function svgSun() {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    }

    function updateButton(button) {
        var isDark = document.documentElement.classList.contains(DARK_CLASS);
        var svg = button.querySelector('svg');
        if (svg) {
            if (isDark) {
                svg.outerHTML = svgSun();
            } else {
                svg.outerHTML = svgMoon();
            }
        }
        button.setAttribute('aria-label', isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي');
        button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        var label = button.querySelector('.dm-label');
        if (label) {
            label.textContent = isDark ? 'الوضع النهاري' : 'الوضع الليلي';
        }
    }

    function toggleDarkMode(button) {
        var isDark = document.documentElement.classList.toggle(DARK_CLASS);
        document.body.classList.toggle(DARK_CLASS, isDark);
        try {
            localStorage.setItem(STORAGE_KEY, isDark.toString());
        } catch (e) {}
        updateButton(button);
        var floatBtn = document.getElementById(FLOAT_BUTTON_ID);
        if (floatBtn && floatBtn !== button) {
            updateButton(floatBtn);
        }
    }

    function initButton(button) {
        updateButton(button);
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleDarkMode(button);
        });
    }

    function injectFloatButton() {
        if (document.getElementById(FLOAT_BUTTON_ID)) return;
        var btn = document.createElement('button');
        btn.id = FLOAT_BUTTON_ID;
        btn.className = 'btn-float-dark-mode';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'تفعيل الوضع الليلي');
        btn.innerHTML = svgMoon();
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleDarkMode(btn);
        });
        document.body.appendChild(btn);
        updateButton(btn);
    }

    function initWhenReady() {
        var button = document.getElementById(BUTTON_ID);
        if (button) {
            initButton(button);
            return;
        }
        var attempts = 0;
        var maxAttempts = 30;
        var interval = setInterval(function() {
            attempts++;
            var btn = document.getElementById(BUTTON_ID);
            if (btn) {
                clearInterval(interval);
                initButton(btn);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                injectFloatButton();
            }
        }, 100);
    }

    function watchSystemTheme() {
        try {
            var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            var callback = function(e) {
                if (localStorage.getItem(STORAGE_KEY) === null) {
                    if (e.matches) {
                        document.documentElement.classList.add(DARK_CLASS);
                        document.body.classList.add(DARK_CLASS);
                    } else {
                        document.documentElement.classList.remove(DARK_CLASS);
                        document.body.classList.remove(DARK_CLASS);
                    }
                    Array.prototype.forEach.call(document.querySelectorAll('#' + BUTTON_ID + ', #' + FLOAT_BUTTON_ID), function(btn) {
                        if (btn) updateButton(btn);
                    });
                }
            };
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', callback);
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(callback);
            }
        } catch (e) {}
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initWhenReady();
            watchSystemTheme();
        });
    } else {
        initWhenReady();
        watchSystemTheme();
    }

})();
