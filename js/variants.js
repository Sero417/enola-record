export const gifts = {
  tarot: { number: '01', name: '塔罗牌', song: '拍拍宇宙', kind: 'tarot' },
  comb: { number: '02', name: '木梳', song: '等你的季节', image: 'comb.webp' },
  hats: { number: '03', name: '双帽子', song: '希望你真的很快乐', image: 'hats.webp' },
  cats: { number: '04', name: '猫猫挂件', song: '人质', image: 'cats.webp' },
  nails: { number: '05', name: '穿戴甲', song: 'Shine Brighter', image: 'nails.webp' },
  doll: { number: '06', name: '娃娃', song: '我喜欢上你时的内心活动', image: 'doll.webp' },
  letter: { number: '07', name: '一封信', song: '走马', kind: 'letter' },
  kiss: { number: '08', name: '企鹅飞吻', song: '亲亲', kind: 'kiss' },
  oc: { number: '09', name: 'OC 礼物', song: 'I love you more', image: 'oc.webp' },
};
export function applyGiftVariant() {
  const params = new URLSearchParams(location.search);
  const requested = params.get('id') || params.get('gift') || '01';
  const id = Object.keys(gifts).find(key => gifts[key].number === requested) || (gifts[requested] ? requested : 'tarot');
  const gift = gifts[id];
  const cleanUrl = new URL(location.href);
  cleanUrl.searchParams.delete('gift');
  cleanUrl.searchParams.set('id', gift.number);
  history.replaceState(null, '', cleanUrl);
  const card = document.querySelector('#tarot-card');
  card.setAttribute('aria-label', `${gift.name}，进入专属唱片`);
  card.classList.add('gift-object', `gift-object-${id}`);
  if (gift.kind === 'tarot') {
    card.classList.remove('gift-object');
  } else if (gift.kind === 'oc') {
    card.innerHTML = '<span class="oc-placeholder" aria-hidden="true"></span>';
  } else if (gift.image) {
    card.innerHTML = '';
    const image = document.createElement('img');
    image.className = 'gift-object-image';
    image.src = `./assets/gifts/${gift.image}`;
    image.alt = gift.name;
    card.append(image);
  } else if (gift.kind === 'letter') {
    card.innerHTML = `<span class="gift-letter"><span class="letter-to">To Enola,</span><span class="letter-lines" aria-hidden="true"></span><span class="letter-signature">With all my love.</span><span class="letter-seal" aria-hidden="true">E</span></span>`;
  } else {
    card.innerHTML = `<svg class="penguin-kiss" viewBox="0 0 240 240" role="img" aria-label="一只小企鹅送出飞吻"><defs><g id="little-penguin"><ellipse cy="50" rx="34" ry="6" fill="#352b2514"/><path d="M-22 44q-12 12-24 3l21-9M22 44q12 12 24 3L25 38" fill="#d9a56b"/><ellipse cy="0" rx="38" ry="52" fill="#484e54"/><ellipse cy="9" rx="29" ry="37" fill="#fbf4e4"/><ellipse cx="-12" cy="-15" rx="13" ry="17" fill="#fbf4e4"/><ellipse cx="12" cy="-15" rx="13" ry="17" fill="#fbf4e4"/><path d="M-16-15q4-4 8 0M8-15q4-4 8 0" fill="none" stroke="#45474a" stroke-width="2.5" stroke-linecap="round"/><path d="m-6-7 6 8 6-8" fill="#d9a56b"/><ellipse cx="-20" cy="-3" rx="7" ry="4" fill="#d88e8477"/><ellipse cx="20" cy="-3" rx="7" ry="4" fill="#d88e8477"/></g></defs><g class="penguin-blowing" transform="translate(110 143)"><use href="#little-penguin"/></g><path class="flying-kiss" d="M165 110c-14-14-25 8 0 20 25-12 14-34 0-20" fill="#9d5355"/></svg>`;
  }
  document.querySelector('#lyrics-title').textContent = gift.song;
  document.querySelector('.lyrics-credit').textContent = 'A LITTLE RECORD, JUST FOR YOU';
  document.querySelector('.lyrics-note').textContent = '';
  return { ...gift, id, audioSrc: `./public/audio/${gift.number}.mp3`, lyricsSrc: `./public/lyrics/${gift.number}.json?v=lyrics03-update-1` };
}
