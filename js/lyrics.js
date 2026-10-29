import { lyrics } from './lyrics-data.js?v=liner-1';

export function setupLyrics() {
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
    if (dialog.open && lines[index]) {
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
    document.body.classList.remove('lyrics-open'); trigger.focus({ preventScroll: true });
  });
  audio.addEventListener('timeupdate', () => sync());
  audio.addEventListener('seeked', () => sync());
  sync();
}
