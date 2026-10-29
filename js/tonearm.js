export function setupTonearm({ audio, start, stop }) {
  const arm = document.querySelector('#tonearm');
  const table = document.querySelector('#turntable');
  const min = -13, max = 30, contact = 2;
  let angle = min, drag = null;
  function set(value) {
    angle = Math.max(min, Math.min(max, value));
    arm.style.setProperty('--angle', `${angle}deg`);
    arm.setAttribute('aria-valuenow', String(Math.round(angle)));
    arm.setAttribute('aria-valuetext', angle >= contact ? '唱针位于唱片上' : '唱针已抬起');
  }
  function commit() {
    if (angle >= contact) start(); else stop();
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
      Enter: angle >= contact ? min : 14, ' ': angle >= contact ? min : 14 };
    if (!(event.key in keys)) return;
    event.preventDefault(); set(keys[event.key]); commit();
  });
  audio.addEventListener('needle-command', event => set(event.detail ? 14 : min));
  audio.addEventListener('ended', () => set(min));
  set(min);
}
