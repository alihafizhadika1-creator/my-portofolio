const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  ring.style.left = e.clientX + 'px';
  ring.style.top = e.clientY + 'px';
});


const nav = document.querySelector('nav');
const navTrigger = document.getElementById('nav-trigger');
let navHideTimer = null;

function showNav() {
  nav.classList.add('nav-visible');
  clearTimeout(navHideTimer);
  navHideTimer = setTimeout(() => {
    nav.classList.remove('nav-visible');
  }, 2400);
}

navTrigger.addEventListener('mouseenter', showNav);
nav.addEventListener('mouseenter', () => {
  clearTimeout(navHideTimer);
  nav.classList.add('nav-visible');
});
nav.addEventListener('mouseleave', () => {
  navHideTimer = setTimeout(() => nav.classList.remove('nav-visible'), 1000);
});


showNav();


const globalReveal = document.getElementById('global-bg-reveal');

document.addEventListener('mousemove', e => {
  const pctX = ((e.clientX / window.innerWidth) * 100).toFixed(2) + '%';
  const pctY = ((e.clientY / window.innerHeight) * 100).toFixed(2) + '%';
  globalReveal.style.setProperty('--gmx', pctX);
  globalReveal.style.setProperty('--gmy', pctY);
  globalReveal.classList.add('active');
});

document.addEventListener('mouseleave', () => {
  globalReveal.classList.remove('active');
});


const canvas = document.getElementById('glass-canvas');
const ctx = canvas.getContext('2d');
let shards = [];
let mouse = { x: -999, y: -999 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buildShards();
}

function buildShards() {
  shards = [];
  const cols = 14, rows = 9;
  const W = canvas.width, H = canvas.height;
  const cw = W / cols, ch = H / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * cw + cw / 2 + (Math.random() - 0.5) * cw * 0.5;
      const cy = r * ch + ch / 2 + (Math.random() - 0.5) * ch * 0.5;
      // random polygon around center
      const pts = [];
      const sides = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i + Math.random() * 0.8;
        const radius = (Math.min(cw, ch) * 0.5) * (0.7 + Math.random() * 0.6);
        pts.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
      }
      shards.push({
        pts,
        cx, cy,
        baseAlpha: 0,
        alpha: 0,
        targetAlpha: 0,
        hue: 140 + Math.random() * 40,
        lightness: 30 + Math.random() * 30,
      });
    }
  }
}

function drawShards() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shards.forEach(s => {
    // proximity to mouse
    const dx = s.cx - mouse.x;
    const dy = s.cy - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const proximity = Math.max(0, 1 - dist / 260);
    s.targetAlpha = proximity * proximity;
    s.alpha += (s.targetAlpha - s.alpha) * 0.1;

    if (s.alpha < 0.005) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(s.pts[0].x, s.pts[0].y);
    for (let i = 1; i < s.pts.length; i++) ctx.lineTo(s.pts[i].x, s.pts[i].y);
    ctx.closePath();

    ctx.strokeStyle = `hsla(${s.hue}, 100%, ${s.lightness + 30}%, ${s.alpha * 0.9})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.fillStyle = `hsla(${s.hue}, 80%, ${s.lightness}%, ${s.alpha * 0.07})`;
    ctx.fill();

    const grad = ctx.createLinearGradient(s.pts[0].x, s.pts[0].y, s.pts[1]?.x || s.cx, s.pts[1]?.y || s.cy);
    grad.addColorStop(0, `hsla(${s.hue}, 100%, 90%, ${s.alpha * 0.3})`);
    grad.addColorStop(1, `hsla(${s.hue}, 100%, 50%, 0)`);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.restore();
  });
  requestAnimationFrame(drawShards);
}

const homeEl = document.getElementById('home');
homeEl.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
homeEl.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
drawShards();

const pupilL = document.getElementById('pupilL');
const pupilR = document.getElementById('pupilR');
const shineL = document.getElementById('shineL');
const shineR = document.getElementById('shineR');
const charSvg = document.getElementById('char-svg');

document.addEventListener('mousemove', e => {
  const rect = charSvg.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height * 0.44;
  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const maxMove = 4.5;
  const nx = (dx / Math.max(dist, 1)) * Math.min(dist / 80, 1) * maxMove;
  const ny = (dy / Math.max(dist, 1)) * Math.min(dist / 80, 1) * maxMove;
  pupilL.setAttribute('cx', 64 + nx);
  pupilL.setAttribute('cy', 90 + ny);
  pupilR.setAttribute('cx', 96 + nx);
  pupilR.setAttribute('cy', 90 + ny);
  shineL.setAttribute('cx', 66 + nx);
  shineL.setAttribute('cy', 88 + ny);
  shineR.setAttribute('cx', 98 + nx);
  shineR.setAttribute('cy', 88 + ny);
});

function showGreeting(name) {
  const bubble = document.getElementById('speechBubble');
  const armL = document.getElementById('armL');

  bubble.innerText = `Halo ${name}, welcome to my website!`;
  bubble.style.opacity = '1';
  bubble.style.transform = 'translateX(-50%) translateY(0)';

  armL.classList.add('wave-hand');

  setTimeout(() => {
    armL.classList.remove('wave-hand');
  }, 3000);

  setTimeout(() => {
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}

const marqueeItems = ['UI Design','Frontend Dev','Prototyping','Figma','User Research','Front-End Development'];
const track = document.getElementById('marqueeTrack');
const buildMarquee = () => {
  let html = '';
  for (let i = 0; i < 6; i++) {
    marqueeItems.forEach(item => {
      html += `<span class="marquee-item">${item}<span>✦</span></span>`;
    });
  }
  track.innerHTML = html;
};
buildMarquee();

const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
reveals.forEach(el => revealObs.observe(el));

const skillFills = document.querySelectorAll('.hskill-bar-fill');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.style.width = e.target.dataset.width + '%';
  });
}, { threshold: 0.3 });
skillFills.forEach(el => skillObs.observe(el));

document.querySelectorAll('a, button, .work-card, .story-video, .hskill-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px'; cursor.style.height = '20px';
    ring.style.width = '60px'; ring.style.height = '60px'; ring.style.opacity = '0.8';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '14px'; cursor.style.height = '14px';
    ring.style.width = '40px'; ring.style.height = '40px'; ring.style.opacity = '0.5';
  });
});

const loaderScreen = document.getElementById('loader-screen');
const nameScreen = document.getElementById('name-screen');
const startBtn = document.getElementById('startBtn');
const nameInput = document.getElementById('nameInput');
const greeting = document.getElementById('greeting');
const char = document.getElementById('char-svg');
const armR = document.getElementById('armR');
const bubble = document.getElementById('speechBubble');



window.addEventListener('load', () => {
  setTimeout(() => {
    loaderScreen.style.opacity = '0';

    setTimeout(() => {
      loaderScreen.style.display = 'none';
      nameScreen.classList.add('active');
    }, 500);

  }, 3000);
});

startBtn.addEventListener('click', () => {
  const name = nameInput.value.trim() || "Guest";

  localStorage.setItem("username", name);

  nameScreen.style.opacity = '0';

  setTimeout(() => {
    nameScreen.style.display = 'none';
    showGreeting(name);
  }, 500);
});

window.addEventListener("DOMContentLoaded", () => {
  const savedName = localStorage.getItem("username");

  if (savedName) {
    nameScreen.classList.remove("active");
    showGreeting(savedName);
  } else {
    nameScreen.classList.add("active");
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("storyVideo");
  const video = document.getElementById("myStoryVideo");
  const overlay = document.getElementById("videoOverlay");
  const thumb = document.querySelector(".video-thumb");

  let isPlaying = false;

  container.addEventListener("click", async () => {
    if (!isPlaying) {
      await video.play();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", () => {
    isPlaying = true;
    overlay.classList.add("hide");
    thumb.classList.add("hide");
  });

  video.addEventListener("pause", () => {
    isPlaying = false;
    overlay.classList.remove("hide");
  });

  video.addEventListener("ended", () => {
    isPlaying = false;
    overlay.classList.remove("hide");
    thumb.classList.remove("hide");
  });
});

