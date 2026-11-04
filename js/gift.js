export function setupGift() {
  const intro = document.querySelector('#gift-intro');
  const main = document.querySelector('main');
  const open = document.querySelector('#open-gift');
  const card = document.querySelector('#tarot-card');
  intro.hidden = false;
  main.hidden = true;
  open.addEventListener('click', () => {
    if (intro.classList.contains('unwrapped')) return;
    intro.classList.add('unwrapped');
    open.disabled = true;
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1600;
    setTimeout(() => {
      card.disabled = false;
      card.focus({ preventScroll: true });
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
}
