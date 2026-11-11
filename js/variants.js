// One shared design, seven independent NFC destinations and audio files.
export const gifts = {
  comb: { name: '木梳', image: 'comb.webp' },
  cats: { name: '猫猫挂件', image: 'cats.webp' },
  hats: { name: '双帽子', image: 'hats.webp' },
  nails: { name: '穿戴甲', image: 'nails.webp' },
  doll: { name: '娃娃', image: 'doll.webp' },
  letter: { name: '一封信', kind: 'letter' },
  kiss: { name: '企鹅亲亲', kind: 'kiss' },
};
export function applyGiftVariant() {
  const id = new URLSearchParams(location.search).get('gift');
  const gift = gifts[id];
  if (!gift) return null;
  const card = document.querySelector('#tarot-card');
  card.setAttribute('aria-label', `${gift.name}，进入专属唱片`);
  card.classList.add('gift-object', `gift-object-${id}`);
  if (gift.image) {
    card.innerHTML = '';
    const image = document.createElement('img');
    image.className = 'gift-object-image';
    image.src = `./assets/gifts/${gift.image}`;
    image.alt = gift.name;
    card.append(image);
  } else if (gift.kind === 'letter') {
    card.innerHTML = `<span class="gift-letter"><span class="letter-to">To Enola,</span><span class="letter-lines" aria-hidden="true"></span><span class="letter-signature">With all my love.</span><span class="letter-seal" aria-hidden="true">E</span></span>`;
  } else {
    card.innerHTML = `<svg class="penguin-kiss" viewBox="0 0 240 240" role="img" aria-label="两只小企鹅靠近亲亲"><defs><g id="little-penguin"><ellipse cy="50" rx="34" ry="6" fill="#352b2514"/><path d="M-22 44q-12 12-24 3l21-9M22 44q12 12 24 3L25 38" fill="#d9a56b"/><ellipse cy="0" rx="38" ry="52" fill="#484e54"/><ellipse cy="9" rx="29" ry="37" fill="#fbf4e4"/><ellipse cx="-12" cy="-15" rx="13" ry="17" fill="#fbf4e4"/><ellipse cx="12" cy="-15" rx="13" ry="17" fill="#fbf4e4"/><path d="M-16-15q4-4 8 0M8-15q4-4 8 0" fill="none" stroke="#45474a" stroke-width="2.5" stroke-linecap="round"/><path d="m-6-7 6 8 6-8" fill="#d9a56b"/><ellipse cx="-20" cy="-3" rx="7" ry="4" fill="#d88e8477"/><ellipse cx="20" cy="-3" rx="7" ry="4" fill="#d88e8477"/></g></defs><g class="penguin-left" transform="translate(66 143)"><use href="#little-penguin"/></g><g class="penguin-right" transform="translate(174 143)"><use href="#little-penguin"/></g><path class="kiss-heart" d="M120 75c-22-19-29 11 0 27 29-16 22-46 0-27" fill="#9d5355"/></svg>`;
  }
  document.querySelector('#lyrics-title').textContent = '给你的歌';
  document.querySelector('.lyrics-credit').textContent = '一首只属于这份礼物的歌';
  document.querySelector('.lyrics-note').textContent = '歌曲和歌词正在准备中。';
  return { ...gift, id, audioSrc: `./public/audio/${id}.mp3` };
}
