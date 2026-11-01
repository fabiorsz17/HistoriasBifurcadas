import React from 'react';
import {AbsoluteFill, Audio, Sequence, useCurrentFrame} from 'remotion';
import {COR, prepararChaves, poseEm, salto, saida, tw} from '../motor/base.js';
import {POSE_BASE} from '../motor/Boneco.jsx';
import {Personagem, ROUPAS} from '../motor/Personagem.jsx';
import {Camada, Vinheta, cameraEm, naMao, prepararCamera, somar, tremor} from '../motor/Camera.jsx';
import {NIVEL_EFEITOS, ef} from '../motor/efeitos.js';

// Teste do motor: parallax em 5 planos, personagem andando, empurrão de câmera com tremor no susto,
// recuo revelando um objeto e efeitos sonoros do banco. Sem narração: serve só para aprovar câmera e ritmo.

const CHAO = 860;
const SUSTO = 132;
const REVELA = 186;

const CHAVES_CAM = prepararCamera([
  {f: 0, x: 960, y: 560, z: 1.0},
  {f: 110, x: 1010, y: 560, z: 1.12},
  {f: SUSTO + 6, x: 1000, y: 440, z: 2.3, ease: saida}, // empurrão rápido no rosto
  {f: REVELA - 6, x: 1000, y: 450, z: 2.25},
  {f: REVELA + 40, x: 1200, y: 560, z: 1.15}, // recua e revela a mala
  {f: 300, x: 1230, y: 570, z: 1.22},
]);

const CHAVES_POSE = prepararChaves({...POSE_BASE, x: 420}, [
  {f: 0, pose: {amp: 1, passo: 0}},
  {f: SUSTO - 4, pose: {x: 940, passo: 4.6, amp: 1}},
  {f: SUSTO + 2, pose: {amp: 0, inclina: -8, cabeca: -6, bracoE: {o: -40, c: 70}, bracoD: {o: 40, c: 70}, rosto: {olhos: 'arregalados', boca: 'o', sobr: -1.4}}, ease: salto},
  {f: REVELA, pose: {inclina: -4, olhar: 1, cabeca: 0}},
  {f: REVELA + 30, pose: {inclina: 6, olhar: 1, bracoD: {o: 70, c: 10}, bracoE: {o: -10, c: 20}, rosto: {olhos: 'abertos', boca: 'preocupada', sobr: -0.8, suor: 0.8}}},
]);

const Ceu = () => (
  <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
    <defs>
      <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1B2A4A" />
        <stop offset="0.6" stopColor="#E0795A" />
        <stop offset="1" stopColor="#F6C177" />
      </linearGradient>
    </defs>
    <rect x={-1500} y={-900} width={4920} height={2880} fill="url(#ceu)" />
    <circle cx={1350} cy={640} r={110} fill="#FFE2A8" opacity={0.9} />
  </svg>
);

const Montanhas = () => (
  <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
    <path d="M -1200 820 L -500 520 L 100 760 L 600 480 L 1150 780 L 1700 470 L 2300 760 L 3100 560 L 3100 1400 L -1200 1400 Z" fill="#5B3F5E" />
    <path d="M -1200 880 L -300 680 L 400 860 L 1000 640 L 1600 870 L 2300 650 L 3100 860 L 3100 1400 L -1200 1400 Z" fill="#3E2C48" />
  </svg>
);

const Arvores = () => (
  <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
    {[-500, -150, 180, 560, 1460, 1820, 2200, 2600].map((x, i) => (
      <g key={i} transform={`translate(${x} ${CHAO - 10}) scale(${0.8 + (i % 3) * 0.15})`}>
        <rect x={-10} y={-120} width={20} height={130} fill="#2A1E2E" />
        <path d="M 0 -330 L 90 -110 L -90 -110 Z" fill="#2E3B2F" />
        <path d="M 0 -250 L 110 -40 L -110 -40 Z" fill="#26322A" />
      </g>
    ))}
  </svg>
);

const Mala = ({p, frame}) => (
  <g transform={`translate(1480 ${CHAO}) scale(${0.6 + 0.4 * p})`} opacity={p}>
    <ellipse cx={0} cy={-60} rx={150} ry={110} fill="#FFD36E" opacity={0.18 + Math.sin(frame * 0.15) * 0.06} />
    <rect x={-80} y={-110} width={160} height={110} rx={12} fill="#6B4226" stroke={COR.giz} strokeWidth={6} />
    <path d="M -30 -110 L -30 -132 L 30 -132 L 30 -110" fill="none" stroke={COR.giz} strokeWidth={6} />
    <rect x={-14} y={-66} width={28} height={18} rx={3} fill={COR.ambar} />
  </g>
);

const Capim = () => (
  <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
    {Array.from({length: 40}, (_, i) => {
      const x = -900 + i * 95;
      return <path key={i} d={`M ${x} 1140 Q ${x + 10} 1010 ${x + 34} 960 Q ${x + 24} 1020 ${x + 30} 1140 Z`} fill="#1A1420" />;
    })}
  </svg>
);

export const TesteCamera = () => {
  const frame = useCurrentFrame();
  const cam = somar(cameraEm(frame, CHAVES_CAM), naMao(frame), tremor(frame, SUSTO, 16, 22));
  const pose = poseEm(frame, CHAVES_POSE);
  const mala = tw(frame, REVELA, REVELA + 24, 0, 1, salto);
  // Durante o close no rosto, o fundo desfoca (profundidade de campo).
  const foco = tw(frame, SUSTO, SUSTO + 8, 0, 1) * (1 - tw(frame, REVELA, REVELA + 30, 0, 1));

  return (
    <AbsoluteFill style={{backgroundColor: '#1B2A4A', overflow: 'hidden'}}>
      <Camada cam={cam} prof={0.1}><Ceu /></Camada>
      <Camada cam={cam} prof={0.3} desfoque={foco * 6}><Montanhas /></Camada>
      <Camada cam={cam} prof={0.6} desfoque={foco * 4}><Arvores /></Camada>
      <Camada cam={cam} prof={1}>
        <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
          <rect x={-1500} y={CHAO} width={4920} height={900} fill="#2A2030" />
          <Mala p={mala} frame={frame} />
          <g transform={`translate(0 ${CHAO})`}>
            <Personagem pose={pose} frame={frame} escala={0.95} roupa={ROUPAS.moletom} id="heroi" />
          </g>
        </svg>
      </Camada>
      <Camada cam={cam} prof={1.4} desfoque={3}><Capim /></Camada>
      <Vinheta forca={0.5 + foco * 0.2} />

      <Sequence from={SUSTO - 6} durationInFrames={30}><Audio src={ef('whoosh')} volume={0.45 * NIVEL_EFEITOS} /></Sequence>
      <Sequence from={SUSTO + 2} durationInFrames={60}><Audio src={ef('coracao')} volume={0.3 * NIVEL_EFEITOS} /></Sequence>
      <Sequence from={REVELA - 4} durationInFrames={30}><Audio src={ef('woosh_suave')} volume={0.4 * NIVEL_EFEITOS} /></Sequence>
      <Sequence from={REVELA + 4} durationInFrames={60}><Audio src={ef('magia_brilho')} volume={0.45 * NIVEL_EFEITOS} /></Sequence>
    </AbsoluteFill>
  );
};
