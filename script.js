// ==================== CUSTOM CURSOR ====================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
}
if (cursor && cursorFollower) animateCursor();

// ==================== PARTICLE CANVAS ====================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const PARTICLE_COUNT = 80;

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.speedY = (Math.random() - 0.5) * 0.35;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.5 ? '99,102,241' : '6,182,212';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    // Draw connecting lines between close particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==================== NAVIGATION ====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger?.querySelectorAll('span') || [];
        spans.forEach(s => s.style.transform = s.style.opacity = '');
    });
});

// ==================== NAVBAR SCROLL ====================
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
});

// ==================== SCROLL FUNCTION ====================
function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==================== SCROLL PROGRESS BAR ====================
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / scrollable) * 100;
    progressBar.style.width = scrolled + '%';

    // Back to top visibility
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (window.scrollY > 600) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    }
});

// ==================== INTERSECTION OBSERVER ====================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.feature-card, .app-card, .pricing-card, .step-item, .founder-card').forEach(el => {
    revealObserver.observe(el);
});

// ==================== COUNTER ANIMATION ====================
function animateCounter(el, target, suffix, duration = 2000) {
    const start = performance.now();
    const isFloat = !Number.isInteger(target);

    function update(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = target * ease;

        el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();

        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
    }
    requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-target]').forEach(el => {
                const target = parseFloat(el.dataset.target);
                animateCounter(el, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ==================== BILLING TOGGLE ====================
const billingToggle = document.getElementById('billingToggle');
const monthlyLabel = document.getElementById('monthlyLabel');
const annualLabel = document.getElementById('annualLabel');

if (billingToggle) {
    billingToggle.addEventListener('change', () => {
        const isAnnual = billingToggle.checked;
        monthlyLabel.style.color = isAnnual ? 'var(--text-muted)' : 'var(--accent)';
        annualLabel.style.color = isAnnual ? 'var(--accent)' : 'var(--text-muted)';

        document.querySelectorAll('.amount').forEach(el => {
            const newVal = isAnnual ? el.dataset.annual : el.dataset.monthly;
            if (newVal) {
                el.style.transform = 'scale(0.85)';
                el.style.opacity = '0';
                setTimeout(() => {
                    el.textContent = newVal;
                    el.style.transform = 'scale(1)';
                    el.style.opacity = '1';
                }, 200);
            }
        });
    });
}

// ==================== TESTIMONIALS SLIDER ====================
const track = document.getElementById('testimonialsTrack');
const dots = document.querySelectorAll('.t-dot');
let currentSlide = 0;
let totalSlides = document.querySelectorAll('.testimonial-card').length;
let autoSlideInterval;

function goToSlide(index) {
    if (!track) return;
    const cards = document.querySelectorAll('.testimonial-card');
    let perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
    const maxIndex = Math.max(0, totalSlides - perView);
    currentSlide = Math.max(0, Math.min(index, maxIndex));

    const card = cards[0];
    if (!card) return;
    const cardWidth = card.offsetWidth + 24;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    const cards = document.querySelectorAll('.testimonial-card');
    let perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
    const maxIndex = Math.max(0, totalSlides - perView);
    goToSlide(currentSlide >= maxIndex ? 0 : currentSlide + 1);
}

function prevSlide() {
    const cards = document.querySelectorAll('.testimonial-card');
    let perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
    const maxIndex = Math.max(0, totalSlides - perView);
    goToSlide(currentSlide <= 0 ? maxIndex : currentSlide - 1);
}

document.getElementById('tNavNext')?.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

document.getElementById('tNavPrev')?.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoSlide();
    });
});

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4500);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

startAutoSlide();

// Touch support for testimonials
if (track) {
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    });
}

// ==================== FAQ ====================
function toggleFaq(el) {
    const item = el.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
    });

    item.classList.toggle('open', !isOpen);
}

// ==================== DEMO MODAL ====================
const demoBtn = document.getElementById('demoBtn');
const videoModal = document.getElementById('videoModal');
const modalClose = document.getElementById('modalClose');

demoBtn?.addEventListener('click', () => {
    videoModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
});

modalClose?.addEventListener('click', closeModal);
videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) closeModal();
});

function closeModal() {
    videoModal?.classList.remove('active');
    document.body.style.overflow = '';
}

// ==================== NEWSLETTER FORM ====================
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('.newsletter-input');
        const email = emailInput.value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            emailInput.focus();
            emailInput.style.borderColor = '#ef4444';
            emailInput.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
            setTimeout(() => {
                emailInput.style.borderColor = '';
                emailInput.style.boxShadow = '';
            }, 2000);
            return;
        }

        const btn = newsletterForm.querySelector('.subscribe-btn');
        const original = btn.innerHTML;
        btn.innerHTML = '<span>Subscribing...</span>';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        setTimeout(() => {
            emailInput.value = '';
            const nameInput = document.getElementById('nameInput');
            if (nameInput) nameInput.value = '';
            document.querySelectorAll('.interest-tag.active').forEach(t => t.classList.remove('active'));

            btn.innerHTML = '<span>🎉 You\'re in!</span>';
            btn.style.background = 'linear-gradient(135deg, #065f46, #10b981)';

            showNotification('Welcome aboard! Check your inbox for a confirmation.', 'success');

            setTimeout(() => {
                btn.innerHTML = original;
                btn.disabled = false;
                btn.style.opacity = '';
                btn.style.background = '';
            }, 3000);
        }, 1000);
    });
}

// ==================== INTEREST TAGS ====================
function toggleTag(el) {
    el.classList.toggle('active');
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'success') {
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());

    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.innerHTML = `
        <span>${type === 'success' ? '✓' : '✗'}</span>
        <span>${message}</span>
    `;
    document.body.appendChild(el);

    setTimeout(() => {
        el.classList.add('hide');
        setTimeout(() => el.remove(), 350);
    }, 4000);
}

// ==================== RIPPLE EFFECT ====================
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.classList.add('ripple');
    ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
});

// ==================== CARD MAGNETIC TILT ====================
document.querySelectorAll('.feature-card, .app-card, .pricing-card, .founder-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => card.style.transition = '', 500);
    });
});

// ==================== APPS TAB FILTER ====================
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // All cards visible (full grid shows by default; tabs are decorative)
    });
});

// ==================== PARALLAX ORBS ====================
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            document.querySelectorAll('.orb').forEach((orb, i) => {
                const speed = (i + 1) * 0.08;
                orb.style.transform = `translateY(${scrollY * speed}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        navMenu?.classList.remove('active');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        scrollToSection('contact');
    }
});

// ==================== ACTIVE NAV LINK ON SCROLL ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active-nav',
                    link.getAttribute('href') === '#' + entry.target.id
                );
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// ==================== LAZY IMAGE LOADING ====================
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
                imgObserver.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

// ==================== MOCKUP INTERACTIVITY ====================
const sidebarItems = document.querySelectorAll('.sidebar-item');
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// ==================== PRINT STYLES ====================
const printStyle = document.createElement('style');
printStyle.textContent = `
    @media print {
        .navbar, .footer, .btn, .back-to-top, .cursor, .cursor-follower, #progress-bar { display: none; }
        body { background: white; color: black; }
    }
`;
document.head.appendChild(printStyle);

// ==================== INIT ====================
console.log('%cBuildHub ⚡', 'font-size:24px; font-weight:800; color:#6366f1;');
console.log('%cBuilt with passion. Running smoothly.', 'color:#8b92b3;');

// ==================== SERVICE MODAL ====================

/**
 * DATA: Define the content for each service.
 * ------------------------------------------------
 * For "websites" type: each item has { name, url, badge, desc }
 * For "items" type:    each item has { icon, title, desc, tags?, link? }
 * For "coming-soon":   shows a placeholder message
 *
 * 👉 TO ADD YOUR OWN WEBSITES: replace the url values below
 *    with your actual site URLs, e.g. "https://yoursite.com"
 */
const SERVICE_DATA = {
    websites: {
        icon: '💻',
        title: 'Our Websites',
        desc: 'Click any website to preview it, or open it in a new tab.',
        type: 'websites',
        items: [
            {
                name: 'Vector.ioST Main',
                url: 'https://example.com',          // 🔁 Replace with your URL
                badge: 'Live',
                desc: 'Our flagship startup website'
            },
            {
                name: 'Client Portfolio A',
                url: 'https://example.org',           // 🔁 Replace with your URL
                badge: 'Live',
                desc: 'E-commerce redesign project'
            },
            {
                name: 'SaaS Dashboard',
                url: 'https://wikipedia.org',         // 🔁 Replace with your URL
                badge: 'Live',
                desc: 'Analytics & reporting platform'
            },
            {
                name: 'Agency Landing Page',
                url: 'https://mozilla.org',           // 🔁 Replace with your URL
                badge: 'Beta',
                desc: 'Modern agency portfolio site'
            },
        ]
    },
    'online-services': {
        icon: '⚡',
        title: 'Our Online Services',
        desc: 'Fast, scalable digital services available around the clock.',
        type: 'items',
        items: [
            { icon: '🌐', title: 'Web Hosting', desc: '99.99% uptime, edge CDN, SSL included. Deploy your site in minutes.', tags: ['CDN', 'SSL', 'Fast'] },
            { icon: '🤖', title: 'AI Automation', desc: 'Automate repetitive tasks with intelligent workflows and AI pipelines.', tags: ['GPT', 'No-code', 'Zapier-like'] },
            { icon: '📧', title: 'Email Campaigns', desc: 'Design, send, and track beautiful email campaigns that convert.', tags: ['Bulk Email', 'Analytics'] },
            { icon: '🔒', title: 'Security Audits', desc: 'Comprehensive vulnerability scans and security hardening for your web apps.', tags: ['VAPT', 'Compliance'] },
            { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time insights into your users, traffic, and conversion funnels.', tags: ['Real-time', 'Charts'] },
            { icon: '☁️', title: 'Cloud Storage', desc: 'Secure, scalable cloud file storage with easy API integration.', tags: ['S3-compatible', 'Encrypted'] },
        ]
    },
    'offline-services': {
        icon: '🔐',
        title: 'Our Offline Services',
        desc: 'Hands-on professional services delivered on-site.',
        type: 'items',
        items: [
            { icon: '🖨️', title: 'Print & Branding', desc: 'Business cards, banners, brochures, and full brand identity kits printed locally.', tags: ['Branding', 'Print'] },
            { icon: '🏢', title: 'On-Site IT Setup', desc: 'Network setup, workstation configuration, and IT infrastructure installation.', tags: ['Networking', 'Hardware'] },
            { icon: '🎤', title: 'Event Tech Support', desc: 'AV setup, live streaming, and technical support for events and conferences.', tags: ['Events', 'AV', 'Live'] },
            { icon: '📸', title: 'Photography & Video', desc: 'Professional shoots for products, teams, and events with same-day delivery.', tags: ['Media', 'Production'] },
            { icon: '🧑‍🏫', title: 'Training Workshops', desc: 'In-person workshops on digital tools, coding, and entrepreneurship.', tags: ['Education', 'Workshop'] },
            { icon: '🚚', title: 'Product Delivery', desc: 'Swift on-time delivery of physical products and merchandise.', tags: ['Logistics', 'On-time'] },
        ]
    },
    apps: {
        icon: '📱',
        title: 'Mobile Apps',
        desc: 'Native and cross-platform apps we\'ve built and launched.',
        type: 'items',
        items: [
            { icon: '📱', title: 'VectorTask', desc: 'A productivity app for teams — task management, deadlines, and collaboration.', tags: ['iOS', 'Android', 'Free'], link: '#' },
            { icon: '🛒', title: 'ShopVector', desc: 'A full-featured e-commerce app with inventory, orders, and analytics built-in.', tags: ['Android', 'Paid'], link: '#' },
            { icon: '📰', title: 'NewsFlow', desc: 'AI-curated news app delivering personalised feeds with zero noise.', tags: ['iOS', 'Android', 'AI'], link: '#' },
            { icon: '💪', title: 'FitVector', desc: 'Health & fitness tracker with workout plans, diet logs, and progress charts.', tags: ['iOS', 'Beta'], link: '#' },
        ]
    },
    products: {
        icon: '🤖',
        title: 'Our Products',
        desc: 'Digital tools and SaaS products built by Vector.ioST.',
        type: 'items',
        items: [
            { icon: '🧠', title: 'VectorAI Studio', desc: 'Generate content, code, and designs using our proprietary AI engine.', tags: ['AI', 'SaaS', 'Freemium'], link: '#' },
            { icon: '🏗️', title: 'SiteBuilder Pro', desc: 'Drag-and-drop website builder with 200+ templates and live preview.', tags: ['No-code', 'SaaS'], link: '#' },
            { icon: '📊', title: 'DataLens', desc: 'Plug your databases in and get beautiful, shareable dashboards instantly.', tags: ['Analytics', 'B2B'], link: '#' },
            { icon: '🔗', title: 'LinkForge', desc: 'Smart link-in-bio and QR code generator with detailed click analytics.', tags: ['Free', 'Marketing'], link: '#' },
            { icon: '📬', title: 'MailVector', desc: 'Transactional email API with 99.9% deliverability and rich analytics.', tags: ['API', 'Email', 'Dev'], link: '#' },
        ]
    },
    'digital-marketing': {
        icon: '🔗',
        title: 'Digital Marketing',
        desc: 'End-to-end marketing services to grow your brand online.',
        type: 'items',
        items: [
            { icon: '🔍', title: 'SEO Optimisation', desc: 'On-page, off-page, and technical SEO to rank your site on page one.', tags: ['SEO', 'Content', 'Audit'] },
            { icon: '📣', title: 'Social Media Management', desc: 'Content creation, scheduling, and engagement across all major platforms.', tags: ['Instagram', 'LinkedIn', 'X'] },
            { icon: '💰', title: 'Paid Ads (PPC)', desc: 'Google Ads, Meta Ads, and LinkedIn campaigns tuned for maximum ROI.', tags: ['Google Ads', 'Meta', 'ROI'] },
            { icon: '✉️', title: 'Email Marketing', desc: 'Automated drip sequences, newsletters, and re-engagement campaigns.', tags: ['Automation', 'Segments'] },
            { icon: '🎥', title: 'Video & Reels', desc: 'Short-form video content, YouTube SEO, and Reels that go viral.', tags: ['YouTube', 'Reels', 'Creative'] },
            { icon: '📈', title: 'Growth Consulting', desc: 'Strategy sessions and roadmaps to scale your digital presence fast.', tags: ['Strategy', 'Consulting'] },
        ]
    }
};

// ---- Build HTML for each service type ----
function buildServiceContent(serviceKey) {
    const data = SERVICE_DATA[serviceKey];
    if (!data) return '<div class="service-coming-soon"><div class="cs-icon">🚧</div><h3>Coming Soon</h3><p>Content for this service is being prepared.</p></div>';

    if (data.type === 'websites') {
        return `<div class="website-grid">
            ${data.items.map(site => `
                <div class="website-card" data-url="${site.url}" data-name="${site.name}" onclick="openIframeLightbox('${site.url}','${site.name}')">
                    <div class="website-card-preview">
                        <iframe src="${site.url}" tabindex="-1" aria-hidden="true" sandbox="allow-scripts allow-same-origin"></iframe>
                        <div class="website-card-overlay"></div>
                    </div>
                    <div class="website-card-footer">
                        <div>
                            <div class="website-card-name">${site.name}</div>
                            <div class="website-card-url">${site.url.replace(/^https?:\/\//,'')}</div>
                        </div>
                        <span class="website-card-badge ${site.badge.toLowerCase() === 'live' ? 'live' : ''}">${site.badge}</span>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    if (data.type === 'items') {
        return `<div class="service-items-grid">
            ${data.items.map(item => `
                <div class="service-item-card ${item.link ? 'clickable' : ''}" ${item.link ? `onclick="window.open('${item.link}','_blank')"` : ''}>
                    <span class="sic-icon">${item.icon}</span>
                    <div class="sic-title">${item.title}</div>
                    <div class="sic-desc">${item.desc}</div>
                    ${item.tags ? `<div class="sic-tags">${item.tags.map(t=>`<span class="sic-tag">${t}</span>`).join('')}</div>` : ''}
                    ${item.link ? `<a class="sic-link" href="${item.link}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Learn more →</a>` : ''}
                </div>
            `).join('')}
        </div>`;
    }

    return '<div class="service-coming-soon"><div class="cs-icon">🚧</div><h3>Coming Soon</h3><p>We\'re working on this section. Check back soon!</p></div>';
}

// ---- Open / Close service panel ----
function openServicePanel(serviceKey) {
    const data = SERVICE_DATA[serviceKey];
    if (!data) return;

    document.getElementById('servicePanelIcon').textContent = data.icon;
    document.getElementById('servicePanelTitle').textContent = data.title;
    document.getElementById('servicePanelDesc').textContent = data.desc;
    document.getElementById('servicePanelBody').innerHTML = buildServiceContent(serviceKey);

    const overlay = document.getElementById('serviceOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeServicePanel() {
    document.getElementById('serviceOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// ---- iframe Lightbox ----
function openIframeLightbox(url, name) {
    const lb = document.getElementById('iframeLightbox');
    const iframe = document.getElementById('serviceIframe');
    const loading = document.getElementById('iframeLoading');
    const urlBar = document.getElementById('iframeUrlBar');
    const openBtn = document.getElementById('iframeOpenBtn');

    urlBar.textContent = url;
    openBtn.href = url;
    iframe.src = '';
    loading.classList.remove('hidden');

    lb.classList.add('active');

    // slight delay so loading shows first
    setTimeout(() => {
        iframe.src = url;
    }, 80);

    iframe.onload = () => {
        loading.classList.add('hidden');
    };
}

function closeIframeLightbox() {
    const lb = document.getElementById('iframeLightbox');
    lb.classList.remove('active');
    setTimeout(() => {
        document.getElementById('serviceIframe').src = '';
    }, 300);
}

// ---- Wire up feature card clicks ----
document.querySelectorAll('.feature-card[data-service]').forEach(card => {
    card.addEventListener('click', () => {
        openServicePanel(card.dataset.service);
    });
});

// ---- Close buttons ----
document.getElementById('servicePanelClose')?.addEventListener('click', closeServicePanel);
document.getElementById('serviceOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeServicePanel();
});
document.getElementById('iframeLbClose')?.addEventListener('click', closeIframeLightbox);
document.getElementById('iframeLightbox')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeIframeLightbox();
});

// Escape key closes both
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeIframeLightbox();
        closeServicePanel();
    }
});
