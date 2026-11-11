export function setupGift() {
  const intro = document.querySelector('#gift-intro');
  const main = document.querySelector('main');
  const open = document.querySelector('#open-gift');
  const card = document.querySelector('#tarot-card');

  // Decode both animation sprites before exposing the open state to avoid blank frames.
  const sprites = ['./assets/gift-lid-v2.png', './assets/gift-open-v1.png'].map(src => {
    const image = new Image(); image.src = src;
    return image;
  });
  const giftImage = card.querySelector('img');
  if (giftImage) sprites.push(giftImage);
  open.addEventListener('click', async () => {
    if (intro.classList.contains('unwrapped')) return;
    open.disabled = true;
    try { await Promise.all(sprites.map(image => image.decode())); }
    catch { open.disabled = false; return; }
    intro.classList.add('unwrapped');
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 2900;
    setTimeout(() => {
      card.disabled = false;
      card.focus({ preventScroll: true });
    }, delay);
  });
  // Both pages stay in document flow, so native touch scrolling works in either direction.
  function goTo(target) {
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }
  card.addEventListener('click', () => goTo(main));
  document.querySelector('#to-record').addEventListener('click', () => goTo(main));
  document.querySelector('#to-gift').addEventListener('click', () => goTo(intro));
}
