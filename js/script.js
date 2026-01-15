/* ============================================
   SHAWKY MOHAMED - PORTFOLIO JAVASCRIPT
   Ultra-Creative 3D Interactive System
   ============================================ */

(function () {
    'use strict';

    /* ============================================
       STATE MANAGEMENT
       ============================================ */
    const state = {
        theme: localStorage.getItem('theme') || 'dark',
        layout: localStorage.getItem('layout') || 'modern',
        accentColor: localStorage.getItem('accentColor') || '#00d4ff',
        cursorStyle: localStorage.getItem('cursorStyle') || 'ring'
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
            
            // Trail settings
            this.trail = [];
            this.trailLength = 20;
            this.lastTrailTime = 0;
            this.trailInterval = 12; // ms between trail dots

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
            
            // Add trail particle
            const now = Date.now();
            if (now - this.lastTrailTime > this.trailInterval) {
                this.addTrailParticle(e.clientX, e.clientY);
                this.lastTrailTime = now;
            }
        },
        
        addTrailParticle(x, y) {
            const particle = document.createElement('div');
            particle.className = 'cursor-trail-dot';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            document.body.appendChild(particle);
            
            this.trail.push(particle);
            
            // Remove old particles
            if (this.trail.length > this.trailLength) {
                const old = this.trail.shift();
                old.remove();
            }
            
            // Fade out animation - balanced timing
            setTimeout(() => {
                particle.style.opacity = '0';
                particle.style.transform = 'translate(-50%, -50%) scale(0.3)';
            }, 150);
            
            setTimeout(() => {
                particle.remove();
                const idx = this.trail.indexOf(particle);
                if (idx > -1) this.trail.splice(idx, 1);
            }, 400);
        },

        animate() {
            // INSTANT cursor - no delay
            this.dotX = this.cursorX;
            this.dotY = this.cursorY;
            this.ringX = this.cursorX;
            this.ringY = this.cursorY;

            // Apply translate3d for GPU acceleration
            this.dot.style.transform = `translate3d(${this.dotX}px, ${this.dotY}px, 0) translate(-50%, -50%)`;
            this.ring.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0) translate(-50%, -50%)`;

            requestAnimationFrame(() => this.animate());
        },

        initHoverEffects() {
            const hoverElements = document.querySelectorAll('a, button, .project-card-new, .service-card-new, .skills-column');

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
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
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
       APPEARANCE SWITCHER (Refactored)
       ============================================ */
    const AppearanceSwitcher = {
        init() {
            this.toggle = document.getElementById('appearanceToggle');
            this.modal = document.getElementById('appearanceModal');
            this.layoutBtns = document.querySelectorAll('.layout-btn');
            this.colorBtns = document.querySelectorAll('.color-btn');
            this.cursorBtns = document.querySelectorAll('.cursor-btn');
            this.profileImg = document.querySelector('.profile-img');

            // Image sources (Preserved from old logic)
            this.images = {
                modern: 'assets/images/personal_img/shawky-gradient-bg.jpg',
                split: 'assets/images/personal_img/shawky-event-conference.jpg',
                narrative: 'assets/images/personal_img/shawky-formal-suit.jpg'
            };

            this.toggle.addEventListener('click', () => this.toggleModal());

            // Layout Events
            this.layoutBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const layout = e.currentTarget.dataset.layout;
                    this.switchLayout(layout);
                });
            });

            // Color Events
            this.colorBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const color = e.currentTarget.dataset.color;
                    this.switchColor(color);
                });
            });

            // Cursor Events
            this.cursorBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const cursorStyle = e.currentTarget.dataset.cursor;
                    this.switchCursor(cursorStyle);
                });
            });

            // Initial State
            this.setLayout(state.layout);
            this.switchColor(state.accentColor, false); // false = don't animate/close initially
            this.switchCursor(state.cursorStyle);

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.appearance-switcher')) {
                    this.modal.classList.remove('active');
                }
            });
        },

        toggleModal() {
            this.modal.classList.toggle('active');
        },

        /* --- LAYOUT LOGIC --- */
        switchLayout(layout) {
            this.setLayout(layout);
            this.updateProfileImage(layout);

            // Update UI
            this.layoutBtns.forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`.layout-btn[data-layout="${layout}"]`);
            if (activeBtn) activeBtn.classList.add('active');
        },

        setLayout(layout) {
            state.layout = layout;
            document.documentElement.setAttribute('data-layout', layout);
            localStorage.setItem('layout', layout);
        },

        updateProfileImage(layout) {
            if (this.profileImg && this.images[layout]) {
                this.profileImg.style.opacity = '0';
                this.profileImg.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.profileImg.src = this.images[layout];
                    setTimeout(() => {
                        this.profileImg.style.opacity = '1';
                        this.profileImg.style.transform = 'scale(1)';
                    }, 50);
                }, 300);
            }
        },

        /* --- COLOR LOGIC --- */
        switchColor(color, animate = true) {
            this.setAccentColor(color);

            // Update UI
            this.colorBtns.forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`[data-color="${color}"]`);
            if (activeBtn) activeBtn.classList.add('active');
        },

        setAccentColor(color) {
            state.accentColor = color;
            localStorage.setItem('accentColor', color);

            // Calculate secondary color
            const secondary = Theme.getSecondaryColor(color);
            
            // Get RGB values for rgba() usage
            const rgb = Theme.hexToRgb(color);
            const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

            // Update CSS variables
            document.documentElement.style.setProperty('--accent-color', color);
            document.documentElement.style.setProperty('--accent-secondary', secondary);
            document.documentElement.style.setProperty('--accent-glow', this.hexToRgba(color, 0.4));
            document.documentElement.style.setProperty('--accent-rgb', rgbString);

            // Update logo
            Theme.updateLogoColors();
        },

        hexToRgba(hex, alpha) {
            const rgb = Theme.hexToRgb(hex);
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        },

        /* --- CURSOR STYLE LOGIC --- */
        switchCursor(cursorStyle) {
            this.setCursorStyle(cursorStyle);

            // Update UI
            this.cursorBtns.forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`.cursor-btn[data-cursor="${cursorStyle}"]`);
            if (activeBtn) activeBtn.classList.add('active');
        },

        setCursorStyle(cursorStyle) {
            state.cursorStyle = cursorStyle;
            document.body.setAttribute('data-cursor', cursorStyle);
            localStorage.setItem('cursorStyle', cursorStyle);
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

            // Mobile Menu
            this.hamburger = document.getElementById('hamburger');
            this.mobileMenu = document.getElementById('mobileMenu');
            this.mobileLinks = document.querySelectorAll('.mobile-menu-link');

            // Smooth scroll for desktop
            this.links.forEach(link => {
                link.addEventListener('click', (e) => this.smoothScroll(e));
            });

            // Mobile menu handlers - toggle on hamburger click
            if (this.hamburger) {
                this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
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

        toggleMobileMenu() {
            if (this.mobileMenu.classList.contains('active')) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
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
            // Get the link element (in case user clicked on span inside)
            const link = e.target.closest('a');
            if (!link) return;
            
            const targetId = link.getAttribute('href');
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
                'Software Engineering'
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
                '.section-header, .about-photo-side, .about-text-side > *, ' +
                '.skills-column, .project-card-new, .exp-card, .timeline-item, ' +
                '.service-card-new, .contact-info-column, .contact-form'
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
       3D PHOTO TILT EFFECT (About Section)
       ============================================ */
    const PhotoTilt3D = {
        init() {
            this.photo = document.querySelector('[data-tilt-photo]');
            if (!this.photo) return;

            this.bounds = null;
            this.isHovering = false;

            // Mouse events
            this.photo.addEventListener('mouseenter', () => this.onMouseEnter());
            this.photo.addEventListener('mousemove', (e) => this.onMouseMove(e));
            this.photo.addEventListener('mouseleave', () => this.onMouseLeave());

            // Add smooth transition
            this.photo.style.transition = 'transform 0.1s ease-out';
        },

        onMouseEnter() {
            this.isHovering = true;
            this.bounds = this.photo.getBoundingClientRect();
            this.photo.style.transition = 'none';
        },

        onMouseMove(e) {
            if (!this.isHovering) return;

            const x = e.clientX - this.bounds.left;
            const y = e.clientY - this.bounds.top;

            const centerX = this.bounds.width / 2;
            const centerY = this.bounds.height / 2;

            // Calculate rotation (max 15 degrees)
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            // Apply 3D transform
            this.photo.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale3d(1.05, 1.05, 1.05)
            `;
        },

        onMouseLeave() {
            this.isHovering = false;
            this.photo.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.photo.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
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

            if (this.stats.length === 0) return;

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
                const originalText = stat.textContent.trim();
                const hasPlus = originalText.includes('+');
                const target = parseInt(originalText.replace(/[^0-9]/g, ''));
                
                // Skip if not a valid number
                if (isNaN(target)) return;
                
                const duration = 500; // Very fast animation
                const step = target / (duration / 16);
                let current = 0;

                const animate = () => {
                    current += step;
                    if (current < target) {
                        stat.textContent = Math.floor(current) + (hasPlus ? '+' : '');
                        requestAnimationFrame(animate);
                    } else {
                        stat.textContent = target + (hasPlus ? '+' : '');
                    }
                };

                animate();
            });
        }
    };

    /* ============================================
       CONTACT FORM - EmailJS Integration
       ============================================ */
    const ContactForm = {
        init() {
            this.form = document.getElementById('contactForm');
            
            // EmailJS Configuration
            this.publicKey = 'r7UOn78Ds-u0eFKte';
            this.serviceId = 'service_nrvwdmo';
            this.templateId = 'template_qwz2o6j';
            
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.publicKey);
            }

            if (this.form) {
                this.form.addEventListener('submit', (e) => this.onSubmit(e));
            }
        },

        async onSubmit(e) {
            e.preventDefault();
            
            const submitBtn = this.form.querySelector('.btn-send-message');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(this.form);
            
            // Get current date and time in Gmail style (e.g. Jan 14, 2026, 3:45 PM)
            const now = new Date();
            const timeString = now.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            
            const data = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                subject: formData.get('subject') || 'Portfolio Contact',
                message: formData.get('message'),
                time: timeString
            };

            try {
                // Check if EmailJS is configured
                if (this.publicKey === 'YOUR_PUBLIC_KEY') {
                    // EmailJS not configured - show instructions
                    this.showNotification(
                        'info',
                        'EmailJS Setup Required! Check console for instructions.'
                    );
                    console.log('═══════════════════════════════════════════════════');
                    console.log('📧 EmailJS Setup Instructions:');
                    console.log('═══════════════════════════════════════════════════');
                    console.log('1. Go to https://www.emailjs.com/ and create a free account');
                    console.log('2. Add your Gmail as an Email Service');
                    console.log('3. Create an Email Template with variables:');
                    console.log('   - {{from_name}}');
                    console.log('   - {{from_email}}');
                    console.log('   - {{subject}}');
                    console.log('   - {{message}}');
                    console.log('4. Copy your Public Key, Service ID, and Template ID');
                    console.log('5. Update these values in script.js ContactForm.init()');
                    console.log('═══════════════════════════════════════════════════');
                    console.log('📨 Form Data Received:', data);
                    console.log('═══════════════════════════════════════════════════');
                } else {
                    // Send email via EmailJS
                    await emailjs.send(this.serviceId, this.templateId, data);
                    this.showNotification('success', 'Message sent successfully! I\'ll get back to you soon.');
                    this.form.reset();
                }
            } catch (error) {
                console.error('EmailJS Error:', error);
                this.showNotification('error', 'Failed to send message. Please try WhatsApp instead.');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        },
        
        showNotification(type, message) {
            // Remove existing notification if any
            const existing = document.querySelector('.form-notification');
            if (existing) existing.remove();
            
            const notification = document.createElement('div');
            notification.className = `form-notification form-notification-${type}`;
            
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                info: 'fa-info-circle'
            };
            
            notification.innerHTML = `
                <i class="fas ${icons[type]}"></i>
                <span>${message}</span>
            `;
            
            // Add styles if not already in CSS
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%) translateY(-20px);
                padding: 14px 24px;
                border-radius: 50px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 90%;
                text-align: center;
            `;
            
            // Type-specific colors
            const colors = {
                success: { bg: '#10b981', color: '#fff' },
                error: { bg: '#ef4444', color: '#fff' },
                info: { bg: 'var(--accent-color)', color: '#000' }
            };
            
            notification.style.background = colors[type].bg;
            notification.style.color = colors[type].color;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(-50%) translateY(0)';
            }, 100);
            
            // Remove after 5 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }
    };

    /* ============================================
       LOGO ANIMATION
       ============================================ */
    const LogoAnimation = {
        init() {
            this.logoContainer = document.querySelector('.nav-logo');
            this.logo = document.querySelector('#logo');

            if (!this.logoContainer || !this.logo) return;

            // Start idle animation loop
            this.startIdleAnimation();
            
            // Click to scroll to top
            this.logoContainer.addEventListener('click', () => {
                document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
            });
        },

        startIdleAnimation() {
            // Every 6 seconds, trigger a special animation
            setInterval(() => {
                if (!this.isHovered) {
                    this.playSpecialAnimation();
                }
            }, 6000);
            
            this.logoContainer.addEventListener('mouseenter', () => {
                this.isHovered = true;
            });
            
            this.logoContainer.addEventListener('mouseleave', () => {
                this.isHovered = false;
            });
        },

        playSpecialAnimation() {
            const letters = this.logo.querySelectorAll('.logo-letter');
            
            // Add a special class for animation
            this.logo.classList.add('logo-special-anim');
            
            // Animate letters sequentially
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    letter.style.transform = 'translateY(-3px)';
                    letter.style.transition = 'transform 0.3s ease';
                    
                    setTimeout(() => {
                        letter.style.transform = 'translateY(0)';
                    }, 300);
                }, index * 150);
            });
            
            setTimeout(() => {
                this.logo.classList.remove('logo-special-anim');
            }, 1000);
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
            return function (func) {
                return function (...args) {
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
            return function (...args) {
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
        }
    };

    /* ============================================
       PROJECTS FILTER & MODAL
       ============================================ */
    const ProjectsSection = {
        // Projects Data
        projectsData: {
            'auraguard': {
                title: 'AuraGuard',
                category: 'Flutter',
                featured: true,
                tagline: 'Smart Safety App for Women - Graduation Project',
                overview: 'A comprehensive safety application designed to protect women in emergency situations. Features real-time location sharing, emergency contacts, and instant alert system.',
                problem: 'Women often face safety concerns, especially when traveling alone. Traditional SOS methods are slow and unreliable.',
                solution: 'AuraGuard provides instant emergency alerts, real-time location tracking, and seamless communication with trusted contacts.',
                role: 'Flutter Developer - Designed UI/UX and implemented Flutter frontend with clean architecture.',
                techStack: ['Flutter', 'Dart', 'SignalR', 'Azure', 'SQLite', 'Clean Architecture'],
                tools: ['VS Code', 'Android Studio', 'Azure DevOps', 'Figma'],
                results: [
                    'Successfully completed as graduation project',
                    'Real-time location sharing with SignalR',
                    'Seamless emergency contact notification system',
                    'Clean architecture for maintainability'
                ],
                github: null,
                live: null,
                image: 'assets/images/projects/auraguard.png'
            },
            'movix': {
                title: 'MoviX',
                category: 'Flutter',
                featured: false,
                tagline: 'Movie Discovery App powered by TMDB API',
                overview: 'A beautiful movie browsing application that allows users to discover, search, and save their favorite movies.',
                problem: 'Movie enthusiasts need a quick and beautiful way to browse movies, check ratings, and save watchlists.',
                solution: 'MoviX provides an intuitive interface with real-time movie data from TMDB, including ratings, trailers, and detailed information.',
                role: 'Flutter Developer - Built complete app using Flutter and GetX state management.',
                techStack: ['Flutter', 'Dart', 'GetX', 'TMDB API', 'REST API'],
                tools: ['VS Code', 'Postman', 'Git'],
                results: [
                    'Smooth infinite scrolling with pagination',
                    'Fast search with debounce optimization',
                    'Local favorites storage',
                    'Clean and responsive UI'
                ],
                github: 'https://github.com/ShawkyMohamed2004/movie_app',
                live: null,
                image: 'assets/images/projects/movix.png'
            },
            'cloudink': {
                title: 'CloudInk',
                category: 'Flutter',
                featured: false,
                tagline: 'Cloud-based Notes App with Firebase',
                overview: 'A modern note-taking application with cloud synchronization, allowing users to access their notes from any device.',
                problem: 'Users need a reliable way to store and sync notes across multiple devices securely.',
                solution: 'CloudInk uses Firebase for real-time sync and authentication, ensuring notes are always accessible and secure.',
                role: 'Flutter Developer - Implemented Firebase integration and Provider state management.',
                techStack: ['Flutter', 'Dart', 'Firebase', 'Provider', 'Cloud Firestore'],
                tools: ['VS Code', 'Firebase Console', 'Git'],
                results: [
                    'Real-time synchronization across devices',
                    'Secure authentication with Firebase Auth',
                    'Rich text formatting support',
                    'Offline-first architecture'
                ],
                github: 'https://github.com/ShawkyMohamed2004/CloudInk',
                live: null,
                image: 'assets/images/projects/cloudink.png'
            },
            'bookandgo': {
                title: 'Book&Go',
                category: 'Web Development',
                featured: false,
                tagline: 'Hotel Booking Platform - Web Project',
                overview: 'A responsive hotel booking website with modern UI, featuring search functionality and booking system.',
                problem: 'Hotels need an attractive and user-friendly platform to showcase their properties and accept bookings.',
                solution: 'Book&Go provides a clean interface for browsing hotels, checking availability, and making reservations.',
                role: 'Frontend Developer - Built responsive layout with HTML, CSS, Bootstrap and JavaScript.',
                techStack: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'],
                tools: ['VS Code', 'Git', 'Chrome DevTools'],
                results: [
                    'Fully responsive design for all devices',
                    'Interactive room gallery and filters',
                    'Form validation for booking',
                    'Smooth animations and transitions'
                ],
                github: 'https://github.com/ShawkyMohamed2004/Book-and-Go',
                live: 'https://shawkymohamed2004.github.io/Book-and-Go/',
                image: 'assets/images/projects/bookandgo.png'
            }
        },

        init() {
            this.filterBtns = document.querySelectorAll('.filter-btn');
            this.projectCards = document.querySelectorAll('.project-card-new');
            this.emptyState = document.querySelector('.projects-empty-state');
            this.modal = document.querySelector('.project-modal');
            this.statsElements = document.querySelectorAll('.projects-stat-number');
            
            if (!this.filterBtns.length) return;
            
            this.bindEvents();
            this.updateStats();
        },

        bindEvents() {
            // Filter buttons
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => this.handleFilter(btn));
            });

            // Details buttons
            document.querySelectorAll('.project-details-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = e.target.closest('.project-card-new');
                    if (card) {
                        this.openModal(card.dataset.project);
                    }
                });
            });

            // View buttons
            document.querySelectorAll('.project-view-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = e.target.closest('.project-card-new');
                    if (card) {
                        const projectId = card.dataset.project;
                        const project = this.projectsData[projectId];
                        if (project && project.github) {
                            window.open(project.github, '_blank');
                        }
                    }
                });
            });

            // Experience project links
            document.querySelectorAll('.exp-project-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const projectId = link.dataset.project;
                    if (projectId && this.projectsData[projectId]) {
                        // Scroll to projects section
                        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                        // Open modal after scroll
                        setTimeout(() => {
                            this.openModal(projectId);
                        }, 500);
                    }
                });
            });

            // Modal close
            if (this.modal) {
                this.modal.querySelector('.project-modal-close')?.addEventListener('click', () => this.closeModal());
                this.modal.querySelector('.project-modal-overlay')?.addEventListener('click', () => this.closeModal());
            }

            // Escape key to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                    this.closeModal();
                }
            });
        },

        handleFilter(activeBtn) {
            // Update active state
            this.filterBtns.forEach(btn => btn.classList.remove('active'));
            activeBtn.classList.add('active');

            const filter = activeBtn.dataset.filter;
            let visibleCount = 0;

            this.projectCards.forEach(card => {
                const category = card.dataset.category;
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, visibleCount * 100);
                    
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Show/hide empty state
            if (this.emptyState) {
                this.emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
            }

            // Update stats
            this.updateStats(filter);
        },

        updateStats(filter = 'all') {
            let projectCount = 0;
            let techCount = new Set();
            let liveCount = 0;
            let featuredCount = 0;

            this.projectCards.forEach(card => {
                const category = card.dataset.category;
                const shouldCount = filter === 'all' || category === filter;
                
                if (shouldCount) {
                    const projectId = card.dataset.project;
                    const project = this.projectsData[projectId];
                    
                    if (project) {
                        projectCount++;
                        project.techStack.forEach(tech => techCount.add(tech));
                        if (project.live) liveCount++;
                        if (project.featured) featuredCount++;
                    }
                }
            });

            // Animate stats
            if (this.statsElements.length >= 4) {
                this.animateStat(this.statsElements[0], projectCount);
                this.animateStat(this.statsElements[1], techCount.size);
                this.animateStat(this.statsElements[2], liveCount);
                this.animateStat(this.statsElements[3], featuredCount);
            }
        },

        animateStat(element, target) {
            const start = parseInt(element.textContent) || 0;
            const duration = 500;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(start + (target - start) * eased);
                
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        },

        openModal(projectId) {
            const project = this.projectsData[projectId];
            if (!project || !this.modal) return;

            // Populate modal content
            this.modal.querySelector('.project-modal-title').textContent = project.title;
            this.modal.querySelector('.modal-category-badge').textContent = project.category;
            this.modal.querySelector('.project-modal-tagline').textContent = project.tagline;
            
            // Featured badge
            const featuredBadge = this.modal.querySelector('.modal-featured-badge');
            if (featuredBadge) {
                featuredBadge.style.display = project.featured ? 'flex' : 'none';
            }

            // Project Image
            const imageContainer = this.modal.querySelector('#modalImage');
            if (imageContainer && project.image) {
                imageContainer.innerHTML = `<img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 12px;">`;
            }

            // Overview
            const overviewEl = this.modal.querySelector('#modalOverview') || this.modal.querySelector('.modal-overview-text');
            if (overviewEl) overviewEl.textContent = project.overview;

            // Problem & Solution
            const problemEl = this.modal.querySelector('#modalProblem') || this.modal.querySelector('.modal-problem-text');
            const solutionEl = this.modal.querySelector('#modalSolution') || this.modal.querySelector('.modal-solution-text');
            if (problemEl) problemEl.textContent = project.problem;
            if (solutionEl) solutionEl.textContent = project.solution;

            // Role
            const roleEl = this.modal.querySelector('#modalRole') || this.modal.querySelector('.modal-role-text');
            if (roleEl) roleEl.textContent = project.role;

            // Tech Stack
            const techContainer = this.modal.querySelector('#modalTechStack') || this.modal.querySelector('.modal-tech-stack');
            if (techContainer) {
                techContainer.innerHTML = project.techStack.map(tech => 
                    `<span class="tech-tag">${tech}</span>`
                ).join('');
            }

            // Tools
            const toolsContainer = this.modal.querySelector('#modalTools') || this.modal.querySelector('.modal-tools');
            if (toolsContainer) {
                toolsContainer.innerHTML = project.tools.map(tool => 
                    `<span class="tech-tag">${tool}</span>`
                ).join('');
            }

            // Results
            const resultsContainer = this.modal.querySelector('#modalResults') || this.modal.querySelector('.modal-results-list');
            if (resultsContainer) {
                resultsContainer.innerHTML = project.results.map(result => 
                    `<li>${result}</li>`
                ).join('');
            }

            // Action buttons
            const githubBtn = this.modal.querySelector('#modalGithub') || this.modal.querySelector('.modal-btn-github');
            const liveBtn = this.modal.querySelector('#modalDemo') || this.modal.querySelector('.modal-btn-live');
            
            if (githubBtn) {
                githubBtn.href = project.github || '#';
                githubBtn.classList.toggle('disabled', !project.github);
            }
            
            if (liveBtn) {
                liveBtn.href = project.live || '#';
                liveBtn.classList.toggle('disabled', !project.live);
            }

            // Show modal
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        },

        closeModal() {
            if (this.modal) {
                this.modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    };

    /* ============================================
       INITIALIZATION
       ============================================ */
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize all modules
        Cursor.init();
        Theme.init();
        AppearanceSwitcher.init();
        Navigation.init();
        TypingAnimation.init();
        ScrollAnimations.init();
        TiltEffect.init();
        PhotoTilt3D.init();
        MagneticButtons.init();
        StatsCounter.init();
        ContactForm.init();
        LogoAnimation.init();
        CVDownload.init();
        BackToTop.init();
        Performance.init();
        ProjectsSection.init();

        console.log('%c🚀 Portfolio Initialized Successfully!', 'color: #00d4ff; font-size: 14px; font-weight: bold;');
    });

})();