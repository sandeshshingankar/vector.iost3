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

document.querySelectorAll('.feature-card, .app-card, .pricing-card, .step-item, .founder-card, .event-row').forEach(el => {
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
// Always start at the top (home section) on page load/refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
    }
});

console.log('%cVector.ioST ⚡', 'font-size:24px; font-weight:800; color:#6366f1;');
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
                name: 'GFM Management System for NMIET',
                url: 'https://sandeshshingankar.github.io/GFM-Demo/',          // 🔁 Replace with your URL
                badge: 'Live',
                desc: 'Management System for NMIET'
            },
            {
                name: 'Hackathon website for NMIET',
                url: 'https://sandeshshingankar.github.io/nmiet-/',           // 🔁 Replace with your URL
                badge: 'Live',
                desc: 'Hackathon website'
            },
            {
                name: 'startup website for BuildHub',
                url: 'https://sandeshshingankar.github.io/vector.iost2/',         // 🔁 Replace with your URL
                badge: 'Live',
                desc: 'startup website'
            },
            {
                name: 'DISTRACTION FREE YOUTUBE for Student',
                url: 'https://sandeshshingankar.github.io/youtube/',           // 🔁 Replace with your URL
                badge: 'Live',
                desc: 'YOUTUBE for Student'
            },
        ]
    },
    'online-services': {
        icon: '⚡',
        title: 'Our Online Services',
        desc: 'Fast, scalable digital services available around the clock.',
        type: 'items',
        items: [
            { icon: '🌐', title: 'Web Hosting', desc: '99.99% uptime, edge CDN, SSL included. Deploy your site in minutes.', tags: ['CDN', 'SSL', 'Fast'], price: '₹4,999/year' },

            { icon: '🤖', title: 'AI Automation', desc: 'Automate repetitive tasks with intelligent workflows and AI pipelines.', tags: ['GPT', 'No-code', 'Zapier-like'], price: '₹9,999/project' },

            { icon: '📧', title: 'Email Campaigns', desc: 'Design, send, and track beautiful email campaigns that convert.', tags: ['Bulk Email', 'Analytics'], price: '₹2,999/month' },

            { icon: '🔒', title: 'Security Audits', desc: 'Comprehensive vulnerability scans and security hardening for your web apps.', tags: ['VAPT', 'Compliance'], price: '₹7,999/audit' },

            { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time insights into your users, traffic, and conversion funnels.', tags: ['Real-time', 'Charts'], price: '₹5,999/project' },

            { icon: '☁️', title: 'Cloud Storage', desc: 'Secure, scalable cloud file storage with easy API integration.', tags: ['S3-compatible', 'Encrypted'], price: '₹1,999/month' },
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
        closeCareerModal();
    }
});

// ==================== CAREERS MODAL ====================
const CAREER_DATA = {
    tech: {
        icon: '🏗️',
        category: 'Tech Role',
        color: '#6366f1',
        roles: [
            {
                title: 'Full Stack Developer',
                type: 'Full-Time · Remote',
                location: 'Pune, India / Remote',
                experience: '1–3 Years',
                salary: '₹4L – ₹10L / year',
                about: 'We are looking for a talented Full Stack Developer to join our growing team at Vector.ioST. You will be responsible for designing and developing web applications, working across the entire stack from frontend to backend, and collaborating with designers and product managers to ship great products.',
                skills: ['React / Next.js', 'Node.js / Express', 'PostgreSQL / MongoDB', 'REST APIs', 'Git & CI/CD', 'TypeScript'],
                responsibilities: [
                    'Build and maintain scalable web applications end-to-end',
                    'Collaborate with the design team to implement pixel-perfect UIs',
                    'Write clean, well-documented, and tested code',
                    'Participate in code reviews and technical architecture discussions',
                    'Optimize applications for maximum speed and scalability'
                ],
                perks: ['Remote-first culture', 'Flexible hours', 'Learning budget', 'Equity options', 'Health insurance']
            },
            {
                title: 'DevOps / Cloud Engineer',
                type: 'Full-Time · Hybrid',
                location: 'Pune, India',
                experience: '2–4 Years',
                salary: '₹6L – ₹14L / year',
                about: 'We are scaling our infrastructure and need a DevOps/Cloud Engineer to help us build reliable, scalable, and secure cloud environments. You will own CI/CD pipelines, cloud architecture, and ensure our services run with 99.99% uptime.',
                skills: ['AWS / GCP', 'Docker & Kubernetes', 'Terraform', 'Linux', 'GitHub Actions', 'Monitoring (Grafana/Datadog)'],
                responsibilities: [
                    'Design and manage cloud infrastructure on AWS/GCP',
                    'Build and maintain CI/CD pipelines for rapid deployment',
                    'Monitor system health and respond to incidents',
                    'Implement security best practices and compliance',
                    'Collaborate with developers on deployment strategies'
                ],
                perks: ['Remote-first culture', 'AWS certification support', 'Equity options', 'Health insurance', 'Conference budget']
            },
            {
                title: 'Mobile App Developer',
                type: 'Full-Time · Remote',
                location: 'Remote',
                experience: '1–3 Years',
                salary: '₹4L – ₹10L / year',
                about: 'Join our mobile team and build beautiful, high-performance apps for iOS and Android. You will work on our consumer-facing products and internal tools, crafting experiences that delight users.',
                skills: ['React Native / Flutter', 'iOS (Swift)', 'Android (Kotlin)', 'REST API Integration', 'App Store / Play Store', 'Firebase'],
                responsibilities: [
                    'Develop and maintain cross-platform mobile applications',
                    'Integrate with backend APIs and third-party services',
                    'Ensure performance and quality of the application',
                    'Collaborate with UX designers on user interface design',
                    'Publish and maintain apps on App Store and Play Store'
                ],
                perks: ['Remote-first culture', 'Flexible hours', 'Device allowance', 'Learning budget', 'Health insurance']
            },
            {
                title: 'Product Developer / Software Engineer',
                type: 'Full-Time · Hybrid',
                location: 'Pune, India',
                experience: '0–2 Years',
                salary: '₹3L – ₹7L / year',
                about: 'An exciting opportunity for a driven Software Engineer to work on our SaaS products. You will work closely with founders and the product team, shipping features fast and iterating based on user feedback.',
                skills: ['JavaScript / TypeScript', 'Python', 'React', 'REST / GraphQL', 'SQL', 'Problem Solving'],
                responsibilities: [
                    'Build new product features from concept to production',
                    'Fix bugs and improve system performance',
                    'Work closely with product team on specifications',
                    'Write unit and integration tests',
                    'Contribute to technical roadmap discussions'
                ],
                perks: ['Fast career growth', 'Startup equity', 'Flexible hours', 'Mentorship', 'Health insurance']
            },
            {
                title: 'Backend Developer',
                type: 'Full-Time · Remote',
                location: 'Remote / Pune',
                experience: '1–3 Years',
                salary: '₹4L – ₹9L / year',
                about: 'We need a strong Backend Developer to build the APIs and services that power our platform. You will design robust, scalable systems and work with databases, microservices, and third-party integrations.',
                skills: ['Node.js / Python / Go', 'REST & GraphQL APIs', 'PostgreSQL / Redis', 'Microservices', 'Docker', 'Auth & Security'],
                responsibilities: [
                    'Design and build RESTful and GraphQL APIs',
                    'Manage and optimize database schemas and queries',
                    'Build microservices and integrate third-party APIs',
                    'Ensure API security, rate limiting, and reliability',
                    'Write technical documentation'
                ],
                perks: ['Remote-first culture', 'Equity options', 'Learning budget', 'Health insurance', 'Flexible hours']
            }
        ]
    },
    ai: {
        icon: '🤖',
        category: 'AI Roles',
        color: '#f472b6',
        roles: [
            {
                title: 'ML Engineer',
                type: 'Full-Time · Remote',
                location: 'Remote',
                experience: '2–4 Years',
                salary: '₹8L – ₹18L / year',
                about: 'Join our AI team to build, train, and deploy machine learning models that power intelligent features across our platform. You will work on recommendation systems, predictive analytics, and intelligent automation.',
                skills: ['Python', 'PyTorch / TensorFlow', 'Scikit-learn', 'MLOps / MLflow', 'Feature Engineering', 'Model Deployment'],
                responsibilities: [
                    'Design, train, and deploy ML models at scale',
                    'Build data pipelines for model training and inference',
                    'Collaborate with product teams to integrate AI features',
                    'Monitor model performance and retrain as needed',
                    'Research and implement state-of-the-art ML techniques'
                ],
                perks: ['Remote-first', 'Research budget', 'Equity options', 'Health insurance', 'Conference access']
            },
            {
                title: 'AI Engineer',
                type: 'Full-Time · Remote',
                location: 'Remote',
                experience: '1–3 Years',
                salary: '₹6L – ₹15L / year',
                about: 'We are building AI-powered features into every part of our platform. As an AI Engineer, you will integrate LLMs, build AI pipelines, and ship production-grade AI features that wow our users.',
                skills: ['LLM APIs (OpenAI, Anthropic)', 'LangChain / LlamaIndex', 'Python', 'Prompt Engineering', 'Vector DBs', 'FastAPI'],
                responsibilities: [
                    'Build and integrate LLM-powered features into products',
                    'Design prompt engineering pipelines and RAG systems',
                    'Evaluate AI output quality and iterate',
                    'Work with product teams to define AI use cases',
                    'Ensure AI systems are reliable and cost-efficient'
                ],
                perks: ['Remote-first', 'AI tool credits', 'Equity options', 'Health insurance', 'Learning budget']
            },
            {
                title: 'NLP Engineer',
                type: 'Full-Time · Remote',
                location: 'Remote',
                experience: '2–4 Years',
                salary: '₹8L – ₹16L / year',
                about: 'We are looking for an NLP Engineer to develop language understanding and generation systems for our AI products, including text classification, entity extraction, and conversational AI.',
                skills: ['Python', 'HuggingFace Transformers', 'spaCy / NLTK', 'BERT / GPT fine-tuning', 'Text Classification', 'Semantic Search'],
                responsibilities: [
                    'Build NLP models for text classification, NER, and summarization',
                    'Fine-tune pre-trained language models on domain data',
                    'Design semantic search and retrieval systems',
                    'Evaluate and benchmark NLP performance',
                    'Collaborate with ML and product teams'
                ],
                perks: ['Remote-first', 'Research access', 'Equity options', 'Health insurance', 'GPU credits']
            },
            {
                title: 'Data Scientist',
                type: 'Full-Time · Hybrid',
                location: 'Pune, India / Remote',
                experience: '1–3 Years',
                salary: '₹5L – ₹12L / year',
                about: 'We have rich data and need a Data Scientist to turn it into insights and intelligent features. You will work on user behavior analysis, churn prediction, growth analytics, and A/B testing.',
                skills: ['Python / R', 'Pandas / NumPy', 'SQL', 'Data Visualization', 'Statistical Modeling', 'A/B Testing'],
                responsibilities: [
                    'Analyze large datasets to uncover actionable insights',
                    'Build predictive models for business metrics',
                    'Design and analyze A/B experiments',
                    'Create dashboards and data visualizations',
                    'Partner with product and engineering on data-driven decisions'
                ],
                perks: ['Hybrid work', 'Data tool access', 'Equity options', 'Health insurance', 'Learning budget']
            },
            {
                title: 'LLM Engineer',
                type: 'Full-Time · Remote',
                location: 'Remote',
                experience: '1–3 Years',
                salary: '₹7L – ₹16L / year',
                about: 'As an LLM Engineer at Vector.ioST, you will work exclusively with large language models — fine-tuning, evaluating, and deploying them to power our AI Studio and other intelligent products.',
                skills: ['Python', 'LLM Fine-tuning (LoRA / QLoRA)', 'RLHF', 'Evaluation Frameworks', 'Hugging Face', 'Model Serving (vLLM)'],
                responsibilities: [
                    'Fine-tune and adapt LLMs for specific tasks',
                    'Build evaluation harnesses to measure LLM quality',
                    'Implement RLHF / DPO pipelines',
                    'Optimize model inference for production',
                    'Stay up to date with latest LLM research'
                ],
                perks: ['Remote-first', 'GPU compute budget', 'Equity options', 'Health insurance', 'Research stipend']
            }
        ]
    },
    offline: {
        icon: '📊',
        category: 'Offline Roles',
        color: '#10b981',
        roles: [
            {
                title: 'Delivery Executive',
                type: 'Part-Time / Full-Time · On-site',
                location: 'Pune, India',
                experience: '0–1 Year',
                salary: '₹2L – ₹4L / year',
                about: 'Be the face of Vector.ioST in the field. As a Delivery Executive, you will ensure that our physical products and merchandise reach clients on time and in perfect condition, while maintaining excellent customer relationships.',
                skills: ['Time Management', 'Customer Service', 'Navigation Apps', 'Communication', 'Reliability'],
                responsibilities: [
                    'Pick up and deliver products to clients on schedule',
                    'Maintain delivery records and update tracking systems',
                    'Handle client queries and resolve on-delivery issues',
                    'Ensure product packaging integrity on delivery',
                    'Report delivery status to operations team'
                ],
                perks: ['Fuel reimbursement', 'Flexible shifts', 'Performance bonus', 'Health insurance', 'Two-wheeler allowance']
            },
            {
                title: 'Social Media Influencer / Creator',
                type: 'Contract · Remote',
                location: 'Anywhere in India',
                experience: 'Portfolio Required',
                salary: '₹15K – ₹50K / month (+ revenue share)',
                about: 'We are partnering with social media creators who align with our brand. As a Vector.ioST Creator, you will create authentic, engaging content about our products and services and grow our brand presence on Instagram, YouTube, and more.',
                skills: ['Content Creation', 'Instagram / YouTube / TikTok', 'Photography / Videography', 'Audience Engagement', 'Brand Awareness'],
                responsibilities: [
                    'Create and post sponsored content about Vector.ioST products',
                    'Produce Reels, Shorts, or YouTube videos as agreed',
                    'Share authentic reviews and product demonstrations',
                    'Engage with your community and respond to comments',
                    'Submit monthly performance analytics reports'
                ],
                perks: ['Flexible work', 'Revenue share', 'Free products', 'Brand partnerships', 'Creative freedom']
            },
            {
                title: 'Video Content Model',
                type: 'Contract · On-site / Remote',
                location: 'Pune, India',
                experience: 'No Experience Required',
                salary: 'Per Project / ₹10K – ₹30K / shoot',
                about: 'We need confident, camera-ready individuals for our advertising campaigns, product Reels, and promotional videos. This is a great opportunity to build your portfolio and be featured in high-quality digital campaigns.',
                skills: ['On-Camera Presence', 'Following Direction', 'Reliability', 'Good Communication', 'Social Media Presence (Bonus)'],
                responsibilities: [
                    'Appear in product advertisements and Reels',
                    'Follow direction from our creative and production team',
                    'Attend scheduled shoots (on-site or remote setup)',
                    'Review and approve final footage',
                    'Sign usage rights agreement for campaign duration'
                ],
                perks: ['Per-project pay', 'Portfolio rights', 'Free styling', 'Flexible schedule', 'Repeat opportunities']
            },
            {
                title: 'Sales & Marketing Executive',
                type: 'Full-Time · On-site',
                location: 'Pune, India',
                experience: '0–2 Years',
                salary: '₹3L – ₹7L / year + incentives',
                about: 'Drive business growth by selling Vector.ioST services to local businesses and entrepreneurs. You will generate leads, pitch our products, close deals, and build long-term client relationships.',
                skills: ['Sales & Negotiation', 'Lead Generation', 'CRM Tools', 'Communication', 'Market Research', 'Cold Outreach'],
                responsibilities: [
                    'Identify and approach potential B2B clients',
                    'Present and pitch Vector.ioST services to prospects',
                    'Manage the full sales cycle from lead to close',
                    'Maintain client relationships post-sale',
                    'Report sales metrics and pipeline status weekly'
                ],
                perks: ['Base + commissions', 'Incentive trips', 'Health insurance', 'Growth path to Senior Sales', 'Travel reimbursement']
            },
            {
                title: 'Technical Support Engineer',
                type: 'Full-Time · On-site / Hybrid',
                location: 'Pune, India',
                experience: '0–2 Years',
                salary: '₹2.5L – ₹6L / year',
                about: 'Join our support team and be the hero our clients rely on. You will troubleshoot technical issues, provide on-site IT support, and ensure our clients get the most out of Vector.ioST products.',
                skills: ['Troubleshooting', 'Networking Basics', 'Hardware Setup', 'Customer Communication', 'Ticketing Systems', 'Windows/Mac/Linux'],
                responsibilities: [
                    'Respond to client technical support tickets',
                    'Perform on-site IT setup and troubleshooting',
                    'Document solutions and update knowledge base',
                    'Escalate complex issues to the engineering team',
                    'Conduct client onboarding sessions'
                ],
                perks: ['Travel allowance', 'Certifications support', 'Health insurance', 'Growth to Senior Support', 'Flexible hours']
            }
        ]
    },
    online: {
        icon: '🛒',
        category: 'Online Roles',
        color: '#06b6d4',
        roles: [
            {
                title: 'Digital Marketing Manager',
                type: 'Full-Time · Remote',
                location: 'Remote',
                experience: '2–4 Years',
                salary: '₹5L – ₹12L / year',
                about: 'Lead our digital marketing efforts across all channels. You will own our SEO strategy, social media presence, paid campaigns, and email marketing to drive growth and brand awareness for Vector.ioST.',
                skills: ['Google Ads / Meta Ads', 'SEO / SEM', 'Email Marketing', 'Analytics (GA4)', 'Social Media Strategy', 'Content Marketing'],
                responsibilities: [
                    'Develop and execute multi-channel digital marketing strategy',
                    'Manage paid advertising campaigns (Google, Meta, LinkedIn)',
                    'Oversee SEO and content calendar',
                    'Analyze marketing data and report on KPIs',
                    'Coordinate with design and content teams'
                ],
                perks: ['Remote-first', 'Ad spend budget', 'Equity options', 'Health insurance', 'Learning budget']
            },
            {
                title: 'SEO / Content Strategist',
                type: 'Full-Time · Remote',
                location: 'Remote',
                experience: '1–3 Years',
                salary: '₹3L – ₹8L / year',
                about: 'We want to be the top result for every search our audience cares about. You will own our content and SEO strategy — from keyword research and content briefs to long-form articles and link building.',
                skills: ['Keyword Research (Ahrefs / SEMrush)', 'On-Page SEO', 'Content Writing', 'Link Building', 'Technical SEO Basics', 'Google Search Console'],
                responsibilities: [
                    'Develop and execute SEO content strategy',
                    'Research keywords and create content briefs',
                    'Write and edit high-quality long-form content',
                    'Track rankings and organic traffic metrics',
                    'Build backlinks through outreach and partnerships'
                ],
                perks: ['Remote-first', 'SEO tool access', 'Flexible hours', 'Health insurance', 'Writing bonuses']
            },
            {
                title: 'Community Manager',
                type: 'Full-Time · Remote',
                location: 'Remote',
                experience: '1–2 Years',
                salary: '₹3L – ₹7L / year',
                about: 'Build and nurture the Vector.ioST community across Discord, Twitter/X, LinkedIn, and beyond. You will be the voice of our brand, engage our audience daily, and create a sense of belonging among our users and fans.',
                skills: ['Community Management', 'Discord / Slack', 'Social Media', 'Content Creation', 'Empathy & Communication', 'Event Planning'],
                responsibilities: [
                    'Manage and grow our Discord, Twitter/X, and LinkedIn communities',
                    'Respond to community messages and questions daily',
                    'Plan and run online community events and AMAs',
                    'Collect and relay community feedback to the product team',
                    'Create engagement-driving content and initiatives'
                ],
                perks: ['Remote-first', 'Flexible hours', 'Health insurance', 'Community budget', 'Brand swag']
            },
            {
                title: 'Customer Success Lead',
                type: 'Full-Time · Remote',
                location: 'Remote',
                experience: '1–3 Years',
                salary: '₹4L – ₹9L / year',
                about: 'Ensure our clients succeed with Vector.ioST products. You will onboard new clients, drive product adoption, resolve issues, and turn happy customers into long-term advocates.',
                skills: ['Customer Onboarding', 'CRM Tools', 'Communication & Empathy', 'Product Knowledge', 'Upselling', 'Data Analysis'],
                responsibilities: [
                    'Onboard new customers and guide initial product setup',
                    'Monitor client health scores and proactively reach out',
                    'Resolve escalated support issues with speed and care',
                    'Conduct quarterly business reviews with key clients',
                    'Identify upsell and expansion opportunities'
                ],
                perks: ['Remote-first', 'Performance bonus', 'Equity options', 'Health insurance', 'Flexible hours']
            }
        ]
    }
};

let currentCareerCategory = null;
let currentJobIndex = 0;

function openCareerModal(categoryKey) {
    const data = CAREER_DATA[categoryKey];
    if (!data) return;
    currentCareerCategory = categoryKey;
    currentJobIndex = 0;
    renderCareerModal(data, 0);
    document.getElementById('careerModalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCareerModal() {
    const overlay = document.getElementById('careerModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function renderCareerModal(data, jobIndex) {
    const job = data.roles[jobIndex];
    const totalJobs = data.roles.length;
    const body = document.getElementById('careerModalBody');
    body.innerHTML = `
        <div class="cm-header" style="--cm-color: ${data.color}">
            <div class="cm-category-row">
                <span class="cm-category-icon">${data.icon}</span>
                <span class="cm-category-label">${data.category}</span>
                <span class="cm-job-counter">${jobIndex + 1} / ${totalJobs}</span>
            </div>
            <h2 class="cm-job-title">${job.title}</h2>
            <div class="cm-meta-row">
                <span class="cm-meta-pill">📍 ${job.location}</span>
                <span class="cm-meta-pill">⏱ ${job.type}</span>
                <span class="cm-meta-pill">💼 ${job.experience}</span>
                <span class="cm-meta-pill cm-salary">💰 ${job.salary}</span>
            </div>
        </div>

        <div class="cm-content">
            <div class="cm-section">
                <h4 class="cm-section-title">About this Role</h4>
                <p class="cm-about-text">${job.about}</p>
            </div>

            <div class="cm-section">
                <h4 class="cm-section-title">Skills Required</h4>
                <div class="cm-skills-grid">
                    ${job.skills.map(s => `<span class="cm-skill-tag">${s}</span>`).join('')}
                </div>
            </div>

            <div class="cm-section">
                <h4 class="cm-section-title">Responsibilities</h4>
                <ul class="cm-resp-list">
                    ${job.responsibilities.map(r => `<li><span class="cm-resp-dot" style="background:${data.color}"></span>${r}</li>`).join('')}
                </ul>
            </div>

            <div class="cm-section">
                <h4 class="cm-section-title">Perks & Benefits</h4>
                <div class="cm-perks-row">
                    ${job.perks.map(p => `<span class="cm-perk-badge">✦ ${p}</span>`).join('')}
                </div>
            </div>
        </div>

        <div class="cm-footer">
            <div class="cm-nav-btns">
                <button class="cm-nav-btn" onclick="navigateCareerJob(-1)" ${jobIndex === 0 ? 'disabled' : ''}>← Prev</button>
                <div class="cm-nav-dots">
                    ${data.roles.map((_, i) => `<span class="cm-nav-dot ${i === jobIndex ? 'active' : ''}" onclick="navigateCareerJob(${i - jobIndex})"></span>`).join('')}
                </div>
                <button class="cm-nav-btn" onclick="navigateCareerJob(1)" ${jobIndex === totalJobs - 1 ? 'disabled' : ''}>Next →</button>
            </div>
            <button class="btn btn-primary btn-glow cm-apply-btn" onclick="applyForJob('${job.title}')">
                <span>Apply for this Role</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
        </div>
    `;
}

function navigateCareerJob(delta) {
    const data = CAREER_DATA[currentCareerCategory];
    if (!data) return;
    const newIndex = currentJobIndex + delta;
    if (newIndex < 0 || newIndex >= data.roles.length) return;
    currentJobIndex = newIndex;
    renderCareerModal(data, currentJobIndex);
}

function applyForJob(jobTitle) {
    // Scroll to contact section and pre-fill interest
    closeCareerModal();
    setTimeout(() => {
        scrollToSection('contact');
        // Try to highlight the relevant interest tag
        const tags = document.querySelectorAll('.interest-tag');
        tags.forEach(t => {
            if (t.textContent.toLowerCase().includes('web') || t.textContent.toLowerCase().includes('app')) {
                t.classList.add('active');
            }
        });
        // Show a small toast
        showToast(`Applying for: ${jobTitle} — fill out the form below!`);
    }, 350);
}

function showToast(msg) {
    let toast = document.getElementById('vectorToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'vectorToast';
        toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(80px);background:var(--primary);color:#fff;padding:0.75rem 1.5rem;border-radius:50px;font-size:0.9rem;z-index:99999;transition:transform 0.35s cubic-bezier(.34,1.56,.64,1),opacity 0.3s;opacity:0;white-space:nowrap;box-shadow:0 8px 32px rgba(99,102,241,0.4);';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(80px)';
    }, 3500);
}

document.getElementById('careerModalClose')?.addEventListener('click', closeCareerModal);
document.getElementById('careerModalOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCareerModal();
});
