/** Retain the latest scroll request while the decoder is busy or buffering. */
export function createScrollVideo(video: HTMLVideoElement, enabled: () => boolean) {
  let progress = 0;
  let disposed = false;
  const flush = () => {
    if (disposed || !enabled() || video.seeking || video.readyState < 1 || !Number.isFinite(video.duration)) return;
    const time = progress * Math.max(0, video.duration - 1 / 24);
    if (Math.abs(video.currentTime - time) <= 1 / 48) return;
    // Metadata is enough to seek. Waiting for current-frame data can leave a
    // paused decoder stuck after the browser evicts its offscreen frame.
    video.currentTime = time;
  };
  const events = ['loadedmetadata', 'loadeddata', 'canplay', 'seeked'] as const;
  events.forEach(event => video.addEventListener(event, flush));
  return {
    setProgress(value: number) {
      progress = Math.max(0, Math.min(1, value));
      flush();
    },
    dispose() {
      disposed = true;
      events.forEach(event => video.removeEventListener(event, flush));
    },
  };
}
