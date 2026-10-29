import { config } from './config.js?v=lyrics-glass-1';
import { createPlayer } from './player.js?v=lyrics-glass-1';

document.querySelectorAll('[data-copy]').forEach((element) => {
  const value = config[element.dataset.copy];
  if (typeof value === 'string') element.textContent = value;
});
document.title = `${config.name} — A little record for you`;
document.querySelector('meta[name="description"]').content = `A little record, just for ${config.name}. 一份可以听见的生日礼物。`;

const controls = createPlayer(config.audioSrc);
import { setupTonearm } from './tonearm.js?v=lyrics-glass-1';
import { setupLyrics } from './lyrics.js?v=lyrics-glass-1';
setupTonearm(controls);
setupLyrics();

controls.audio.addEventListener('playing', () => document.body.classList.add('has-listened'), { once: true });
