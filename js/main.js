const engagementDate = new Date(2026, 8, 28, 0, 0, 0);
const relationshipStartDate = new Date(2026, 4, 1, 0, 0, 0);

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateCountdown() {
  const title = document.getElementById('counter-title');
  const fields = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  if (!title || Object.values(fields).some(field => !field)) return;

  const now = new Date();
  const isUpcoming = now < engagementDate;
  const distance = Math.abs(engagementDate - now);
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor(distance / 3600000) % 24;
  const minutes = Math.floor(distance / 60000) % 60;
  const seconds = Math.floor(distance / 1000) % 60;

  title.textContent = isUpcoming ? '距离我们订婚还有' : '我们已经订婚';
  fields.days.textContent = pad(days);
  fields.hours.textContent = pad(hours);
  fields.minutes.textContent = pad(minutes);
  fields.seconds.textContent = pad(seconds);
}

function updateTogetherTime() {
  const title = document.getElementById('together-title');
  const fields = {
    days: document.getElementById('together-days'),
    hours: document.getElementById('together-hours'),
    minutes: document.getElementById('together-minutes'),
    seconds: document.getElementById('together-seconds')
  };

  if (!title || Object.values(fields).some(field => !field)) return;

  const now = new Date();
  const relationshipStarted = now >= relationshipStartDate;
  const distance = Math.abs(now - relationshipStartDate);
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor(distance / 3600000) % 24;
  const minutes = Math.floor(distance / 60000) % 60;
  const seconds = Math.floor(distance / 1000) % 60;

  title.textContent = relationshipStarted ? '我们已经在一起' : '距离我们在一起还有';
  fields.days.textContent = pad(days);
  fields.hours.textContent = pad(hours);
  fields.minutes.textContent = pad(minutes);
  fields.seconds.textContent = pad(seconds);
}

function updateTimers() {
  updateCountdown();
  updateTogetherTime();
}

updateTimers();
setInterval(updateTimers, 1000);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(item => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealItems.forEach(item => observer.observe(item));
}

const petals = document.querySelector('.petals');

function createPetal() {
  if (!petals || reduceMotion || document.hidden) return;

  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty('--drift', `${Math.round(Math.random() * 160 - 80)}px`);
  petal.style.animationDuration = `${7 + Math.random() * 5}s`;
  petal.style.animationDelay = `${Math.random() * 0.8}s`;
  petals.appendChild(petal);
  petal.addEventListener('animationend', () => petal.remove(), { once: true });
}

if (!reduceMotion) setInterval(createPetal, 2600);

const musicButton = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('background-music');
let musicStarting = false;

function setMusicButton(playing) {
  if (!musicButton) return;

  musicButton.classList.toggle('is-playing', playing);
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
  musicButton.querySelector('.music-label').textContent = playing ? '暂停音乐' : '播放音乐';
}

async function startMusic() {
  if (!backgroundMusic || !musicButton || musicStarting) return;

  musicStarting = true;
  musicButton.querySelector('.music-label').textContent = '加载中';
  backgroundMusic.volume = 0.48;

  try {
    await backgroundMusic.play();
    setMusicButton(true);
  } catch (error) {
    setMusicButton(false);
    musicButton.querySelector('.music-label').textContent = '点击重试';
    console.warn('Background music could not start:', error);
  } finally {
    musicStarting = false;
  }
}

function stopMusic() {
  if (!backgroundMusic) return;
  backgroundMusic.pause();
  setMusicButton(false);
}

if (musicButton && backgroundMusic) {
  musicButton.addEventListener('click', () => {
    if (!backgroundMusic.paused) stopMusic();
    else startMusic();
  });

  backgroundMusic.addEventListener('error', () => {
    setMusicButton(false);
    musicButton.querySelector('.music-label').textContent = '音乐不可用';
  });
}
