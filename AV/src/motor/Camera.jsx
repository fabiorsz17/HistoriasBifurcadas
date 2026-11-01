import React from 'react';
import {suave} from './base.js';

// Câmera virtual do mundo 1920x1080. {x, y} é o ponto do mundo no centro da tela; z é o zoom (1 = quadro inteiro);
// rot gira o quadro em graus. Camadas com profundidade diferente se movem em velocidades diferentes (parallax).

export const CAM_INICIAL = {x: 960, y: 540, z: 1, rot: 0};

// chaves: [{f, x?, y?, z?, rot?, ease?}] — o que não vier repete a chave anterior.
// ease é a curva do trecho que TERMINA nesta chave (padrão: suave).
export const prepararCamera = (chaves) => {
  let atual = CAM_INICIAL;
  return chaves.map((c) => {
    atual = {...atual, ...Object.fromEntries(Object.entries(c).filter(([k]) => k in CAM_INICIAL))};
    return {f: c.f, ease: c.ease, cam: atual};
  });
};

export const cameraEm = (f, chaves) => {
  if (f <= chaves[0].f) return chaves[0].cam;
  for (let i = 1; i < chaves.length; i++) {
    const a = chaves[i - 1];
    const b = chaves[i];
    if (f < b.f) {
      const t = (b.ease || suave)((f - a.f) / (b.f - a.f));
      const out = {};
      for (const k of Object.keys(CAM_INICIAL)) out[k] = a.cam[k] + (b.cam[k] - a.cam[k]) * t;
      return out;
    }
  }
  return chaves[chaves.length - 1].cam;
};

// Tremor que decai (susto, impacto, porta batendo). Determinístico: o mesmo quadro sempre treme igual.
export const tremor = (f, inicio, duracao = 14, forca = 18) => {
  const t = (f - inicio) / duracao;
  if (t < 0 || t > 1) return {x: 0, y: 0, rot: 0};
  const amp = forca * (1 - t) ** 2;
  return {x: Math.sin(f * 2.9) * amp, y: Math.cos(f * 3.7) * amp * 0.7, rot: Math.sin(f * 2.3) * amp * 0.04};
};

// Respiração da câmera na mão: deriva lenta e quase imperceptível, para o quadro não ficar "morto".
export const naMao = (f, forca = 1) => ({
  x: (Math.sin(f * 0.021) * 6 + Math.sin(f * 0.047 + 1.3) * 3) * forca,
  y: (Math.sin(f * 0.017 + 2.1) * 4 + Math.sin(f * 0.039) * 2) * forca,
  rot: Math.sin(f * 0.013) * 0.15 * forca,
});

export const somar = (cam, ...extras) =>
  extras.reduce((c, e) => ({...c, x: c.x + (e.x || 0), y: c.y + (e.y || 0), rot: c.rot + (e.rot || 0)}), cam);

// Uma camada vista pela câmera. prof = 1 é o plano dos personagens; < 1 fica mais longe (move menos);
// > 1 fica na frente (move mais). desfoque em px simula profundidade de campo.
export const Camada = ({cam, prof = 1, desfoque = 0, children, style}) => {
  const z = 1 + (cam.z - 1) * prof;
  const x = 960 + (cam.x - 960) * prof;
  const y = 540 + (cam.y - 540) * prof;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        transformOrigin: '0 0',
        transform: `translate(960px, 540px) rotate(${cam.rot}deg) scale(${z}) translate(${-x}px, ${-y}px)`,
        filter: desfoque > 0.05 ? `blur(${desfoque}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Escurece as bordas do quadro (fica fora da câmera).
export const Vinheta = ({forca = 0.55}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${forca}) 100%)`}} />
);
