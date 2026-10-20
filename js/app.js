import { config } from './config.js?v=mp3-1';
import { createPlayer } from './player.js';

document.querySelectorAll('[data-copy]').forEach((element) => {
  const value = config[element.dataset.copy];
  if (typeof value === 'string') element.textContent = value;
});
document.title = `${config.name} — A little record for you`;
document.querySelector('meta[name="description"]').content = `A little record, just for ${config.name}. 一份可以听见的生日礼物。`;

createPlayer(config.audioSrc);

let secretTimer;
document.querySelector('#secret').addEventListener('click', () => {
  const message = document.querySelector('#secret-message');
  clearTimeout(secretTimer);
  message.classList.add('visible');
  secretTimer = setTimeout(() => message.classList.remove('visible'), 4500);
});
