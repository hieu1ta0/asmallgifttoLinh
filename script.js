/* WOW effects: confetti, petals, balloons, fireworks, personalization */
(function () {
  // Confetti
  const confettiLayer = document.getElementById('confetti-layer');
  const confettiButtons = document.querySelectorAll('.btn[data-confetti]');

  const palettes = {
    graduation: ['#ffd6ea', '#ff8dbf', '#e74b94', '#d7c7ff', '#ffffff'],
    birthday: ['#ffc7e1', '#ff73b1', '#ffb7d8', '#b9a3ff', '#fff0f6']
  };

  function createConfettiPiece(xPercent, delay, theme) {
    const div = document.createElement('div');
    div.className = 'confetti';
    const colors = palettes[theme] || palettes.birthday;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const w = 6 + Math.random() * 10;
    const h = 8 + Math.random() * 18;
    const left = Math.max(2, Math.min(98, xPercent + (Math.random() * 20 - 10)));
    const duration = 4 + Math.random() * 2.5;

    div.style.left = left + 'vw';
    div.style.width = w + 'px';
    div.style.height = h + 'px';
    div.style.background = color;
    div.style.borderRadius = Math.random() > 0.6 ? '999px' : '4px';
    div.style.animation = `drop ${duration}s ease-in ${delay}s forwards`;
    div.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
    div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';

    return div;
  }

  function burstConfetti(theme) {
    if (!confettiLayer) return;
    const isMobile = window.innerWidth <= 768;
    const count = isMobile ? 60 : 110;
    const startX = 50;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const delay = (i % (isMobile ? 8 : 14)) * 0.05 + Math.random() * 0.25;
      frag.appendChild(createConfettiPiece(startX, delay, theme));
    }
    confettiLayer.appendChild(frag);
    setTimeout(() => { confettiLayer.innerHTML = ''; }, 7000);
  }

  confettiButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-confetti');
      burstConfetti(theme);
      launchFirework(window.innerWidth / 2, window.innerHeight * 0.45);
      spawnBalloons(8);
    });
  });



  // Petal rain
  const petalLayer = document.getElementById('petal-layer');
  function spawnPetals(n = 24) {
    if (!petalLayer) return;
    const isMobile = window.innerWidth <= 768;
    const count = isMobile ? Math.floor(n * 0.6) : n;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = isMobile ? (10 + Math.random() * 6) : (8 + Math.random() * 5);
      p.style.left = left + 'vw';
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = delay + 's';
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      frag.appendChild(p);
    }
    petalLayer.appendChild(frag);
  }
  spawnPetals(32);

  // Balloons
  const balloonLayer = document.getElementById('balloon-layer');
  function spawnBalloons(n = 6) {
    if (!balloonLayer) return;
    const isMobile = window.innerWidth <= 768;
    const count = isMobile ? Math.floor(n * 0.7) : n;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'balloon';
      const left = Math.random() * 100;
      const duration = isMobile ? (12 + Math.random() * 8) : (10 + Math.random() * 8);
      const delay = Math.random() * 3;
      b.style.left = left + 'vw';
      b.style.background = `radial-gradient(ellipse at 30% 30%, #fff7fb, ${pick(['#ff8dbf','#ff73b1','#d7c7ff','#f7a8d6'])})`;
      b.style.animationDuration = duration + 's';
      b.style.animationDelay = delay + 's';
      frag.appendChild(b);
    }
    balloonLayer.appendChild(frag);
    setTimeout(() => {
      balloonLayer.innerHTML = '';
    }, 18000);
  }

  // Fireworks (canvas)
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  function launchFirework(x, y) {
    if (!ctx) return;
    const isMobile = window.innerWidth <= 768;
    const hue = Math.floor(Math.random() * 40) + 320; // pinkish
    const count = isMobile ? (25 + Math.floor(Math.random() * 20)) : (40 + Math.floor(Math.random() * 30));
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = isMobile ? (1.2 + Math.random() * 2.5) : (1.5 + Math.random() * 3.2);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: isMobile ? (50 + Math.random() * 15) : (60 + Math.random() * 20),
        color: `hsl(${hue + Math.random()*20}, 90%, ${60 + Math.random()*20}%)`
      });
    }
  }

  canvas && canvas.addEventListener('click', (e) => {
    launchFirework(e.clientX, e.clientY);
  });
  document.addEventListener('click', (e) => {
    if (e.target instanceof HTMLElement && e.target.closest('.btn')) return;
    if (!canvas) return;
    launchFirework(e.clientX, e.clientY);
  });

  function tick() {
    if (!ctx || !canvas) return requestAnimationFrame(tick);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // gravity
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += 0.03;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / 80);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (p.life <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(tick);
  }
  tick();

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }


})();


