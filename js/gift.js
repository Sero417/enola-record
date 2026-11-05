export function setupGift() {
  const intro = document.querySelector('#gift-intro');
  const main = document.querySelector('main');
  const open = document.querySelector('#open-gift');
  const card = document.querySelector('#tarot-card');

  open.addEventListener('click', () => {
    if (intro.classList.contains('unwrapped')) return;
    intro.classList.add('unwrapped');
    open.disabled = true;
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
