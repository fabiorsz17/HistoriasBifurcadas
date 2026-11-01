import {Easing, interpolate} from 'remotion';

// Paleta provisória (herdada do Zero a 100). A paleta do canal sai junto com o personagem aprovado.
export const COR = {
  fundo: '#1F2428',
  fundo2: '#2A3036',
  giz: '#F3F0E6',
  gizSuave: '#AEB4BA',
  verde: '#5BE39A',
  verdeEsc: '#1E4D36',
  ambar: '#FFC857',
  coral: '#FF6B6B',
  azul: '#6EC6FF',
};

export const FONTE_MAO = '"Segoe Print", "Ink Free", "Comic Sans MS", cursive';
export const FONTE_TXT = 'Bahnschrift, "Segoe UI", sans-serif';

export const FPS = 30;
export const s = (seg) => Math.round(seg * FPS);

export const suave = Easing.bezier(0.45, 0, 0.55, 1);
export const salto = Easing.bezier(0.34, 1.56, 0.64, 1); // leve overshoot cartunesco
export const saida = Easing.bezier(0.16, 1, 0.3, 1);

export const tw = (f, a, b, de, para, easing = suave) =>
  interpolate(f, [a, b], [de, para], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const lerp = (a, b, t) => a + (b - a) * t;

// Ruído suave determinístico (soma de senos) para micro-movimentos.
export const ondula = (f, semente = 0) =>
  Math.sin(f * 0.05 + semente) * 0.6 + Math.sin(f * 0.131 + semente * 2.3) * 0.4;

// Pseudo-aleatório estável por índice.
export const rnd = (i, k = 1) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Desenho progressivo de traços (stroke "escrito à mão").
export const tracar = (p) => ({
  pathLength: 1,
  strokeDasharray: '1 1',
  strokeDashoffset: 1 - Math.max(0, Math.min(1, p)),
});

// ---------- Poses e keyframes ----------

const mesclar = (base, parcial) => {
  if (!parcial) return base;
  const out = {...base};
  for (const k of Object.keys(parcial)) {
    const v = parcial[k];
    out[k] =
      v && typeof v === 'object' && !Array.isArray(v) ? mesclar(base[k] || {}, v) : v;
  }
  return out;
};

const misturar = (a, b, t) => {
  if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, t);
  if (a && b && typeof a === 'object') {
    const out = {};
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      out[k] = k in a && k in b ? misturar(a[k], b[k], t) : k in b ? b[k] : a[k];
    }
    return out;
  }
  return t < 0.5 ? a : b;
};

// chaves: [{f, pose, ease?}] — poses parciais são acumuladas sobre a anterior.
export const prepararChaves = (base, chaves) => {
  let atual = base;
  return chaves.map((c) => {
    atual = mesclar(atual, c.pose);
    return {...c, pose: atual};
  });
};

const GIRO = 12; // quadros que o personagem leva para se virar

export const poseEm = (f, chaves) => {
  if (f <= chaves[0].f) return chaves[0].pose;
  for (let i = 1; i < chaves.length; i++) {
    const a = chaves[i - 1];
    const b = chaves[i];
    if (f < b.f) {
      const t = (b.ease || suave)((f - a.f) / (b.f - a.f));
      const pose = misturar(a.pose, b.pose, t);
      // O giro (dir passa por 0 = personagem "achatado") fica concentrado no fim do intervalo;
      // espalhado num intervalo longo, ele deixava o boneco de perfil por segundos (B02, EP01).
      if (a.pose.dir !== b.pose.dir) {
        const tg = Math.max(0, Math.min(1, (f - Math.max(a.f, b.f - GIRO)) / Math.min(GIRO, b.f - a.f)));
        pose.dir = lerp(a.pose.dir, b.pose.dir, suave(tg));
      }
      return pose;
    }
  }
  return chaves[chaves.length - 1].pose;
};
