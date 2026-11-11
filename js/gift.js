export function setupGift() {
  const intro = document.querySelector('#gift-intro');
  const main = document.querySelector('main');
  const open = document.querySelector('#open-gift');
  const card = document.querySelector('#tarot-card');
  const loading = document.createElement('p');
  loading.className = 'gift-load-status';
  loading.setAttribute('role', 'status');
  loading.hidden = true;
  intro.append(loading);
  async function ready(image) {
    try { await image.decode(); }
    catch (error) { if (!image.complete || !image.naturalWidth) throw error; }
  }

  // Decode both animation sprites before exposing the open state to avoid blank frames.
  const sprites = ['./assets/gift-lid-v2.webp', './assets/gift-open-v1.webp'].map(src => {
    const image = new Image(); image.src = src;
    return image;
  });
  const giftImage = card.querySelector('img');
  if (giftImage) sprites.push(giftImage);
  open.addEventListener('click', async () => {
    if (intro.classList.contains('unwrapped')) return;
    open.disabled = true;
    loading.hidden = false;
    loading.textContent = '正在拆开你的礼物…';
    open.setAttribute('aria-busy', 'true');
    const timer = setTimeout(() => { loading.textContent = '礼物还在路上，请稍等片刻…'; }, 6000);
    try { await Promise.all(sprites.map(ready)); }
    catch {
      clearTimeout(timer);
      loading.textContent = '礼物暂时没能加载，请再轻触礼盒重试。';
      open.disabled = false;
      open.setAttribute('aria-busy', 'false');
      return;
    }
    clearTimeout(timer);
    loading.hidden = true;
    open.setAttribute('aria-busy', 'false');
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
