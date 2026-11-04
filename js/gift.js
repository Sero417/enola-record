export function setupGift() {
  const intro = document.querySelector('#gift-intro');
  const main = document.querySelector('main');
  const open = document.querySelector('#open-gift');
  const card = document.querySelector('#tarot-card');
  const next = document.querySelector('#gift-continue');
  intro.hidden = false;
  main.hidden = true;
  open.addEventListener('click', () => {
    if (intro.classList.contains('unwrapped')) return;
    intro.classList.add('unwrapped');
    open.disabled = true;
    document.querySelector('#gift-message').textContent = '愿你心里的每一颗星星，都慢慢亮起来。';
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 2300;
    setTimeout(() => {
      card.disabled = false;
      next.hidden = false;
      next.focus({ preventScroll: true });
    }, delay);
  });
  function enter() {
    intro.hidden = true;
    main.hidden = false;
    window.scrollTo(0, 0);
    const title = document.querySelector('#name');
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    window.dispatchEvent(new Event('resize'));
  }
  card.addEventListener('click', enter);
  next.addEventListener('click', enter);
}
