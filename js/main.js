const SHANGHAI_OFFSET = 8 * 60 * 60 * 1000;
const engagementDate = new Date('2026-09-27T16:00:00.000Z');
const engagementDayEnd = new Date('2026-09-28T16:00:00.000Z');
const relationshipStartDate = new Date('2026-04-30T16:00:00.000Z');
const previewMode = new URLSearchParams(window.location.search).get('preview');

function pad(value) {
  return String(value).padStart(2, '0');
}

function getShanghaiDateParts(date) {
  const shanghaiTime = new Date(date.getTime() + SHANGHAI_OFFSET);
  return {
    year: shanghaiTime.getUTCFullYear(),
    month: shanghaiTime.getUTCMonth() + 1,
    day: shanghaiTime.getUTCDate()
  };
}

function getEngagementState(now) {
  if (previewMode === 'engagement-day') return 'day';
  if (previewMode === 'anniversary') return 'anniversary';

  const parts = getShanghaiDateParts(now);

  if (now < engagementDate) return 'upcoming';
  if (now < engagementDayEnd) return 'day';
  if (parts.month === 9 && parts.day === 28 && parts.year > 2026) return 'anniversary';
  return 'past';
}

function applyEngagementMode(state, now) {
  const body = document.body;
  if (body.dataset.engagementState === state) return;

  const kicker = document.getElementById('hero-kicker');
  const heroTitle = document.getElementById('hero-title');
  const heroIntro = document.getElementById('hero-intro');
  const message = document.getElementById('milestone-message');
  const messageHeading = document.getElementById('milestone-heading');
  const messageCopy = document.getElementById('milestone-copy');
  const countdownGrid = document.querySelector('.countdown-grid');
  const counterTitle = document.getElementById('counter-title');
  const dateBannerKicker = document.getElementById('date-banner-kicker');
  const dateBannerCopy = document.getElementById('date-banner-copy');

  body.classList.remove('engagement-day', 'engagement-past', 'engagement-anniversary');
  if (state === 'day') body.classList.add('engagement-day');
  if (state === 'past') body.classList.add('engagement-past');
  if (state === 'anniversary') body.classList.add('engagement-past', 'engagement-anniversary');
  body.dataset.engagementState = state;

  if (!kicker || !heroTitle || !heroIntro || !message || !countdownGrid) return;

  if (state === 'day') {
    document.title = '今天，我们订婚了';
    kicker.textContent = 'TODAY IS OUR DAY · 今天，我们订婚了';
    heroTitle.innerHTML = '今天，<br><em>我们订婚了</em>';
    heroIntro.textContent = '2026.09.28 · 从今天起，是更确定的我们。';
    counterTitle.hidden = true;
    countdownGrid.hidden = true;
    message.hidden = false;
    messageHeading.textContent = '就是今天';
    messageCopy.textContent = '从今天起，是更确定的我们。';
    dateBannerKicker.textContent = 'TODAY IS OUR DAY';
    dateBannerCopy.textContent = '今天，我们订婚了';
  } else if (state === 'anniversary') {
    const years = Math.max(1, getShanghaiDateParts(now).year - 2026);
    document.title = `第 ${years} 个订婚纪念日`;
    kicker.textContent = 'HAPPY ENGAGEMENT ANNIVERSARY · 订婚纪念日';
    heroTitle.innerHTML = `今天，是我们的<br><em>第 ${years} 个订婚纪念日</em>`;
    heroIntro.textContent = '岁岁年年，依然是你。';
    counterTitle.hidden = true;
    countdownGrid.hidden = true;
    message.hidden = false;
    messageHeading.textContent = '纪念日快乐';
    messageCopy.textContent = `${years} 年前的今天，我们把喜欢变成了约定。`;
    dateBannerKicker.textContent = 'HAPPY ANNIVERSARY';
    dateBannerCopy.textContent = `我们的第 ${years} 个订婚纪念日`;
  } else {
    document.title = '从五月开始';
    kicker.textContent = state === 'past' ? 'OUR ENGAGEMENT · 我们已经订婚' : 'OUR ENGAGEMENT · 订婚纪念';
    heroTitle.innerHTML = '我们，<br><em>未完待续</em>';
    heroIntro.innerHTML = '相恋于 2026.05.01&nbsp;&nbsp;·&nbsp;&nbsp;订婚于 2026.09.28';
    counterTitle.hidden = false;
    countdownGrid.hidden = false;
    message.hidden = true;
    dateBannerKicker.textContent = state === 'past' ? 'OUR PROMISE' : 'SAVE THE DATE';
    dateBannerCopy.textContent = state === 'past' ? '我们的订婚日 · 2026.09.28' : '订婚日 · 星期一';
  }
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
  const state = getEngagementState(now);
  applyEngagementMode(state, now);
  const distance = Math.abs(engagementDate - now);
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor(distance / 3600000) % 24;
  const minutes = Math.floor(distance / 60000) % 60;
  const seconds = Math.floor(distance / 1000) % 60;

  title.textContent = state === 'upcoming' ? '距离我们订婚还有' : '我们已经订婚';
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
  if (document.body.classList.contains('engagement-day') || document.body.classList.contains('engagement-anniversary')) {
    petal.classList.add('celebration-petal');
  }
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty('--drift', `${Math.round(Math.random() * 160 - 80)}px`);
  petal.style.animationDuration = `${7 + Math.random() * 5}s`;
  petal.style.animationDelay = `${Math.random() * 0.8}s`;
  petals.appendChild(petal);
  petal.addEventListener('animationend', () => petal.remove(), { once: true });
}

function scheduleNextPetal() {
  if (reduceMotion) return;
  const celebrating = document.body.classList.contains('engagement-day') ||
    document.body.classList.contains('engagement-anniversary');
  window.setTimeout(() => {
    createPetal();
    scheduleNextPetal();
  }, celebrating ? 900 : 2600);
}

scheduleNextPetal();

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
