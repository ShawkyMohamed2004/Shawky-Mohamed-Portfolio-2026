/* ============================================
   SHAWKY MOHAMED - PORTFOLIO JAVASCRIPT
   Ultra-Creative 3D Interactive System
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       STATE MANAGEMENT
       ============================================ */
    const state = {
        theme: localStorage.getItem('theme') || 'dark',
        layout: localStorage.getItem('layout') || 'modern',
        accentColor: localStorage.getItem('accentColor') || '#00d4ff',
        cursorX: 0,
        cursorY: 0,
        isScrolling: false
    };

    /* ============================================
       CUSTOM CURSOR
       ============================================ */
    const Cursor = {
        init() {
            this.cursor = document.getElementById('cursor');
            this.dot = this.cursor.querySelector('.cursor-dot');
            this.ring = this.cursor.querySelector('.cursor-ring');
            
            this.cursorX = 0;
            this.cursorY = 0;
            this.dotX = 0;
            this.dotY = 0;
            this.ringX = 0;
            this.ringY = 0;
            
            document.addEventListener('mousemove', (e) => this.onMouseMove(e));
            document.addEventListener('mouseenter', () => this.show());
            document.addEventListener('mouseleave', () => this.hide());
            
            // Hover effects
            this.initHoverEffects();
            
            // Start animation
            this.animate();
        },
        
        onMouseMove(e) {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        },
        
        animate() {
            // Smooth follow with lerp
            const ease = 0.25;
            const easeRing = 0.15;
            
            this.dotX += (this.cursorX - this.dotX) * ease;
            this.dotY += (this.cursorY - this.dotY) * ease;
            
            this.ringX += (this.cursorX - this.ringX) * easeRing;
            this.ringY += (this.cursorY - this.ringY) * easeRing;
            
            this.dot.style.transform = `translate(${this.dotX}px, ${this.dotY}px)`;
            this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px)`;
            
            requestAnimationFrame(() => this.animate());
        },
        
        initHoverEffects() {
            const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card, .skill-category');
            
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('hover');
                });
                
                el.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('hover');
                });
            });
        },
        
        show() {
            this.cursor.style.opacity = '1';
        },
        
        hide() {
            this.cursor.style.opacity = '0';
        }
    };

    /* ============================================
       THEME TOGGLE
       ============================================ */
    const Theme = {
        init() {
            this.toggle = document.getElementById('themeToggle');
            this.mobileThemeBtns = document.querySelectorAll('.mobile-theme-btn');
            this.setTheme(state.theme);
            
            this.toggle.addEventListener('click', () => this.switchTheme());
            
            // Mobile theme buttons
            this.mobileThemeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const theme = btn.getAttribute('data-theme');
                    this.setTheme(theme);
                });
            });
        },
        
        setTheme(theme) {
            state.theme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Update logo gradient
            this.updateLogoColors();
        },
        
        switchTheme() {
            const newTheme = state.theme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        },
        
        updateLogoColors() {
            const gradientStarts = document.querySelectorAll('.gradient-start');
            const gradientEnds = document.querySelectorAll('.gradient-end');
            
            gradientStarts.forEach(el => {
                el.style.stopColor = state.accentColor;
            });
            
            gradientEnds.forEach(el => {
                el.style.stopColor = this.getSecondaryColor(state.accentColor);
            });
        },
        
        getSecondaryColor(hex) {
            // Generate a complementary/shifted hue
            const rgb = this.hexToRgb(hex);
            const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
            hsl.h = (hsl.h + 30) % 360; // Shift hue by 30 degrees
            const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
            return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        },
        
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 212, b: 255 };
        },
        
        rgbToHsl(r, g, b) {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                    case g: h = ((b - r) / d + 2) / 6; break;
                    case b: h = ((r - g) / d + 4) / 6; break;
                }
            }
            
            return { h: h * 360, s: s * 100, l: l * 100 };
        },
        
        hslToRgb(h, s, l) {
            h /= 360; s /= 100; l /= 100;
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        },
        
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
    };

    /* ============================================
       COLOR PICKER
       ============================================ */
    const ColorPicker = {
        init() {
            this.toggle = document.getElementById('colorPickerToggle');
            this.palette = document.getElementById('colorPalette');
            this.options = document.querySelectorAll('.color-option');
            
            this.toggle.addEventListener('click', () => this.togglePalette());
            
            this.options.forEach(option => {
                option.addEventListener('click', (e) => this.selectColor(e.target));
            });
            
            // Set initial color
            this.setAccentColor(state.accentColor);
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.color-picker')) {
                    this.palette.classList.remove('active');
                }
            });
        },
        
        togglePalette() {
            this.palette.classList.toggle('active');
        },
        
        selectColor(option) {
            const color = option.dataset.color;
            this.setAccentColor(color);
            
            // Update active state
            this.options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Close palette
            setTimeout(() => {
                this.palette.classList.remove('active');
            }, 300);
        },
        
        setAccentColor(color) {
            state.accentColor = color;
            localStorage.setItem('accentColor', color);
            
            // Calculate secondary color
            const secondary = Theme.getSecondaryColor(color);
            
            // Update CSS variables
            document.documentElement.style.setProperty('--accent-color', color);
            document.documentElement.style.setProperty('--accent-secondary', secondary);
            document.documentElement.style.setProperty('--accent-glow', this.hexToRgba(color, 0.4));
            
            // Update logo
            Theme.updateLogoColors();
        },
        
        hexToRgba(hex, alpha) {
            const rgb = Theme.hexToRgb(hex);
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        }
    };

    /* ============================================
       LAYOUT SWITCHER
       ============================================ */
    const LayoutSwitcher = {
        init() {
            this.toggle = document.getElementById('layoutToggle');
            this.modal = document.getElementById('layoutModal');
            this.options = document.querySelectorAll('.layout-option');
            this.profileImg = document.querySelector('.profile-img');
            
            // Image sources for each layout (you can replace these with actual images)
            this.images = {
                modern: 'images/shawky-gradient-bg.jpg',      // Blue gradient background photo
                split: 'images/shawky-event-conference.jpg',  // Event/Conference photo
                narrative: 'images/shawky-formal-suit.jpg'    // Formal suit photo
            };
            
            this.toggle.addEventListener('click', () => this.toggleModal());
            
            this.options.forEach(option => {
                option.addEventListener('click', (e) => {
                    const layout = e.currentTarget.dataset.layout;
                    this.switchLayout(layout);
                });
            });
            
            // Set initial layout
            this.setLayout(state.layout);
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.layout-switcher')) {
                    this.modal.classList.remove('active');
                }
            });
        },
        
        toggleModal() {
            this.modal.classList.toggle('active');
        },
        
        switchLayout(layout) {
            this.setLayout(layout);
            this.updateProfileImage(layout);
            
            // Update active state
            this.options.forEach(opt => opt.classList.remove('active'));
            document.querySelector(`[data-layout="${layout}"]`).classList.add('active');
            
            // Close modal
            setTimeout(() => {
                this.modal.classList.remove('active');
            }, 300);
        },
        
        setLayout(layout) {
            state.layout = layout;
            document.documentElement.setAttribute('data-layout', layout);
            localStorage.setItem('layout', layout);
        },
        
        updateProfileImage(layout) {
            if (this.profileImg && this.images[layout]) {
                // Fade out
                this.profileImg.style.opacity = '0';
                this.profileImg.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    // Change image
                    this.profileImg.src = this.images[layout];
                    
                    // Fade in
                    setTimeout(() => {
                        this.profileImg.style.opacity = '1';
                        this.profileImg.style.transform = 'scale(1)';
                    }, 50);
                }, 300);
            }
        }
    };

    /* ============================================
       NAVIGATION
       ============================================ */
    const Navigation = {
        init() {
            this.nav = document.getElementById('nav');
            this.links = document.querySelectorAll('.nav-link');
            this.sections = document.querySelectorAll('.section');
            this.menuBtn = document.getElementById('navMenuBtn');
            
            // Mobile Menu
            this.hamburger = document.getElementById('hamburger');
            this.mobileMenu = document.getElementById('mobileMenu');
            this.mobileMenuClose = document.getElementById('mobileMenuClose');
            this.mobileLinks = document.querySelectorAll('.mobile-menu-link');
            
            // Smooth scroll for desktop
            this.links.forEach(link => {
                link.addEventListener('click', (e) => this.smoothScroll(e));
            });
            
            // Mobile menu handlers
            if (this.hamburger) {
                this.hamburger.addEventListener('click', () => this.openMobileMenu());
            }
            
            if (this.mobileMenuClose) {
                this.mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
            }
            
            // Smooth scroll for mobile links
            this.mobileLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    this.smoothScroll(e);
                    this.closeMobileMenu();
                });
            });
            
            // Scroll spy
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
            
            // Initial check
            this.onScroll();
        },
        
        openMobileMenu() {
            this.mobileMenu.classList.add('active');
            this.hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        },
        
        closeMobileMenu() {
            this.mobileMenu.classList.remove('active');
            this.hamburger.classList.remove('active');
            document.body.style.overflow = '';
        },
        
        smoothScroll(e) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        },
        
        onScroll() {
            // Add scrolled class to nav
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
            
            // Update active link
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            this.links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    /* ============================================
       TYPING ANIMATION
       ============================================ */
    const TypingAnimation = {
        init() {
            this.element = document.getElementById('roleText');
            this.roles = [
                'Flutter Developer',
                'Mobile App Developer',
                'Software Engineering Student',
                'UI/UX Implementer',
                'Cross-Platform Specialist'
            ];
            this.currentIndex = 0;
            this.currentText = '';
            this.isDeleting = false;
            this.typeSpeed = 100;
            this.deleteSpeed = 50;
            this.pauseTime = 2000;
            
            this.type();
        },
        
        type() {
            const currentRole = this.roles[this.currentIndex];
            
            if (this.isDeleting) {
                this.currentText = currentRole.substring(0, this.currentText.length - 1);
            } else {
                this.currentText = currentRole.substring(0, this.currentText.length + 1);
            }
            
            this.element.textContent = this.currentText;
            
            let timeout = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
            
            if (!this.isDeleting && this.currentText === currentRole) {
                timeout = this.pauseTime;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentText === '') {
                this.isDeleting = false;
                this.currentIndex = (this.currentIndex + 1) % this.roles.length;
                timeout = 500;
            }
            
            setTimeout(() => this.type(), timeout);
        }
    };

    /* ============================================
       SCROLL ANIMATIONS
       ============================================ */
    const ScrollAnimations = {
        init() {
            this.observerOptions = {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            };
            
            this.observer = new IntersectionObserver(
                (entries) => this.onIntersection(entries),
                this.observerOptions
            );
            
            // Observe all sections and cards
            const animatedElements = document.querySelectorAll(
                '.section-header, .about-visual, .about-text > *, ' +
                '.skill-category, .project-card, .timeline-item, ' +
                '.service-card, .contact-info, .contact-form'
            );
            
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                this.observer.observe(el);
            });
            
            // Parallax effect
            window.addEventListener('scroll', () => this.parallax(), { passive: true });
        },
        
        onIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.8s cubic-bezier(0.33, 1, 0.68, 1), transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Unobserve after animation
                    this.observer.unobserve(entry.target);
                }
            });
        },
        
        parallax() {
            const scrolled = window.scrollY;
            
            // Hero background parallax
            const heroOrbs = document.querySelectorAll('.hero-orb');
            heroOrbs.forEach((orb, index) => {
                const speed = 0.3 + (index * 0.1);
                orb.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            const heroGrid = document.querySelector('.hero-grid');
            if (heroGrid) {
                heroGrid.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
        }
    };

    /* ============================================
       3D TILT EFFECT
       ============================================ */
    const TiltEffect = {
        init() {
            this.cards = document.querySelectorAll('[data-tilt]');
            
            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));
                card.addEventListener('mouseleave', () => this.onMouseLeave(card));
            });
        },
        
        onMouseMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degrees
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
        },
        
        onMouseLeave(card) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        }
    };

    /* ============================================
       MAGNETIC BUTTONS
       ============================================ */
    const MagneticButtons = {
        init() {
            this.buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
            
            this.buttons.forEach(button => {
                button.addEventListener('mousemove', (e) => this.onMouseMove(e, button));
                button.addEventListener('mouseleave', () => this.onMouseLeave(button));
            });
        },
        
        onMouseMove(e, button) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 80;
            
            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = x * strength * 0.3;
                const moveY = y * strength * 0.3;
                
                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        },
        
        onMouseLeave(button) {
            button.style.transform = 'translate(0, 0)';
        }
    };

    /* ============================================
       STATS COUNTER
       ============================================ */
    const StatsCounter = {
        init() {
            this.stats = document.querySelectorAll('.stat-number');
            this.animated = false;
            
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.animated) {
                            this.animated = true;
                            this.animateStats();
                        }
                    });
                },
                { threshold: 0.5 }
            );
            
            this.stats.forEach(stat => observer.observe(stat));
        },
        
        animateStats() {
            this.stats.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const animate = () => {
                    current += step;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(animate);
                    } else {
                        stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
                    }
                };
                
                animate();
            });
        }
    };

    /* ============================================
       SKILL PROGRESS BARS
       ============================================ */
    const SkillBars = {
        init() {
            this.bars = document.querySelectorAll('.skill-progress');
            this.animated = false;
            
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.animated) {
                            this.animated = true;
                            this.animateBars();
                        }
                    });
                },
                { threshold: 0.3 }
            );
            
            const skillsSection = document.querySelector('.skills');
            if (skillsSection) observer.observe(skillsSection);
        },
        
        animateBars() {
            this.bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.style.getPropertyValue('--progress');
                }, index * 100);
            });
        }
    };

    /* ============================================
       CONTACT FORM
       ============================================ */
    const ContactForm = {
        init() {
            this.form = document.getElementById('contactForm');
            
            if (this.form) {
                this.form.addEventListener('submit', (e) => this.onSubmit(e));
            }
        },
        
        onSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            console.log('Form submitted:', data);
            
            // Show success message (you can customize this)
            alert('Thank you for your message! I\'ll get back to you soon.');
            
            // Reset form
            this.form.reset();
            
            // In production, you would send this to a backend service
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
        }
    };

    /* ============================================
       LOGO ANIMATION
       ============================================ */
    const LogoAnimation = {
        init() {
            this.logos = document.querySelectorAll('.logo');
            
            this.logos.forEach(logo => {
                logo.addEventListener('mouseenter', () => this.onHover(logo));
                logo.addEventListener('mouseleave', () => this.onLeave(logo));
            });
        },
        
        onHover(logo) {
            const paths = logo.querySelectorAll('path');
            const dot = logo.querySelector('.logo-dot');
            
            paths.forEach((path, index) => {
                setTimeout(() => {
                    path.style.animation = 'drawPath 0.6s ease forwards';
                }, index * 100);
            });
            
            if (dot) {
                dot.style.animation = 'bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s';
            }
        },
        
        onLeave(logo) {
            const paths = logo.querySelectorAll('path');
            const dot = logo.querySelector('.logo-dot');
            
            paths.forEach(path => {
                path.style.animation = '';
            });
            
            if (dot) {
                dot.style.animation = '';
            }
        }
    };

    /* ============================================
       CV DOWNLOAD
       ============================================ */
    const CVDownload = {
        init() {
            // 🔴 IMPORTANT: Place your CV PDF file in the assets folder
            // Example: assets/Shawky-Mohamed-CV.pdf
            // Then update the path below
            this.cvPath = '';
            
            this.buttons = document.querySelectorAll('#downloadCV, #downloadCV2');
            
            this.buttons.forEach(button => {
                button.addEventListener('click', (e) => this.handleDownload(e));
            });
        },
        
        handleDownload(e) {
            e.preventDefault();
            
            // Check if CV path is set
            if (!this.cvPath || this.cvPath === '') {
                this.showNotification();
            } else {
                this.downloadFile();
            }
        },
        
        downloadFile() {
            // Create temporary link to trigger download
            const link = document.createElement('a');
            link.href = this.cvPath;
            link.download = 'Shawky-Mohamed-Resume.pdf';
            link.setAttribute('target', '_blank'); // Open in new tab if PDF viewer available
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        
        showNotification() {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'cv-notification';
            notification.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>CV download will be available soon!</span>
            `;
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            // Hide and remove notification after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
    };

    /* ============================================
       BACK TO TOP BUTTON
       ============================================ */
    const BackToTop = {
        init() {
            this.button = document.getElementById('backToTop');
            
            if (!this.button) return;
            
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
            this.button.addEventListener('click', () => this.scrollToTop());
        },
        
        onScroll() {
            if (window.scrollY > 500) {
                this.button.classList.add('show');
            } else {
                this.button.classList.remove('show');
            }
        },
        
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    /* ============================================
       PERFORMANCE OPTIMIZATION
       ============================================ */
    const Performance = {
        init() {
            // Throttle scroll events
            this.throttle = this.createThrottle(16); // 60fps
            
            // Lazy load images if any
            this.lazyLoadImages();
            
            // Debounce resize events
            window.addEventListener('resize', this.debounce(() => {
                this.onResize();
            }, 250));
        },
        
        createThrottle(limit) {
            let inThrottle;
            return function(func) {
                return function(...args) {
                    if (!inThrottle) {
                        func.apply(this, args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                };
            };
        },
        
        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        
        lazyLoadImages() {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        },
        
        onResize() {
            // Handle responsive adjustments if needed
            console.log('Window resized');
        }
    };

    /* ============================================
       INITIALIZATION
       ============================================ */
    const App = {
        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        },
        
        start() {
            console.log('🚀 Portfolio initialized');
            
            // Initialize all modules
            Cursor.init();
            Theme.init();
            ColorPicker.init();
            LayoutSwitcher.init();
            Navigation.init();
            TypingAnimation.init();
            ScrollAnimations.init();
            TiltEffect.init();
            MagneticButtons.init();
            StatsCounter.init();
            SkillBars.init();
            ContactForm.init();
            LogoAnimation.init();
            CVDownload.init();
            BackToTop.init();
            Performance.init();
            
            // Add loaded class to body for any CSS transitions
            document.body.classList.add('loaded');
            
            console.log('✨ All systems active');
        }
    };

    // Start the application
    App.init();

})();
