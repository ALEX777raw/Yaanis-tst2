(function() {
  // Loader
  const loader = document.getElementById('loader');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hideLoader() {
    if (!loader) return;
    loader.classList.add('is-hidden');
    window.setTimeout(() => loader.remove(), 900);
  }

  if (loader) {
    if (document.readyState === 'complete') {
      window.setTimeout(hideLoader, 250);
    } else {
      window.addEventListener('load', () => window.setTimeout(hideLoader, reduceMotion ? 0 : 350), { once: true });
    }
  }

  // Parallax clouds - enhanced
  const clouds = document.querySelectorAll('[data-parallax]');
  const heroSky = document.querySelector('.hero-sky');
  const bgClouds = document.querySelectorAll('.bg-cloud');
  const heroClouds = document.querySelectorAll('.hero-cloud');
  const svgCloudSections = document.querySelectorAll('.svg-cloud-section');
  const floatingDecorClouds = document.querySelectorAll('.floating-decor-cloud');
  let ticking = false;
  let vh = window.innerHeight;
  let vw = window.innerWidth;

  window.addEventListener('resize', () => {
    vh = window.innerHeight;
    vw = window.innerWidth;
  }, { passive: true });

  function updateParallax() {
    const scrollY = window.scrollY;
    const scrollProgress = Math.min(1, scrollY / (vh * 2));

    // Update data-parallax clouds
    clouds.forEach(cloud => {
      const speed = parseFloat(cloud.dataset.parallax);
      cloud.style.transform = `translateY(${scrollY * speed * 80}px)`;
    });

    // Background clouds move with scroll - different speeds for depth
    bgClouds.forEach((cloud, index) => {
      const speeds = [0.15, 0.12, 0.18, 0.14, 0.1];
      const speed = speeds[index] || 0.12;
      const yOffset = scrollY * speed;
      const xDrift = Math.sin(scrollY * 0.001 + index) * 30;
      cloud.style.transform = `translateY(${yOffset}px) translateX(${xDrift}px)`;
    });

    // Hero clouds follow scroll down
    heroClouds.forEach((cloud, index) => {
      const speeds = [0.2, 0.16, 0.22, 0.15, 0.18];
      const speed = speeds[index] || 0.16;
      const yOffset = scrollY * speed;
      const xDrift = Math.sin(scrollY * 0.002 + index * 0.5) * 40;
      cloud.style.transform = `translateY(${yOffset}px) translateX(${xDrift}px)`;
    });

    // SVG cloud sections - subtle parallax effect
    svgCloudSections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewCenter = vh / 2;
      const offset = (sectionCenter - viewCenter) * 0.03;
      const xDrift = Math.sin(scrollY * 0.0008 + index * 1.5) * 15;
      section.style.transform = `translateY(${offset}px) translateX(${xDrift}px)`;
    });

    // Floating decoration clouds parallax
    floatingDecorClouds.forEach((cloud, index) => {
      const speed = 0.05 + (index * 0.02);
      const yOffset = scrollY * speed;
      const xDrift = Math.sin(scrollY * 0.001 + index * 0.8) * 25;
      cloud.style.transform = `translateY(${yOffset}px) translateX(${xDrift}px)`;
    });

    if (heroSky) {
      const progress = Math.min(1, Math.max(0, scrollY / (vh * 0.9)));
      const eased = progress * progress * (3 - 2 * progress); // smoothstep
      const baseOpacity = 0.62;
      heroSky.style.setProperty('--sky-y', `${-eased * 220}px`);
      heroSky.style.setProperty('--sky-s', `${1 + eased * 0.08}`);
      heroSky.style.setProperty('--sky-a', `${baseOpacity * (1 - eased)}`);
    }
    ticking = false;
  }

  requestAnimationFrame(updateParallax);

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // Reveal on scroll
  const reveals = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Run heavy section animations only when visible
  const animBlocks = document.querySelectorAll('.card, .panel, .video-wrapper, .contact-panel');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => e.target.classList.toggle('is-active', e.isIntersecting));
    }, { threshold: 0.01, rootMargin: '250px 0px 250px 0px' });

    animBlocks.forEach(el => io.observe(el));
  } else {
    animBlocks.forEach(el => el.classList.add('is-active'));
  }

  // Platform hover sound effect (optional visual feedback)
  document.querySelectorAll('.platform').forEach(platform => {
    platform.addEventListener('mouseenter', () => {
      platform.style.zIndex = '10';
    });
    platform.addEventListener('mouseleave', () => {
      platform.style.zIndex = '';
    });
  });

  // Angel cursor
  const cursor = document.querySelector('.angel-cursor');
  const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  if (cursor && finePointer && !reduceMotion) {
    cursor.classList.add('is-visible');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    const smoothing = 0.18;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    window.addEventListener('mousedown', () => cursor.classList.add('is-down'), { passive: true });
    window.addEventListener('mouseup', () => cursor.classList.remove('is-down'), { passive: true });

    document.addEventListener('pointerover', (e) => {
      if (e.target.closest('a, button, .platform')) cursor.classList.add('is-hover');
    }, { passive: true });

    document.addEventListener('pointerout', (e) => {
      const fromInteractive = e.target.closest && e.target.closest('a, button, .platform');
      if (!fromInteractive) return;
      const toInteractive = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('a, button, .platform');
      if (toInteractive) return;
      cursor.classList.remove('is-hover');
    }, { passive: true });

    function tick() {
      currentX += (mouseX - currentX) * smoothing;
      currentY += (mouseY - currentY) * smoothing;
      cursor.style.left = currentX + 'px';
      cursor.style.top = currentY + 'px';
      requestAnimationFrame(tick);
    }

    tick();
  } else if (cursor) {
    cursor.remove();
  }

  let pageHidden = false;
  document.addEventListener('visibilitychange', () => {
    pageHidden = document.hidden;
    document.documentElement.classList.toggle('is-page-hidden', pageHidden);
  });

  // Mobile Menu
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');

  if (burger && nav) {
    const close = () => {
      burger.classList.remove('is-active');
      nav.classList.remove('is-active');
      document.documentElement.classList.remove('nav-open');
    };

    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      burger.classList.toggle('is-active');
      nav.classList.toggle('is-active');
      document.documentElement.classList.toggle('nav-open', nav.classList.contains('is-active'));
    });

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-active') && !nav.contains(e.target) && !burger.contains(e.target)) close();
    });

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // ============================================
  // MEGA VISUAL EFFECTS SYSTEM
  // ============================================

  // Create effect containers if they don't exist
  function createEffectContainers() {
    const containers = [
      'wind-particles', 'dust-motes', 'feathers',
      'light-rays', 'aurora', 'ribbons'
    ];

    containers.forEach(name => {
      if (!document.querySelector('.' + name)) {
        const container = document.createElement('div');
        container.className = name;
        container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(container);
      }
    });
  }

  createEffectContainers();

  // Create magical sparkles
  function createSparkles() {
    const container = document.querySelector('.sparkles');
    if (!container || reduceMotion) return;

    const count = 30;
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      const isGolden = Math.random() > 0.7;
      const isLarge = Math.random() > 0.8;

      sparkle.className = `sparkle${isGolden ? ' sparkle--golden' : ''}${isLarge ? ' sparkle--large' : ''}`;
      sparkle.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 8}s;
        animation-duration: ${3 + Math.random() * 4}s;
      `;
      container.appendChild(sparkle);
    }
  }

  // Create wind particles
  function createWindParticles() {
    const container = document.querySelector('.wind-particles');
    if (!container || reduceMotion) return;

    const count = 25;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const types = ['thin', 'medium', 'thick'];
      const type = types[Math.floor(Math.random() * types.length)];

      particle.className = `wind-particle wind-particle--${type}`;
      particle.style.cssText = `
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 15}s;
        animation-duration: ${10 + Math.random() * 15}s;
        opacity: ${0.2 + Math.random() * 0.5};
      `;
      container.appendChild(particle);
    }
  }

  // Create dust motes
  function createDustMotes() {
    const container = document.querySelector('.dust-motes');
    if (!container || reduceMotion) return;

    const count = 40;
    for (let i = 0; i < count; i++) {
      const mote = document.createElement('div');
      const isGolden = Math.random() > 0.75;
      const isLarge = Math.random() > 0.85;

      mote.className = `dust-mote${isGolden ? ' dust-mote--golden' : ''}${isLarge ? ' dust-mote--large' : ''}`;
      mote.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 20}s;
        animation-duration: ${15 + Math.random() * 20}s;
      `;
      container.appendChild(mote);
    }
  }

  // Create floating feathers
  function createFeathers() {
    const container = document.querySelector('.feathers');
    if (!container || reduceMotion) return;

    const count = 8;
    for (let i = 0; i < count; i++) {
      const feather = document.createElement('div');
      const isGolden = Math.random() > 0.7;
      const isSmall = Math.random() > 0.6;

      feather.className = `feather${isGolden ? ' feather--golden' : ''}${isSmall ? ' feather--small' : ''}`;
      feather.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 25}s;
        animation-duration: ${20 + Math.random() * 15}s;
      `;
      container.appendChild(feather);
    }
  }

  // Create magic orbs
  function createMagicOrbs() {
    const container = document.querySelector('.magic-orbs');
    if (!container || reduceMotion) return;

    const count = 12;
    for (let i = 0; i < count; i++) {
      const orb = document.createElement('div');
      const isGolden = Math.random() > 0.6;
      const sizes = ['small', 'medium', 'large'];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      orb.className = `magic-orb magic-orb--${size}${isGolden ? ' magic-orb--golden' : ''}`;
      orb.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 12}s;
        animation-duration: ${10 + Math.random() * 8}s;
      `;
      container.appendChild(orb);
    }
  }

  // Create light rays
  function createLightRays() {
    const container = document.querySelector('.light-rays');
    if (!container || reduceMotion) return;

    const count = 5;
    for (let i = 0; i < count; i++) {
      const ray = document.createElement('div');
      const types = ['', 'narrow', 'wide'];
      const type = types[Math.floor(Math.random() * types.length)];

      ray.className = `light-ray${type ? ' light-ray--' + type : ''}`;
      ray.style.cssText = `
        left: ${10 + Math.random() * 80}%;
        animation-delay: ${Math.random() * 8}s;
        transform: rotate(${-15 + Math.random() * 30}deg);
      `;
      container.appendChild(ray);
    }
  }

  // Create aurora waves
  function createAurora() {
    const container = document.querySelector('.aurora');
    if (!container || reduceMotion) return;

    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.className = 'aurora-wave';
      wave.style.animationDelay = `${-i * 7}s`;
      container.appendChild(wave);
    }
  }

  // Create flowing ribbons
  function createRibbons() {
    const container = document.querySelector('.ribbons');
    if (!container || reduceMotion) return;

    const count = 6;
    for (let i = 0; i < count; i++) {
      const ribbon = document.createElement('div');
      const isGolden = Math.random() > 0.6;

      ribbon.className = `ribbon${isGolden ? ' ribbon--golden' : ''}`;
      ribbon.style.cssText = `
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 15}s;
        animation-duration: ${12 + Math.random() * 10}s;
      `;
      container.appendChild(ribbon);
    }
  }

  // Create pulsing halos
  function createHalos() {
    const container = document.querySelector('.halos');
    if (!container || reduceMotion) return;

    const count = 5;
    for (let i = 0; i < count; i++) {
      const halo = document.createElement('div');
      const isGolden = Math.random() > 0.5;
      const size = 50 + Math.random() * 100;

      halo.className = `halo${isGolden ? ' halo--golden' : ''}`;
      halo.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${Math.random() * 4}s;
        animation-duration: ${3 + Math.random() * 3}s;
      `;
      container.appendChild(halo);
    }
  }

  // Add cloud shadows
  function addCloudShadows() {
    const cloudSections = document.querySelectorAll('.svg-cloud-section');

    cloudSections.forEach(section => {
      const shadow = document.createElement('div');
      shadow.className = 'cloud-shadow';
      section.appendChild(shadow);
    });
  }

  // Mouse trail sparkles
  let lastSparkleTime = 0;
  function createMouseSparkle(x, y) {
    const now = Date.now();
    if (now - lastSparkleTime < 100) return;
    lastSparkleTime = now;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle sparkle--golden';
    sparkle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 2000);
  }

  // Initialize all effects
  function initEffects() {
    if (reduceMotion) return;

    createWindParticles();
    createDustMotes();
    createFeathers();
    createLightRays();
    createAurora();
    createRibbons();
    addCloudShadows();
  }

  // Add floating cloud decorations to content area
  function addFloatingClouds() {
    const infoSections = document.querySelector('.info-sections');
    if (!infoSections || reduceMotion) return;

    const cloudDecorations = document.createElement('div');
    cloudDecorations.className = 'floating-cloud-decorations';
    cloudDecorations.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 6; i++) {
      const cloud = document.createElement('div');
      cloud.className = `floating-decor-cloud floating-decor-cloud--${i + 1}`;
      cloud.innerHTML = `<img src="6945e575-fd70-45b8-ae4e-eb286e756b15.png" alt="">`;
      cloudDecorations.appendChild(cloud);
    }

    infoSections.prepend(cloudDecorations);
  }

  // Reveal animation for cloud sections
  function setupCloudReveal() {
    const cloudSections = document.querySelectorAll('.svg-cloud-section[data-reveal]');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

      cloudSections.forEach(el => observer.observe(el));
    } else {
      cloudSections.forEach(el => el.classList.add('revealed'));
    }
  }

  // Initialize everything
  initEffects();
  addFloatingClouds();
  setupCloudReveal();
})();
