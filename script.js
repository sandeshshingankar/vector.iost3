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
