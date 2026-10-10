/**
 * Royal Hair Salon - Barbearia Odivelas
 * Advanced Interactive Hair & Scissor Animation Engine + Web Audio ASMR
 */

(function () {
  'use strict';

  // --- Sound Synthesizer via Web Audio API (100% self-contained, no external mp3 files needed) ---
  let audioCtx = null;
  let isSoundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Realistic scissor snip sound synthesis
  function playSnipSound(forcePlay = false) {
    if (!forcePlay && !isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    try {
      const now = audioCtx.currentTime;

      // 1. Noise burst for blade friction
      const bufferSize = audioCtx.sampleRate * 0.08;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to mimic high-tensile steel blade contact
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(4.5, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);

      // 2. Metallic blade ring resonance (very short harmonic chime)
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(4200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.05);

      oscGain.gain.setValueAtTime(0.12, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  }

  // Realistic clipper/trimmer buzz synthesis
  function playClipperBuzz() {
    if (!isSoundEnabled || !audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Clipper audio warning:', e);
    }
  }

  // --- Interactive Hair & Cutting Particle Canvas ---
  const canvas = document.getElementById('hairCuttingCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  // Hair strands & cut particles
  const hairStrands = [];
  const sparks = [];
  const maxStrands = 45;

  class HairStrand {
    constructor(x, y) {
      this.reset(x, y);
    }

    reset(x, y) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * -100;
      this.length = 20 + Math.random() * 35;
      this.curve = (Math.random() - 0.5) * 15;
      this.angle = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      this.speedY = 1.2 + Math.random() * 2.2;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(212, 175, 55, 0.45)' : 'rgba(246, 226, 122, 0.25)';
      this.thickness = 1 + Math.random() * 1.5;
      this.isCut = false;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.02) * 0.5;

      if (this.y > height + 50) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.thickness;
      ctx.lineCap = 'round';

      const endX = this.x + Math.cos(this.angle) * this.length;
      const endY = this.y + Math.sin(this.angle) * this.length;
      const cpX = this.x + Math.cos(this.angle) * (this.length * 0.5) + this.curve;
      const cpY = this.y + Math.sin(this.angle) * (this.length * 0.5);

      ctx.moveTo(this.x, this.y);
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
      ctx.stroke();
      ctx.restore();
    }
  }

  class CutSpark {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.radius = 1.5 + Math.random() * 2.5;
      this.life = 1.0;
      this.decay = 0.03 + Math.random() * 0.04;
      this.color = Math.random() > 0.5 ? '#f6e27a' : '#d4af37';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.15; // gravity
      this.life -= this.decay;
    }

    draw() {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#f6e27a';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Prepopulate hair strands
  for (let i = 0; i < maxStrands; i++) {
    const s = new HairStrand();
    s.y = Math.random() * height;
    hairStrands.push(s);
  }

  // Trigger cutting action at (x,y)
  function triggerCutAt(x, y) {
    playSnipSound();

    // Spawn sparks
    for (let i = 0; i < 16; i++) {
      sparks.push(new CutSpark(x, y));
    }

    // Cut intersecting hair strands
    hairStrands.forEach((strand) => {
      const dist = Math.hypot(strand.x - x, strand.y - y);
      if (dist < 85 && !strand.isCut) {
        strand.isCut = true;
        // create sliced halves
        strand.length *= 0.45;
        strand.speedY += 2;
        strand.speedX += (Math.random() - 0.5) * 4;

        // add another falling trimmed strand
        const snippet = new HairStrand(strand.x + 8, strand.y + 10);
        snippet.length = strand.length * 0.8;
        snippet.speedY = strand.speedY + 2.5;
        snippet.speedX = (Math.random() - 0.5) * 5;
        hairStrands.push(snippet);
        if (hairStrands.length > maxStrands + 15) {
          hairStrands.shift();
        }
      }
    });

    // Create ripple effect on DOM if hero elements exist
    const heroVisual = document.querySelector('.scissors-interactive-wrapper');
    if (heroVisual) {
      heroVisual.style.transform = 'scale(0.98)';
      setTimeout(() => {
        heroVisual.style.transform = 'scale(1)';
      }, 150);
    }
  }

  // Mouse / Touch interaction on hero
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    let lastSnipTime = 0;

    heroSection.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      triggerCutAt(x, y);
    });

    heroSection.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSnipTime > 350) {
        // Subtle trailing snips on brisk movement
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Chance to cut nearby strands
        hairStrands.forEach((strand) => {
          if (Math.hypot(strand.x - x, strand.y - y) < 45) {
            triggerCutAt(x, y);
            lastSnipTime = now;
          }
        });
      }
    });
  }

  // Main Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw hair strands
    for (let i = 0; i < hairStrands.length; i++) {
      hairStrands[i].update();
      hairStrands[i].draw();
    }

    // Update & draw cut sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update();
      sparks[i].draw();
      if (sparks[i].life <= 0) {
        sparks.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Sound Toggle Controller
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundStatusText = document.getElementById('soundStatusText');
  const soundContainer = document.getElementById('soundContainer');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      isSoundEnabled = !isSoundEnabled;

      if (isSoundEnabled) {
        if (soundContainer) soundContainer.classList.add('sound-active');
        if (soundStatusText) soundStatusText.textContent = 'Som Ativo (ASMR)';
        playSnipSound();
      } else {
        if (soundContainer) soundContainer.classList.remove('sound-active');
        if (soundStatusText) soundStatusText.textContent = 'Som Barbearia';
      }
    });
  }

  // Interactive Cut Button in Hero: "Testar Corte Real"
  const testCutBtn = document.getElementById('testCutHeroBtn');
  if (testCutBtn) {
    testCutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      isSoundEnabled = true;

      // Update sound pill in DOM if available
      if (soundContainer) soundContainer.classList.add('sound-active');
      if (soundStatusText) soundStatusText.textContent = 'Som Ativo (ASMR)';

      // Trigger button micro-animation
      testCutBtn.classList.add('scale-95', 'ring-2', 'ring-amber-400');
      setTimeout(() => {
        testCutBtn.classList.remove('scale-95', 'ring-2', 'ring-amber-400');
      }, 180);

      // Rapid physical snip animation on central golden scissors
      const topBlade = document.querySelector('.scissor-blade-top');
      const bottomBlade = document.querySelector('.scissor-blade-bottom');
      if (topBlade && bottomBlade) {
        topBlade.style.animation = 'none';
        bottomBlade.style.animation = 'none';
        topBlade.style.transform = 'rotate(-24deg)';
        bottomBlade.style.transform = 'rotate(24deg)';
        setTimeout(() => {
          topBlade.style.transform = 'rotate(5deg)';
          bottomBlade.style.transform = 'rotate(-5deg)';
          playSnipSound(true);
          setTimeout(() => {
            topBlade.style.transform = '';
            bottomBlade.style.transform = '';
            topBlade.style.animation = '';
            bottomBlade.style.animation = '';
          }, 150);
        }, 80);
      } else {
        playSnipSound(true);
      }

      // Cut sparks near the button
      const cRect = canvas.getBoundingClientRect();
      const rect = testCutBtn.getBoundingClientRect();
      const cutX = rect.left + rect.width / 2 - cRect.left;
      const cutY = rect.top - cRect.top;
      triggerCutAt(cutX, cutY);

      // Also cut particles near central apparatus
      const heroVisual = document.querySelector('.scissors-interactive-wrapper');
      if (heroVisual) {
        const hRect = heroVisual.getBoundingClientRect();
        const scisX = hRect.left + hRect.width / 2 - cRect.left;
        const scisY = hRect.top + hRect.height / 2 - cRect.top;
        triggerCutAt(scisX, scisY);
      }
    });
  }

  // Export functions to global scope for booking modal / interactive elements
  window.RoyalBarberFX = {
    triggerCutAt: triggerCutAt,
    playSnipSound: playSnipSound,
    playClipperBuzz: playClipperBuzz,
    initAudio: initAudio
  };
})();
