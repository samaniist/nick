/* Glass-shatter handoff between two media layers. Cracks run outward from the
   engine, then each shard of the outgoing frame tilts toward the camera and
   falls away to reveal the incoming frame, with cyan light along the breaks.
   Drawn only while progress is strictly between 0 and 1; outside that range
   the canvas is cleared and the regular DOM layers show through. */

export type GlassTransition = {
  /** 0–1 handoff progress. Returns false when it cannot draw (media not ready), so the caller can fall back. */
  setProgress(progress: number): boolean;
  dispose(): void;
};

type Source = HTMLVideoElement | HTMLImageElement;

const VERTEX = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAGMENT = `precision highp float;
uniform sampler2D uA, uB;
uniform vec2 uRes, uOA, uSA, uOB, uSB, uFocus;
uniform float uP;
vec2 hash2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
float hash(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*15731.743);}
vec3 at(sampler2D s,vec2 p,vec2 o,vec2 z){vec2 uv=(p-o)/z;if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return vec3(0.);return texture2D(s,uv).rgb;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
void main(){
  vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
  float unit=uRes.y/5.5;           // shard size
  vec2 g=p/unit, cell=floor(g);
  float f1=9.,f2=9.; vec2 id=vec2(0.), feature=vec2(0.);
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
    vec2 c=cell+vec2(float(x),float(y)); vec2 fp=c+.15+.7*hash2(c);
    float d=length(g-fp);
    if(d<f1){f2=f1;f1=d;id=c;feature=fp;}else if(d<f2){f2=d;}
  }
  float edge=f2-f1;
  float r=hash(id);
  vec2 center=feature*unit;
  // Breaks spread from the focus point; each shard lets go a little later than its crack.
  float delay=clamp(length(center-uFocus)/(uRes.x*.8),0.,1.)*.58+r*.12;
  float crack=smoothstep(delay-.1,delay,uP);
  float t=smoothstep(delay,delay+.34,uP*1.08);
  // Incoming frame settles from a slight zoom.
  vec2 bp=uFocus+(p-uFocus)/(1.06-.06*uP);
  // The incoming scene starts in shadow behind the glass and brightens as the shards clear.
  vec3 colB=at(uB,bp,uOB,uSB)*(.18+.82*smoothstep(.45,1.,uP));
  // Outgoing shard: tilts, swells toward the camera and drifts out from the focus.
  vec2 dir=normalize(center-uFocus+.001);
  vec2 local=rot((r-.5)*2.4*t)*(p-center)/(1.+t*1.6);
  vec2 ap=center+local-dir*t*t*unit*2.6;
  float split=.006*t*unit;
  vec3 colA=vec3(at(uA,ap+split,uOA,uSA).r,at(uA,ap,uOA,uSA).g,at(uA,ap-split,uOA,uSA).b);
  float facet=dot(normalize(p-center+.001),vec2(-.6,-.8));
  colA*=1.+.35*t+.18*facet*crack;
  float gap=smoothstep(0.,.012+.09*t,edge);
  float alpha=(1.-smoothstep(.55,1.,t))*mix(1.,gap,crack);
  vec3 col=mix(colB,colA,alpha);
  // Light runs along the breaks, strongest where the glass has something to catch it.
  float lum=dot(colA,vec3(.3,.59,.11));
  float glow=(1.-smoothstep(0.,.04,edge))*crack*(1.-t)*(1.-smoothstep(.85,1.,uP))*(.15+1.4*lum);
  col+=vec3(.66,.92,1.)*glow*.85;
  gl_FragColor=vec4(col,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function size(source: Source) {
  return source instanceof HTMLVideoElement ? [source.videoWidth, source.videoHeight] : [source.naturalWidth, source.naturalHeight];
}

function ready(source: Source | null): source is Source {
  if (!source) return false;
  if (source instanceof HTMLVideoElement) return source.readyState >= 2 && source.videoWidth > 0;
  return source.complete && source.naturalWidth > 0;
}

/** Pixel origin and size of `source` inside the canvas, following its own computed object-fit / object-position. */
function placement(source: Source, cw: number, ch: number, dpr: number) {
  const [w0, h0] = size(source);
  const style = getComputedStyle(source);
  const scale = style.objectFit === "contain" ? Math.min(cw / w0, ch / h0) : Math.max(cw / w0, ch / h0);
  const w = w0 * scale, h = h0 * scale;
  const share = (value: string | undefined, free: number) =>
    !value ? 0.5 : value.endsWith("%") ? parseFloat(value) / 100 : free ? parseFloat(value) / free : 0.5;
  const [px, py] = style.objectPosition.split(" ");
  return [(cw - w) * share(px, (cw - w) / dpr), (ch - h) * share(py, (ch - h) / dpr), w, h];
}

export function createGlassTransition(
  canvas: HTMLCanvasElement,
  outgoing: HTMLVideoElement,
  incoming: () => Source | null,
): GlassTransition | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
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

  const texture = (unit: number) => {
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  };
  const texA = texture(0), texB = texture(1);
  const u = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform1i(u("uA"), 0);
  gl.uniform1i(u("uB"), 1);
  const uRes = u("uRes"), uOA = u("uOA"), uSA = u("uSA"), uOB = u("uOB"), uSB = u("uSB"), uFocus = u("uFocus"), uP = u("uP");

  let dpr = 1, keyA = "", keyB = "";
  const layout = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    keyA = keyB = "";
  };
  const resize = new ResizeObserver(layout);
  resize.observe(canvas);
  layout();

  const upload = (unit: number, source: Source, key: string, previous: string) => {
    if (key === previous) return previous;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    return key;
  };

  return {
    setProgress(progress) {
      const b = incoming();
      if (!ready(outgoing) || !ready(b)) return false;
      keyA = upload(0, outgoing, `${outgoing.currentTime}`, keyA);
      keyB = upload(1, b, b instanceof HTMLVideoElement ? `v${b.currentTime}` : `i${b.currentSrc}`, keyB);
      const [oax, oay, sax, say] = placement(outgoing, canvas.width, canvas.height, dpr);
      const [obx, oby, sbx, sby] = placement(b, canvas.width, canvas.height, dpr);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uOA, oax, oay); gl.uniform2f(uSA, sax, say);
      gl.uniform2f(uOB, obx, oby); gl.uniform2f(uSB, sbx, sby);
      // The engine sits right of centre in the hero frame: breaks start there.
      gl.uniform2f(uFocus, oax + sax * 0.64, oay + say * 0.48);
      gl.uniform1f(uP, progress);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return true;
    },
    dispose() {
      resize.disconnect();
      gl.deleteTexture(texA); gl.deleteTexture(texB); gl.deleteBuffer(buffer); gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
