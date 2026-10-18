/* A glass lens that follows the pointer over a <video>. Only the lens disc is
   drawn (everything else stays transparent), so the real video element keeps
   rendering the rest of the frame. The video is re-uploaded only when its
   frame changes, and the loop sleeps whenever the lens and video are still. */

export type GlassLens = {
  /** Pointer position in client coordinates; `on` false shrinks the lens away. */
  point(clientX: number, clientY: number, on: boolean): void;
  leave(): void;
  setEnabled(enabled: boolean): void;
  dispose(): void;
};

const VERTEX = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAGMENT = `precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes, uMouse, uOrigin, uSize;
uniform float uRadius, uStrength;
vec3 at(vec2 p){
  vec2 uv=(p-uOrigin)/uSize;
  if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.) return vec3(0.);
  return texture2D(uTex,uv).rgb;
}
void main(){
  vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
  vec2 d=p-uMouse;
  float r=length(d)/uRadius;
  if(r>1.) discard;
  float edge=smoothstep(.7,1.,r);
  // Magnify the centre, bend the rim inward like thick glass.
  vec2 dir=d*(1.-uStrength*.34*(1.-r*r))-d*edge*edge*.12*uStrength;
  float split=.014*uStrength*r;
  vec3 col=vec3(at(uMouse+dir*(1.+split)).r,at(uMouse+dir).g,at(uMouse+dir*(1.-split)).b);
  col=col*(1.+.14*uStrength)+vec3(.015,.05,.07)*uStrength*(1.-r);
  float rim=smoothstep(.84,.97,r)*(1.-smoothstep(.97,1.,r));
  col+=vec3(.76,.95,1.)*rim*.4*uStrength;
  float spec=smoothstep(.38,0.,length(d/uRadius-vec2(-.36,-.44)));
  col+=vec3(1.)*spec*.09*uStrength;
  float a=(1.-smoothstep(.985,1.,r))*min(1.,uStrength*1.6);
  gl_FragColor=vec4(col*a,a);
}`;

const RADIUS = 130;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

/** Parses a computed object-position component ("50%", "100%", "12px") into a 0–1 share of the free space. */
function position(value: string | undefined, free: number) {
  if (!value) return 0.5;
  if (value.endsWith("%")) return parseFloat(value) / 100;
  return free ? parseFloat(value) / free : 0.5;
}

export function createGlassLens(canvas: HTMLCanvasElement, video: HTMLVideoElement): GlassLens | null {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX), fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) return null;
  const program = gl.createProgram()!;
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uRes = u("uRes"), uMouse = u("uMouse"), uOrigin = u("uOrigin"), uSize = u("uSize"), uRadius = u("uRadius"), uStrength = u("uStrength");

  let dpr = 1, frame = 0, disposed = false, enabled = false, inside = false, wanted = false;
  let tx = 0, ty = 0, mx = 0, my = 0, strength = 0, uploadedTime = -1, uploadedSize = "";

  const layout = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    uploadedTime = -1;
    schedule();
  };
  // Match the video's own object-fit / object-position so the lens samples exactly what is underneath.
  const mapping = () => {
    const vw = video.videoWidth, vh = video.videoHeight, cw = canvas.width, ch = canvas.height;
    const style = getComputedStyle(video);
    const scale = style.objectFit === "contain" ? Math.min(cw / vw, ch / vh) : Math.max(cw / vw, ch / vh);
    const w = vw * scale, h = vh * scale;
    const [px, py] = style.objectPosition.split(" ");
    return [(cw - w) * position(px, (cw - w) / dpr), (ch - h) * position(py, (ch - h) / dpr), w, h];
  };

  const render = () => {
    frame = 0;
    if (disposed) return;
    const target = enabled && inside && wanted ? 1 : 0;
    mx += (tx - mx) * 0.22; my += (ty - my) * 0.22;
    strength += (target - strength) * 0.12;
    if (Math.abs(target - strength) < 0.002) strength = target;
    if (Math.abs(tx - mx) < 0.05) mx = tx;
    if (Math.abs(ty - my) < 0.05) my = ty;

    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const ready = video.readyState >= 2 && video.videoWidth > 0;
    if (strength > 0 && ready) {
      const size = `${video.videoWidth}x${video.videoHeight}`;
      if (video.currentTime !== uploadedTime || size !== uploadedSize) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        uploadedTime = video.currentTime; uploadedSize = size;
      }
      const radius = RADIUS * dpr * (0.55 + 0.45 * strength);
      const [ox, oy, w, h] = mapping();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform2f(uOrigin, ox, oy);
      gl.uniform2f(uSize, w, h);
      gl.uniform1f(uRadius, radius);
      gl.uniform1f(uStrength, strength);
      // Only shade the lens' bounding box.
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(Math.floor(mx - radius), Math.floor(canvas.height - my - radius), Math.ceil(radius * 2), Math.ceil(radius * 2));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    const moving = strength !== target || mx !== tx || my !== ty;
    if (moving) frame = requestAnimationFrame(render);
  };
  const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(render); };

  const resize = new ResizeObserver(layout);
  resize.observe(canvas);
  // The hero video is scrubbed by scroll: refresh the lens when a new frame lands.
  video.addEventListener("seeked", schedule);
  video.addEventListener("loadeddata", schedule);
  layout();

  return {
    point(clientX, clientY, on) {
      const rect = canvas.getBoundingClientRect();
      tx = (clientX - rect.left) * (canvas.width / rect.width);
      ty = (clientY - rect.top) * (canvas.height / rect.height);
      if (!inside || strength === 0) { mx = tx; my = ty; }
      inside = true; wanted = on;
      schedule();
    },
    leave() { inside = false; schedule(); },
    setEnabled(value) { if (enabled !== value) { enabled = value; schedule(); } },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      video.removeEventListener("seeked", schedule);
      video.removeEventListener("loadeddata", schedule);
      gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
