/* ============================================================
   PROFOLIOX 2026 — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    //   1. DARK / LIGHT THEME TOGGLE
    // =========================================================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Restore saved preference or match OS preference
    const savedTheme = localStorage.getItem('profoliox-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        html.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', next);
        localStorage.setItem('profoliox-theme', next);

        // Animate the toggle button
        themeToggle.classList.add('toggling');
        setTimeout(() => themeToggle.classList.remove('toggling'), 400);
    });

    // Listen for OS theme changes in real-time
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('profoliox-theme')) {
            html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });


    // =========================================================
    //   2. NAVBAR SCROLL EFFECT
    // =========================================================
    const navbar = document.getElementById('mainNav');

    const handleNavScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });


    // =========================================================
    //   3. INTERSECTION OBSERVER — FADE UP ANIMATIONS
    // =========================================================
    const fadeEls = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => fadeObserver.observe(el));


    // =========================================================
    //   4. SKILL BAR ANIMATION
    // =========================================================
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => barObserver.observe(bar));


    // =========================================================
    //   5. ACTIVE NAV LINK ON SCROLL
    // =========================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });


    // =========================================================
    //   6. CLOSE MOBILE NAV ON CLICK
    // =========================================================
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navCollapse = document.getElementById('navMenu');
            if (navCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });


    // =========================================================
    //   7. PROJECT FILTER SYSTEM
    // =========================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCols = document.querySelectorAll('.project-col');

    let activeFilter = 'all';
    let isAnimating = false;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            if (filter === activeFilter || isAnimating) return;

            isAnimating = true;
            activeFilter = filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Phase 1: Fade out non-matching
            const toHide = [];
            const toShow = [];

            projectCols.forEach(col => {
                const matches = filter === 'all' || col.dataset.category === filter;
                (matches ? toShow : toHide).push(col);
            });

            toHide.forEach((col, i) => {
                col.style.transitionDelay = `${i * 40}ms`;
                col.classList.add('card-hidden');
            });

            const fadeOutDuration = 300 + (toHide.length * 40);

            setTimeout(() => {
                toHide.forEach(col => {
                    col.classList.add('card-collapsed');
                    col.style.transitionDelay = '0ms';
                });

                toShow.forEach(col => {
                    col.classList.remove('card-collapsed', 'card-hidden');
                    col.style.transitionDelay = '0ms';
                });

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        toShow.forEach((col, i) => {
                            col.style.transitionDelay = `${i * 60}ms`;
                            col.classList.add('card-visible');
                        });

                        const fadeInDuration = 400 + (toShow.length * 60);
                        setTimeout(() => {
                            toShow.forEach(col => {
                                col.style.transitionDelay = '0ms';
                            });
                            isAnimating = false;
                        }, fadeInDuration);
                    });
                });
            }, fadeOutDuration);
        });
    });

    // Initialize all cols visible
    projectCols.forEach(col => col.classList.add('card-visible'));


    // =========================================================
    //   8. BACK TO TOP BUTTON
    // =========================================================
    const backToTopBtn = document.getElementById('backToTop');

    const handleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };
    window.addEventListener('scroll', handleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // =========================================================
    //   9. CONTACT FORM (UI SIMULATION)
    // =========================================================
    const submitBtn = document.getElementById('submitBtn');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            // Basic validation
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Reset error states
            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('input-error');
            });

            let hasError = false;

            if (!name) {
                nameInput.classList.add('input-error');
                hasError = true;
            }
            if (!email || !email.includes('@') || !email.includes('.')) {
                emailInput.classList.add('input-error');
                hasError = true;
            }
            if (!message) {
                messageInput.classList.add('input-error');
                hasError = true;
            }

            if (hasError) {
                // Shake animation
                submitBtn.classList.add('shake');
                setTimeout(() => submitBtn.classList.remove('shake'), 500);
                return;
            }

            // Show loading state
            const textSpan = submitBtn.querySelector('.btn-submit-text');
            const loadingSpan = submitBtn.querySelector('.btn-submit-loading');
            const successSpan = submitBtn.querySelector('.btn-submit-success');

            textSpan.style.display = 'none';
            loadingSpan.style.display = 'inline-flex';
            submitBtn.disabled = true;

            // Simulate send delay
            setTimeout(() => {
                loadingSpan.style.display = 'none';
                successSpan.style.display = 'inline-flex';
                submitBtn.classList.add('success');

                // Reset after 3 seconds
                setTimeout(() => {
                    successSpan.style.display = 'none';
                    textSpan.style.display = 'inline-flex';
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success');

                    // Clear form
                    nameInput.value = '';
                    emailInput.value = '';
                    messageInput.value = '';
                    const subjectInput = document.getElementById('contactSubject');
                    if (subjectInput) subjectInput.value = '';
                }, 3000);
            }, 1800);
        });
    }

    // Remove error state on input
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('input-error');
            });
        }
    });

});
