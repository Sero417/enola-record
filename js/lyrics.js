import { lyrics } from './lyrics-data.js?v=gaussian-1';

export function setupLyrics({ start }) {
  const dialog = document.querySelector('#lyrics-dialog');
  const list = document.querySelector('#lyrics-lines');
  const audio = document.querySelector('#audio');
  const trigger = document.querySelector('#secret');
  const lines = lyrics.map(({ text }) => {
    const line = document.createElement('p');
    line.textContent = text;
    list.append(line);
    return line;
  });
  let active = -2;
  let browsing = false;
  let selected = 0;
  const picker = document.querySelector('#lyric-picker');
  const pickPlay = document.querySelector('#play-lyric');
  const follow = document.querySelector('#follow-lyrics');
  function selectNearest() {
    if (!browsing || !lines.length) return;
    const center = list.scrollTop + list.clientHeight / 2;
    selected = lines.reduce((best, line, i) => Math.abs(line.offsetTop + line.clientHeight / 2 - center) < Math.abs(lines[best].offsetTop + lines[best].clientHeight / 2 - center) ? i : best, 0);
    lines.forEach((line, i) => line.classList.toggle('selected-line', i === selected));
    const time = lyrics[selected].time;
    document.querySelector('#lyric-pick-time').textContent = `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;
    pickPlay.disabled = !Number.isFinite(audio.duration) || time >= audio.duration;
    pickPlay.setAttribute('aria-label', `从 ${lyrics[selected].text} 开始播放`);
  }
  function browse() {
    if (!browsing) list.scrollTo({ top: list.scrollTop, behavior: 'instant' });
    browsing = true;
    picker.hidden = follow.hidden = false;
    list.classList.add('browsing');
    selectNearest();
  }
  function resume() {
    browsing = false;
    picker.hidden = follow.hidden = true;
    list.classList.remove('browsing');
    lines.forEach(line => line.classList.remove('selected-line'));
    sync(true);
  }
  list.addEventListener('wheel', browse, { passive: true });
  list.addEventListener('pointerdown', browse);
  list.addEventListener('keydown', event => { if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) browse(); });
  list.addEventListener('scroll', selectNearest, { passive: true });
  audio.addEventListener('loadedmetadata', selectNearest);
  follow.addEventListener('click', resume);
  pickPlay.addEventListener('click', () => {
    if (pickPlay.disabled) return;
    audio.currentTime = lyrics[selected].time;
    audio.dispatchEvent(new CustomEvent('needle-command', { detail: true }));
    start();
    resume();
  });
  function sync(force = false) {
    let index = -1;
    lyrics.forEach((line, i) => { if (audio.currentTime >= line.time) index = i; });
    if (active === index && !force) return;
    active = index;
    lines.forEach((line, i) => {
      line.classList.toggle('current-line', i === index);
      line.classList.toggle('near-line', Math.abs(i - index) === 1);
      if (i === index) line.setAttribute('aria-current', 'true');
      else line.removeAttribute('aria-current');
    });
    if (dialog.open && !browsing && lines[index]) {
      const line = lines[index];
      list.scrollTo({ top: line.offsetTop - list.clientHeight / 2 + line.clientHeight / 2,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }
  trigger.addEventListener('click', () => {
    dialog.showModal(); document.body.classList.add('lyrics-open'); sync(true);
  });
  document.querySelector('#close-lyrics').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  } });
  dialog.addEventListener('close', () => {
    resume(); document.body.classList.remove('lyrics-open'); trigger.focus({ preventScroll: true });
  });
  audio.addEventListener('timeupdate', () => sync());
  audio.addEventListener('seeked', () => sync());
  sync();
}
