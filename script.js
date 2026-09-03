/* ===========================================================
   DONIA ZEINI — PORTFOLIO SCRIPTS
   Particle animation, smooth scroll, scroll spy, reveals,
   certificate viewer, mobile nav.
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── Theme Toggle ───────────────────────────────────── */
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    function getCurrentTheme() {
        return htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    // Particle colors — updated when theme changes
    let particleDotRGB = '99,102,241';
    let particleMouseRGB = '129,140,248';

    function updateParticleColors() {
        const isLight = getCurrentTheme() === 'light';
        particleDotRGB = isLight ? '91,82,224' : '99,102,241';
        particleMouseRGB = isLight ? '124,109,245' : '129,140,248';
    }
    updateParticleColors();

    function setTheme(theme) {
        htmlEl.classList.add('theme-transitioning');
        if (theme === 'light') {
            htmlEl.setAttribute('data-theme', 'light');
        } else {
            htmlEl.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
        updateParticleColors();
        setTimeout(() => htmlEl.classList.remove('theme-transitioning'), 500);
    }

    themeToggle.addEventListener('click', () => {
        const current = getCurrentTheme();
        setTheme(current === 'dark' ? 'light' : 'dark');
    });


    /* ─── Interactive Particle Canvas ────────────────────── */
    const canvas = document.getElementById('heroParticles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 70;
    const CONNECT_DIST = 140;
    const MOUSE_RADIUS = 180;      // mouse connection range
    const MOUSE_REPEL = 100;       // mouse push-away range
    const MOUSE_REPEL_FORCE = 0.8; // how strongly particles are pushed
    let animFrameId;

    // Track mouse position relative to canvas
    const mouse = { x: -9999, y: -9999, active: false };

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Mouse repulsion — gently push particles away from cursor
            if (mouse.active) {
                const mdx = p.x - mouse.x;
                const mdy = p.y - mouse.y;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mDist < MOUSE_REPEL && mDist > 0) {
                    const force = (1 - mDist / MOUSE_REPEL) * MOUSE_REPEL_FORCE;
                    p.vx += (mdx / mDist) * force;
                    p.vy += (mdy / mDist) * force;
                }
            }

            // Dampen velocity so particles don't fly off forever
            p.vx *= 0.98;
            p.vy *= 0.98;

            // Ensure minimum movement so they don't freeze
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed < 0.15) {
                p.vx += (Math.random() - 0.5) * 0.1;
                p.vy += (Math.random() - 0.5) * 0.1;
            }

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0) { p.x = 0; p.vx *= -1; }
            if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -1; }
            if (p.y < 0) { p.y = 0; p.vy *= -1; }
            if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }

            // Draw particle dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particleDotRGB},${p.alpha})`;
            ctx.fill();

            // Connect to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    const lineAlpha = (1 - dist / CONNECT_DIST) * 0.15;
                    ctx.strokeStyle = `rgba(${particleDotRGB},${lineAlpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Connect particle to mouse cursor (brighter, thicker lines)
            if (mouse.active) {
                const mdx = p.x - mouse.x;
                const mdy = p.y - mouse.y;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mDist < MOUSE_RADIUS) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    const lineAlpha = (1 - mDist / MOUSE_RADIUS) * 0.4;
                    ctx.strokeStyle = `rgba(${particleMouseRGB},${lineAlpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }

        // Draw mouse glow dot
        if (mouse.active) {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particleMouseRGB},0.6)`;
            ctx.fill();
            // Outer glow
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
            const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 20);
            glow.addColorStop(0, `rgba(${particleDotRGB},0.15)`);
            glow.addColorStop(1, `rgba(${particleDotRGB},0)`);
            ctx.fillStyle = glow;
            ctx.fill();
        }

        animFrameId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });


    /* ─── Navigation — Scroll & Active Link ──────────────── */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const scrollProgress = document.getElementById('scrollProgress');

    function onScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        navbar.classList.toggle('scrolled', scrollY > 40);

        // Scroll progress bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';

        // Active nav link
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (scrollY >= top) current = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();


    /* ─── Mobile Nav Toggle ──────────────────────────────── */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });


    /* ─── Scroll Reveal (IntersectionObserver) ───────────── */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ─── Language Bar Fill Animation ────────────────────── */
    const langFills = document.querySelectorAll('.language-fill');
    const langObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });

    langFills.forEach(fill => langObserver.observe(fill));


    /* ─── Certificate Click Handler ──────────────────────── */
    const certCards = document.querySelectorAll('.certificate-card');
    const modal = document.getElementById('certModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalClose = document.getElementById('modalClose');
    const modalPrint = document.getElementById('modalPrint');
    const modalDownload = document.getElementById('modalDownload');

    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'];

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const filePath = card.getAttribute('data-file');
            if (!filePath) return;

            const title = card.querySelector('.certificate-title')?.textContent || 'Certificate';
            const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();

            // Encode each path segment to handle spaces & special characters
            const encodedPath = filePath.split('/').map(segment => encodeURIComponent(segment)).join('/');

            if (imageExtensions.includes(ext)) {
                // Show image in modal with save/print options
                modalTitle.textContent = title;
                modalImage.src = encodedPath;
                modalImage.alt = title;
                modalDownload.href = encodedPath;
                modalDownload.setAttribute('download', filePath.split('/').pop());
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                // Open PDF or other files in new tab (browser handles save/print)
                window.open(encodedPath, '_blank');
            }
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalImage.src = '';
    }
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Print certificate from modal
    modalPrint.addEventListener('click', () => {
        const imgSrc = modalImage.src;
        if (!imgSrc) return;
        const printWin = window.open('', '_blank');
        printWin.document.write(`
            <!DOCTYPE html>
            <html><head><title>Print Certificate</title>
            <style>
                body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
                img { max-width: 100%; max-height: 100vh; }
            </style>
            </head><body>
            <img src="${imgSrc}" onload="window.print(); window.close();">
            </body></html>
        `);
        printWin.document.close();
    });


    /* ─── Smooth Scroll for anchor links ─────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
