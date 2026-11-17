import { applyGiftVariant } from './variants.js?v=lyrics03-update-1';
import { config } from './config.js?v=lyrics03-update-1';
import { createPlayer } from './player.js?v=lyrics03-update-1';

document.querySelectorAll('[data-copy]').forEach((element) => {
  const value = config[element.dataset.copy];
  if (typeof value === 'string') element.textContent = value;
});
document.title = `${config.name} — A little record for you`;
document.querySelector('meta[name="description"]').content = `A little record, just for ${config.name}. 一份可以听见的生日礼物。`;

const variant = applyGiftVariant();
const controls = createPlayer(variant.audioSrc);
import { setupTonearm } from './tonearm.js?v=lyrics03-update-1';
import { setupLyrics } from './lyrics.js?v=lyrics03-update-1';
setupTonearm(controls);


import { setupGift } from './gift.js?v=lyrics03-update-1';
setupGift();

let timedLyrics = [];
try {
  const response = await fetch(variant.lyricsSrc);
  if (!response.ok) throw new Error('lyrics unavailable');
  timedLyrics = await response.json();
  if (timedLyrics[0]?.time > 0) timedLyrics.unshift({time: 0, text: '♫ 前奏'});
} catch {
  document.querySelector('.lyrics-note').textContent = '歌词暂时未能加载，请刷新重试；歌曲仍可播放。';
}
setupLyrics(controls, timedLyrics);
