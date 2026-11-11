import { applyGiftVariant } from './variants.js?v=loading-fix-1';
import { config } from './config.js?v=loading-fix-1';
import { createPlayer } from './player.js?v=loading-fix-1';

document.querySelectorAll('[data-copy]').forEach((element) => {
  const value = config[element.dataset.copy];
  if (typeof value === 'string') element.textContent = value;
});
document.title = `${config.name} — A little record for you`;
document.querySelector('meta[name="description"]').content = `A little record, just for ${config.name}. 一份可以听见的生日礼物。`;

const variant = applyGiftVariant();
const controls = createPlayer(variant ? variant.audioSrc : config.audioSrc, variant ? '这份礼物的歌曲还在准备中，之后再来听听吧。' : null);
import { setupTonearm } from './tonearm.js?v=loading-fix-1';
import { setupLyrics } from './lyrics.js?v=loading-fix-1';
setupTonearm(controls);
setupLyrics(controls);

import { setupGift } from './gift.js?v=loading-fix-1';
setupGift();
