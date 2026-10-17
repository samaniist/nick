import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createScrollVideo } from './scroll-video.ts';
class Video extends EventTarget {
  duration = 8; readyState = 4; seeking = false; time = 0; requests = [];
  get currentTime() { return this.time; }
  set currentTime(t) { this.time = t; this.requests.push(t); this.seeking = true; }
  finish() { this.seeking = false; this.dispatchEvent(new Event('seeked')); }
}
test('reverse scroll replaces pending forward seeks with the latest target', () => {
  const video = new Video(); const scrub = createScrollVideo(video, () => true);
  scrub.setProgress(1); scrub.setProgress(.7); scrub.setProgress(.2);
  assert.equal(video.requests.length, 1);
  video.finish(); assert.equal(video.requests.length, 2);
  assert.ok(Math.abs(video.currentTime - .2*(8-1/24)) < .001);
  video.finish(); scrub.setProgress(0); video.finish();
  assert.equal(video.currentTime, 0); scrub.dispose();
});
test('evicted frame with metadata can seek without waiting for loadeddata', () => {
  const video = new Video(); video.time = 7; video.readyState = 1;
  const scrub = createScrollVideo(video, () => true); scrub.setProgress(.1);
  assert.equal(video.requests.length, 1); scrub.dispose();
});
test('loading and offscreen requests resume at newest position; disposal stops callbacks', () => {
  const video = new Video(); video.readyState = 0; let active = false;
  const scrub = createScrollVideo(video, () => active);
  scrub.setProgress(1); scrub.setProgress(.3);
  video.readyState = 1; video.dispatchEvent(new Event('loadedmetadata'));
  assert.equal(video.requests.length, 0);
  active = true; video.dispatchEvent(new Event('canplay'));
  assert.ok(Math.abs(video.currentTime - .3*(8-1/24)) < .001);
  scrub.setProgress(.9); scrub.dispose(); video.finish();
  assert.equal(video.requests.length, 1);
});
