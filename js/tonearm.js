export function setupTonearm({ audio, start, stop }) {
  const arm = document.querySelector('#tonearm');
  const table = document.querySelector('#turntable');
  const min = -13, contact = 2;
  let max = 24, playing = false;
  function setPlayingState(value) {
    playing = value;

  }
  // Find the first angle where the entire cartridge fits inside the red label.
  // Recalculate for each screen size rather than using one desktop-only angle.
  function calibrate() {
    const head = arm.querySelector('.arm-head');
    const label = table.querySelector('.label');
    const size = table.clientWidth, radius = label.clientWidth / 2 - 1;
    const cx = head.offsetLeft + head.offsetWidth / 2 - 40;
    const cy = head.offsetTop + head.offsetHeight / 2 - 15;
    const tilt = 22 * Math.PI / 180;
    const corners = [-1, 1].flatMap(x => [-1, 1].map(y => {
      const dx = x * head.offsetWidth / 2, dy = y * head.offsetHeight / 2;
      return [cx + dx * Math.cos(tilt) - dy * Math.sin(tilt),
        cy + dx * Math.sin(tilt) + dy * Math.cos(tilt)];
    }));
    for (let value = 0; value <= 45; value += .1) {
      const a = value * Math.PI / 180;
      if (corners.every(([x, y]) => Math.hypot(
        size - 44 + x * Math.cos(a) - y * Math.sin(a) - size / 2,
        15 + x * Math.sin(a) + y * Math.cos(a) - size / 2) <= radius)) {
        max = value; break;
      }
    }
    arm.setAttribute('aria-valuemax', String(Math.ceil(max)));
    set(playing || angle >= contact ? max : angle);
  }
  let angle = min, drag = null;
  function set(value) {
    angle = Math.max(min, Math.min(max, value));
    arm.style.setProperty('--angle', `${angle}deg`);
    arm.setAttribute('aria-valuenow', String(Math.round(angle)));
    arm.setAttribute('aria-valuetext', angle <= min ? '唱针已归位' : '唱针位于唱片上，拨回最外侧暂停');
  }
  function commit() {
    if (!audio.paused) { if (angle <= min) stop(); return; }
    if (angle >= contact) { set(max); setPlayingState(true); start(); } else stop();
  }
  arm.addEventListener('pointerdown', (event) => {
    if (drag || (event.pointerType === 'mouse' && event.button !== 0)) return;
    // The pivot is fixed relative to the untransformed turntable, even while dragging.
    const rect = table.getBoundingClientRect();
    const x = rect.right - 44, y = rect.top + 15;
    drag = { id: event.pointerId, x, y, initial: angle,
      bearing: Math.atan2(event.clientY - y, event.clientX - x) };
    arm.setPointerCapture(event.pointerId);
    arm.classList.add('dragging');
    event.preventDefault();
  });
  arm.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    let delta = Math.atan2(event.clientY - drag.y, event.clientX - drag.x) - drag.bearing;
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    set(drag.initial + delta * 180 / Math.PI);
    if (angle <= min && !audio.paused) stop();
  });
  function finish(event, cancelled = false) {
    if (!drag || event.pointerId !== drag.id) return;
    if (cancelled) set(drag.initial);
    drag = null;
    arm.classList.remove('dragging');
    if (arm.hasPointerCapture(event.pointerId)) arm.releasePointerCapture(event.pointerId);
    // Start from pointerup, a user gesture accepted by mobile browsers.
    if (!cancelled) commit();
  }
  arm.addEventListener('pointerup', event => finish(event));
  arm.addEventListener('pointercancel', event => finish(event, true));
  arm.addEventListener('lostpointercapture', event => finish(event, true));
  arm.addEventListener('keydown', (event) => {
    const keys = { ArrowLeft: angle + 5, ArrowUp: angle + 5,
      ArrowRight: angle - 5, ArrowDown: angle - 5, Home: min, End: max,
      Enter: angle >= contact ? min : max, ' ': angle >= contact ? min : max };
    if (!(event.key in keys)) return;
    event.preventDefault(); set(keys[event.key]); commit();
  });
  audio.addEventListener('needle-command', event => { set(event.detail ? max : min); setPlayingState(event.detail); });
  audio.addEventListener('play', () => { set(max); setPlayingState(true); });
  audio.addEventListener('pause', () => setPlayingState(false));
  audio.addEventListener('error', () => setPlayingState(false));
  audio.addEventListener('play-failed', () => setPlayingState(false));
  audio.addEventListener('ended', () => { setPlayingState(false); set(min); });
  set(min);
  calibrate();
  new ResizeObserver(calibrate).observe(table);
}
