// Motion layer for the landing page. Styles live in app/fx.css.
// Everything here is progressive: without it the page already shows its final state.
// Returns a cleanup function (React strict mode mounts effects twice in dev).

type Stop = () => void;
type Scope = { later: (fn: () => void, ms: number) => number; raf: (fn: FrameRequestCallback) => number; stop: Stop };

function scope(): Scope {
  const timers: number[] = [];
  const rafs: number[] = [];
  let dead = false;
  return {
    later(fn: () => void, ms: number) {
      const id = window.setTimeout(() => { if (!dead) fn(); }, ms);
      timers.push(id);
      return id;
    },
    raf(fn: FrameRequestCallback) {
      const id = requestAnimationFrame((t: number) => { if (!dead) fn(t); });
      rafs.push(id);
      return id;
    },
    stop() {
      dead = true;
      timers.forEach((id) => clearTimeout(id));
      rafs.forEach((id) => cancelAnimationFrame(id));
    },
  };
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function countUp(el: HTMLElement, to: number, o: { dur?: number; delay?: number; suf?: string; dec?: number }): Stop {
  const dur = o.dur ?? 1200, delay = o.delay ?? 0, suf = o.suf ?? '', dec = o.dec ?? 0;
  const t0 = performance.now() + delay;
  let raf = 0;
  const set = (v: number) => { el.textContent = v.toFixed(dec) + suf; };
  set(0);
  const f = (t: number) => {
    const k = clamp((t - t0) / dur, 0, 1);
    set(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) raf = requestAnimationFrame(f);
  };
  raf = requestAnimationFrame(f);
  return () => cancelAnimationFrame(raf);
}

// Reads data-fx-count / data-suf / data-dec / data-delay / data-dur. Stopping restores the real text.
function runCount(el: HTMLElement): Stop {
  if (el.dataset.final === undefined) el.dataset.final = el.textContent || '';
  const stop = countUp(el, parseFloat(el.dataset.fxCount || '0'), {
    dur: Number(el.dataset.dur || 1200),
    delay: Number(el.dataset.delay || 0),
    suf: el.dataset.suf || '',
    dec: Number(el.dataset.dec || 0),
  });
  return () => { stop(); el.textContent = el.dataset.final || ''; };
}

// Random-letter decode that locks left to right.
function scramble(el: HTMLElement, final: string, dur: number, s: Scope, mode: 'code' | 'letters') {
  const t0 = performance.now();
  const n = final.length;
  const code = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  const pick = (ch: string) => {
    if (mode === 'code') return code[Math.floor(Math.random() * code.length)];
    if (/[a-z]/.test(ch)) return String.fromCharCode(97 + Math.floor(Math.random() * 26));
    if (/[A-Z]/.test(ch)) return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return ch;
  };
  const f = (t: number) => {
    const k = clamp((t - t0) / dur, 0, 1);
    const lock = Math.floor(k * n);
    let out = '';
    for (let i = 0; i < n; i++) out += i < lock || !/[A-Za-z0-9]/.test(final[i]) ? final[i] : pick(final[i]);
    el.textContent = k >= 1 ? final : out;
    if (k < 1) s.raf(f);
  };
  s.raf(f);
}

// Adds .fx-armed now, .in while the element is on screen (removed again when it leaves, so it replays).
function watch(el: HTMLElement, o: { threshold: number; enter: () => Stop | void; once?: boolean }): Stop {
  el.classList.add('fx-armed');
  let stop: Stop | void;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const on = el.classList.contains('in');
        const seen = e.intersectionRatio >= o.threshold || e.intersectionRect.height >= innerHeight * 0.45;
        if (!on && e.isIntersecting && seen) {
          el.classList.add('in');
          stop = o.enter();
          if (o.once) io.disconnect();
        } else if (on && !o.once && e.intersectionRatio === 0) {
          el.classList.remove('in');
          if (stop) stop();
          stop = undefined;
        }
      }
    },
    { threshold: [0, 0.05, 0.15, 0.35, 0.5, 0.75, 1] },
  );
  io.observe(el);
  return () => { io.disconnect(); if (stop) stop(); el.classList.remove('in', 'fx-armed'); };
}

/* ───────────── tile behaviours ───────────── */

function arena(t: HTMLElement): Stop {
  const wrap = t.querySelector('.arena') as HTMLElement | null;
  if (!wrap) return () => {};
  const s = scope();
  const rows = Array.from(wrap.querySelectorAll('.rank')) as HTMLElement[];
  const codes = Array.from(wrap.querySelectorAll('.cd')) as HTMLElement[];
  const perms = [[2, -1, -1], [1, 1, -2], [1, -1, 0]];
  let k = 0;
  const cycle = (first: boolean) => {
    const p = perms[k++ % perms.length];
    rows.forEach((r, i) => r.style.setProperty('--o', String(p[i])));
    if (first) wrap.classList.add('nt');
    wrap.classList.remove('sorted');
    if (first) { void wrap.offsetWidth; wrap.classList.remove('nt'); }
    s.later(() => wrap.classList.add('sorted'), first ? 1100 : 900);
    s.later(() => cycle(false), 7600);
  };
  codes.forEach((c, i) => s.later(() => scramble(c, c.dataset.scr || '', 900, s, 'code'), 120 + i * 200));
  cycle(true);
  return () => {
    s.stop();
    rows.forEach((r, i) => r.style.setProperty('--o', String([2, -1, -1][i])));
    wrap.classList.add('sorted');
    codes.forEach((c) => { c.textContent = c.dataset.scr || ''; });
  };
}

function chat(t: HTMLElement): Stop {
  const c = t.querySelector('.chat') as HTMLElement | null;
  if (!c) return () => {};
  const s = scope();
  const bubs = Array.from(c.querySelectorAll('.bub')) as HTMLElement[];
  const dr = c.querySelector('.dots.r') as HTMLElement;
  const dl = c.querySelector('.dots.l') as HTMLElement;
  bubs.forEach((b) => { if (b.dataset.full === undefined) b.dataset.full = b.textContent || ''; });
  const typeInto = (b: HTMLElement, done: () => void) => {
    const txt = b.dataset.full || '';
    let i = 0;
    b.classList.remove('hide');
    b.classList.add('show', 'typing');
    const step = () => {
      i++;
      b.textContent = txt.slice(0, i);
      if (i < txt.length) s.later(step, 16 + Math.random() * 26);
      else { b.classList.remove('typing'); done(); }
    };
    b.textContent = '';
    step();
  };
  const steps: Array<(next: () => void) => void> = [
    (n) => s.later(n, 300),
    (n) => typeInto(bubs[0], n),
    (n) => s.later(() => { dr.classList.add('on'); n(); }, 400),
    (n) => s.later(() => { dr.classList.remove('on'); n(); }, 1100),
    (n) => typeInto(bubs[1], n),
    (n) => s.later(() => { dl.classList.add('on'); n(); }, 500),
    (n) => s.later(() => { dl.classList.remove('on'); n(); }, 1000),
    (n) => typeInto(bubs[2], n),
  ];
  const run = () => {
    bubs.forEach((b) => { b.classList.add('hide'); b.classList.remove('show', 'typing'); });
    dr.classList.remove('on'); dl.classList.remove('on');
    const go = (i: number) => { if (i >= steps.length) { s.later(run, 4200); return; } steps[i](() => go(i + 1)); };
    go(0);
  };
  run();
  return () => {
    s.stop();
    bubs.forEach((b) => { b.textContent = b.dataset.full || ''; b.classList.remove('hide', 'show', 'typing'); });
    dr.classList.remove('on'); dl.classList.remove('on');
  };
}

const BN = {
  bn: {
    h: 'ইংরেজি ও বাংলা, দুই ভাষাতেই',
    p: 'প্রতিটি স্ক্রিন, কারণ ও রিমাইন্ডার ইংরেজি ও বাংলা, দুই ভাষাতেই পাওয়া যায়। ইংরেজি রিসোর্সের পাশেই থাকে বাংলা রিসোর্স।',
  },
  en: {
    h: 'English and Bangla, both ways',
    p: 'Every screen, reason and reminder is available in English and Bangla, with Bangla resources beside English ones.',
  },
};

function bangla(t: HTMLElement): Stop {
  const h = t.querySelector('h3') as HTMLElement | null;
  const p = t.querySelector('p') as HTMLElement | null;
  const lang = t.querySelector('.lang') as HTMLElement | null;
  if (!h || !p || !lang) return () => {};
  const s = scope();
  const origH = h.textContent || '', origP = p.textContent || '';
  let cur: 'bn' | 'en' = 'bn';
  const apply = (l: 'bn' | 'en') => {
    lang.dataset.l = l;
    h.classList.add('swap'); p.classList.add('swap');
    s.later(() => {
      h.textContent = BN[l].h; p.textContent = BN[l].p;
      h.lang = l; p.lang = l;
      h.classList.remove('swap'); p.classList.remove('swap');
    }, 300);
  };
  const loop = () => s.later(() => { cur = cur === 'bn' ? 'en' : 'bn'; apply(cur); loop(); }, 3600);
  s.later(() => apply('bn'), 500);
  loop();
  return () => {
    s.stop();
    h.textContent = origH; p.textContent = origP;
    h.lang = 'bn'; p.removeAttribute('lang');
    h.classList.remove('swap'); p.classList.remove('swap');
    lang.dataset.l = 'bn';
  };
}

const TILE_FX: Record<string, (t: HTMLElement) => Stop> = { arena, chat, bangla };

/* ───────────── init ───────────── */

export function initFx(): () => void {
  if (typeof window === 'undefined') return () => {};
  const cleanups: Stop[] = [];
  const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const q = (sel: string, r: ParentNode = document) => r.querySelector(sel) as HTMLElement | null;
  const qa = (sel: string, r: ParentNode = document) => Array.from(r.querySelectorAll(sel)) as HTMLElement[];
  const on = (t: EventTarget, e: string, f: any, o?: any) => { t.addEventListener(e, f, o); cleanups.push(() => t.removeEventListener(e, f, o)); };

  if (noMotion) return () => {};

  /* hero: counters, 3D rig that follows the pointer (or drifts when nobody is touching it) */
  const heroEl = q('.hero'), rig = q('.rig'), stage = q('.stage');
  qa('.hero [data-fx-count]').forEach((el) => cleanups.push(runCount(el)));
  if (heroEl && rig && stage) {
    let tx = 0, ty = 0, cx = 0, cy = 0, last = -1e9, visible = true, raf = 0;
    let hx = heroEl.clientWidth * 0.72, hy = heroEl.clientHeight * 0.34, htx = hx, hty = hy;
    const loop = (t: number) => {
      raf = 0;
      if (!visible) return;
      const idle = t - last > 1800;
      const gx = idle ? Math.sin(t / 2400) * 0.35 : tx;
      const gy = idle ? Math.cos(t / 3100) * 0.25 : ty;
      cx += (gx - cx) * 0.07; cy += (gy - cy) * 0.07;
      hx += (htx - hx) * 0.08; hy += (hty - hy) * 0.08;
      rig.style.setProperty('--ry', (cx * 11).toFixed(2) + 'deg');
      rig.style.setProperty('--rx', (-cy * 8).toFixed(2) + 'deg');
      heroEl.style.setProperty('--hx', hx.toFixed(1) + 'px');
      heroEl.style.setProperty('--hy', hy.toFixed(1) + 'px');
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(heroEl);
    raf = requestAnimationFrame(loop);
    if (finePointer) {
      on(heroEl, 'pointermove', (e: PointerEvent) => {
        const r = stage.getBoundingClientRect(), hr = heroEl.getBoundingClientRect();
        tx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 0.7), -1, 1);
        ty = clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 0.7), -1, 1);
        htx = e.clientX - hr.left; hty = e.clientY - hr.top;
        last = performance.now();
      });
    }
    cleanups.push(() => { io.disconnect(); cancelAnimationFrame(raf); });
  }

  /* career-path rails: scroll speed spins them up, hovering slows them, a spotlight follows the cursor */
  const marq = q('.marq');
  if (marq) {
    const rails = qa('.rail', marq);
    const chips = qa('.cp', marq);
    let rate = 1, vel = 0, lastY = window.scrollY, hover = false, raf = 0, px = 0, py = 0;
    const spot = () => {
      const rects = chips.map((c) => c.getBoundingClientRect());
      chips.forEach((c, i) => {
        c.style.setProperty('--mx', (px - rects[i].left).toFixed(0) + 'px');
        c.style.setProperty('--my', (py - rects[i].top).toFixed(0) + 'px');
      });
    };
    const tick = () => {
      raf = 0;
      vel *= 0.9;
      const target = (hover ? 0.18 : 1) + Math.min(vel / 6, 7);
      rate += (target - rate) * 0.12;
      rails.forEach((r) => r.getAnimations().forEach((a) => { a.playbackRate = rate; }));
      if (hover) spot();
      if (hover || vel > 0.05 || Math.abs(rate - target) > 0.01) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    on(window, 'scroll', () => {
      const y = window.scrollY;
      vel = Math.min(60, Math.max(vel, Math.abs(y - lastY)));
      lastY = y;
      kick();
    }, { passive: true });
    on(marq, 'pointermove', (e: PointerEvent) => { px = e.clientX; py = e.clientY; hover = true; kick(); });
    on(marq, 'pointerleave', () => { hover = false; kick(); });
    cleanups.push(() => cancelAnimationFrame(raf));
  }

  /* "Proof does." section */
  const proof = q('#proof');
  if (proof) {
    cleanups.push(watch(proof, {
      threshold: 0.4,
      enter: () => { const stops = qa('[data-fx-count]', proof).map(runCount); return () => stops.forEach((f) => f()); },
    }));
  }

  /* feature headline decode, once */
  qa('.decode').forEach((h) => {
    const s = scope();
    const text = h.dataset.text || h.textContent || '';
    cleanups.push(watch(h, {
      threshold: 0.6, once: true,
      enter: () => { scramble(h, text, 900, s, 'letters'); },
    }));
    cleanups.push(() => { s.stop(); h.textContent = text; });
  });

  /* bento tiles: each one plays its own scene when it comes into view */
  qa('#features .tile').forEach((t) => {
    cleanups.push(watch(t, {
      threshold: 0.4,
      enter: () => {
        const counts = qa('[data-fx-count]', t).map(runCount);
        const extra = TILE_FX[t.dataset.fx || ''];
        const stopExtra = extra ? extra(t) : undefined;
        return () => { counts.forEach((f) => f()); if (stopExtra) stopExtra(); };
      },
    }));
    if (finePointer) {
      on(t, 'pointermove', (e: PointerEvent) => {
        const r = t.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        t.style.setProperty('--mx', x.toFixed(0) + 'px');
        t.style.setProperty('--my', y.toFixed(0) + 'px');
        t.style.setProperty('--ty', ((x / r.width - 0.5) * 6).toFixed(2) + 'deg');
        t.style.setProperty('--tx', (-(y / r.height - 0.5) * 6).toFixed(2) + 'deg');
      });
      on(t, 'pointerleave', () => { t.style.setProperty('--tx', '0deg'); t.style.setProperty('--ty', '0deg'); });
    }
  });

  return () => cleanups.forEach((c) => c());
}
