export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

export function createPlayer(source) {
  const audio = document.querySelector('#audio');
  const player = document.querySelector('#player');
  const turntable = document.querySelector('#turntable');
  const play = document.querySelector('#play');
  const seek = document.querySelector('#seek');
  const status = document.querySelector('#status');
  const current = document.querySelector('#current');
  const duration = document.querySelector('#duration');
  const retry = document.querySelector('#retry');
  let requested = false;
  let loadingTimer;

  function setPlaying(playing) {
    // 只由真实 Audio 事件确认播放状态；CSS 暂停保留旋转角度。
    player.classList.toggle('playing', playing);
    turntable.classList.toggle('is-playing', playing);
    play.setAttribute('aria-label', playing ? '暂停语音' : '播放语音');
  }

  function setLoading(loading) {
    player.classList.toggle('loading', loading);
    player.setAttribute('aria-busy', String(loading));
    clearTimeout(loadingTimer);
    if (loading) loadingTimer = setTimeout(() => {
      status.textContent = '加载得有些慢，请检查网络，或重新加载音频。';
      retry.hidden = false;
      play.disabled = false;
    }, 15000);
  }

  function updateTime() {
    const available = Number.isFinite(audio.duration) && audio.duration > 0;
    seek.disabled = !available;
    duration.textContent = available ? formatTime(audio.duration) : '—:—';
    current.textContent = formatTime(audio.currentTime);
    const progress = available ? (audio.currentTime / audio.duration) * 100 : 0;
    seek.value = String(progress);
    seek.style.setProperty('--progress', `${progress}%`);
    seek.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} / ${available ? formatTime(audio.duration) : '尚未加载'}`);
  }

  function fail(message) {
    requested = false;
    setLoading(false);
    setPlaying(false);
    play.disabled = false;
    retry.hidden = false;
    status.textContent = message;
  }

  audio.addEventListener('loadedmetadata', () => { updateTime(); play.disabled = false; });
  audio.addEventListener('durationchange', updateTime);
  audio.addEventListener('timeupdate', updateTime);
  audio.addEventListener('canplay', () => {
    setLoading(false);
    play.disabled = false;
    retry.hidden = true;
    if (!requested && audio.paused) status.textContent = '轻触播放，让声音慢慢靠近。';
  });
  audio.addEventListener('playing', () => {
    requested = true;
    setLoading(false);
    setPlaying(true);
    retry.hidden = true;
    status.textContent = '此刻，只想把这些话说给你听。';
  });
  audio.addEventListener('pause', () => {
    requested = false;
    setLoading(false);
    setPlaying(false);
    if (!audio.ended && !audio.error) status.textContent = '没关系，我们慢慢听。';
  });
  audio.addEventListener('waiting', () => {
    if (requested) {
      setPlaying(false);
      setLoading(true);
      status.textContent = '声音正在靠近，请稍等…';
    }
  });
  audio.addEventListener('ended', () => {
    requested = false;
    setPlaying(false);
    setLoading(false);
    updateTime();
    play.setAttribute('aria-label', '重新播放语音');
    status.textContent = '唱片有尽头，拥抱没有。可以再听一次。';
  });
  audio.addEventListener('error', () => {
    seek.disabled = true;
    const code = audio.error?.code;
    fail(code === 3 ? '这段录音暂时无法解码，请换成浏览器支持的 MP3 文件。' :
      code === 2 ? '声音暂时未能送达，请检查网络后重试。' :
        '这张唱片还在等一段声音。录音尚未放入，或暂时无法加载。');
  });

  play.addEventListener('click', async () => {
    if (requested || !audio.paused) {
      audio.pause();
      requested = false;
      setLoading(false);
      setPlaying(false);
      return;
    }
    if (audio.error) audio.load();
    if (audio.ended) audio.currentTime = 0;
    requested = true;
    setLoading(true);
    status.textContent = '声音正在靠近，请稍等…';
    try {
      await audio.play();
    } catch (error) {
      if (error.name === 'AbortError') return; // 暂停或重新加载会取消待完成的播放。
      fail(error.name === 'NotAllowedError'
        ? '浏览器暂时阻止了播放，请再轻触一次播放按钮。'
        : '暂时无法播放这段声音，请检查录音文件和网络后重试。');
    }
  });

  seek.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = (Number(seek.value) / 100) * audio.duration;
      updateTime();
    }
  });
  retry.addEventListener('click', () => {
    audio.pause();
    requested = false;
    setPlaying(false);
    retry.hidden = true;
    setLoading(true);
    status.textContent = '正在重新寻找这段声音…';
    audio.load();
  });
  audio.src = source;
  // 不自动播放，也不预下载整个录音。
  setLoading(true);
  audio.load();
}
