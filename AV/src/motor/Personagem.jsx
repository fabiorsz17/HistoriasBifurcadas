import React from 'react';
import {ondula} from './base.js';
import {calcularRig} from './Boneco.jsx';

// Personagem do canal em traço de tinta: cabeça grande e clara, cabelo preto com redemoinho, membros de traço,
// roupa com cor e textura, contorno brilhante opcional. Usa o mesmo rig e as mesmas poses do Boneco
// (prepararChaves/poseEm), então toda animação feita para um serve para o outro.
// rosto: olhos 'abertos' | 'felizes' | 'fechados' | 'arregalados'; boca 'sorriso' | 'aberta' | 'triste' | 'reta' | 'o' | 'preocupada';
// sobr < 0 = surpresa/preocupação, sobr > 0 = raiva; suor 0..1.

export const TINTA = '#151517';
export const CABECA = 1.25; // cabeça grande: ~1/3 da altura do corpo
export const PELE = '#FBF8F1';

export const ROUPAS = {
  moletom: {tipo: 'moletom', cor: '#E2A53C', sombra: '#B57F22'},
  xadrez: {tipo: 'xadrez', cor: '#B8433A', sombra: '#7E2B25', linha: '#2B2F4A'},
  jaqueta: {tipo: 'jaqueta', cor: '#2F7F86', sombra: '#1F5A60', fone: true},
};

const Glow = ({id, cor}) => (
  <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
    <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="borda" />
    <feGaussianBlur in="borda" stdDeviation="7" result="borrada" />
    <feFlood floodColor={cor} />
    <feComposite in2="borrada" operator="in" result="brilho" />
    <feMerge>
      <feMergeNode in="brilho" />
      <feMergeNode in="brilho" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

const Olho = ({x, y, tipo, piscar}) => {
  const linha = {stroke: TINTA, strokeWidth: 5.5, fill: 'none', strokeLinecap: 'round'};
  if (piscar || tipo === 'fechados') return <path d={`M ${x - 10} ${y - 1} Q ${x} ${y + 7} ${x + 10} ${y - 1}`} {...linha} />;
  if (tipo === 'felizes') return <path d={`M ${x - 10} ${y + 4} Q ${x} ${y - 9} ${x + 10} ${y + 4}`} {...linha} />;
  if (tipo === 'arregalados')
    return (
      <g>
        <circle cx={x} cy={y} r={14} fill="#FFFFFF" stroke={TINTA} strokeWidth={4.5} />
        <circle cx={x} cy={y + 1} r={5.5} fill={TINTA} />
      </g>
    );
  return (
    <g>
      <ellipse cx={x} cy={y} rx={6.5} ry={9.5} fill={TINTA} />
      <circle cx={x + 2} cy={y - 3.5} r={2.3} fill="#FFFFFF" />
    </g>
  );
};

const Boca = ({tipo, x}) => {
  const p = {stroke: TINTA, strokeWidth: 5.5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'};
  switch (tipo) {
    case 'aberta':
      return <path d={`M ${x - 17} 22 Q ${x} 50 ${x + 17} 22 Z`} {...p} fill="#7A2E2E" />;
    case 'triste':
      return <path d={`M ${x - 14} 34 Q ${x} 22 ${x + 14} 34`} {...p} />;
    case 'reta':
      return <path d={`M ${x - 11} 29 L ${x + 11} 28`} {...p} />;
    case 'o':
      return <ellipse cx={x} cy={30} rx={7} ry={9} {...p} fill="#7A2E2E" />;
    case 'preocupada':
      return <path d={`M ${x - 15} 31 Q ${x - 7} 25 ${x} 30 Q ${x + 7} 35 ${x + 15} 28`} {...p} />;
    default:
      return <path d={`M ${x - 15} 22 Q ${x} 38 ${x + 15} 22`} {...p} />;
  }
};

// Cabelo preto com franja picotada e um redemoinho em gancho no topo (a marca do personagem).
const Cabelo = ({frame}) => {
  const b = ondula(frame, 7) * 2; // o redemoinho balança de leve
  return (
    <path
      d={`M -64 6 C -76 -48 -34 -86 4 -78
          C ${10 + b} -98 ${32 + b} -112 ${44 + b} -100 C ${50 + b} -92 ${38 + b} -84 ${28 + b} -88 C ${30 + b} -84 30 -80 26 -77
          C 56 -74 78 -44 66 6
          L 58 -26 L 46 -20 L 36 -40 L 22 -24 L 8 -44 L -6 -26 L -20 -44 L -32 -24 L -44 -40 L -56 -18 Z`}
      fill={TINTA}
      stroke={TINTA}
      strokeWidth={6}
      strokeLinejoin="round"
    />
  );
};

const Roupa = ({roupa, id}) => {
  const contorno = {stroke: TINTA, strokeWidth: 6, strokeLinejoin: 'round'};
  const corpo = 'M -31 -114 Q 0 -122 31 -114 L 35 -60 L 32 4 Q 0 11 -32 4 L -35 -60 Z';
  if (roupa.tipo === 'xadrez') {
    return (
      <g>
        <defs>
          <pattern id={`xadrez-${id}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill={roupa.cor} />
            <rect x="0" y="9" width="24" height="6" fill={roupa.sombra} opacity="0.85" />
            <rect x="9" y="0" width="6" height="24" fill={roupa.sombra} opacity="0.85" />
            <path d="M 0 12 L 24 12 M 12 0 L 12 24" stroke={roupa.linha} strokeWidth="1.6" />
          </pattern>
        </defs>
        <path d={corpo} fill={`url(#xadrez-${id})`} {...contorno} />
        <path d="M -12 -116 L 0 -98 L 12 -116" fill="none" {...contorno} strokeWidth={4.5} />
        {[-80, -56, -32].map((y) => <circle key={y} cx={0} cy={y} r={3} fill={TINTA} />)}
      </g>
    );
  }
  if (roupa.tipo === 'jaqueta') {
    return (
      <g>
        <path d={corpo} fill={roupa.cor} {...contorno} />
        <path d="M -10 -118 L 10 -118 L 9 6 L -9 6 Z" fill="#ECE5D5" stroke={TINTA} strokeWidth={4} />
        <path d="M -10 -116 L -22 -96 L -12 -92 M 10 -116 L 22 -96 L 12 -92" fill="none" {...contorno} strokeWidth={4} />
        <path d="M -27 -44 L -16 -44 M 16 -44 L 27 -44" stroke={TINTA} strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  }
  // moletom com capuz caído, bolso canguru e cordões
  return (
    <g>
      <path d="M -30 -110 Q 0 -142 30 -110 Z" fill={roupa.sombra} {...contorno} />
      <path d={corpo} fill={roupa.cor} {...contorno} />
      <path d="M -23 -40 L 23 -40 L 27 -12 L -27 -12 Z" fill={roupa.sombra} stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -8 -112 L -10 -84 M 8 -112 L 10 -84" stroke={TINTA} strokeWidth={3.5} strokeLinecap="round" />
    </g>
  );
};

// Fone de ouvido no pescoço (acessório opcional).
const Fone = () => (
  <g>
    <path d="M -34 -6 Q 0 26 34 -6" fill="none" stroke={TINTA} strokeWidth={7} strokeLinecap="round" />
    <rect x={-44} y={-16} width={18} height={26} rx={7} fill="#2B2F4A" stroke={TINTA} strokeWidth={4} />
    <rect x={26} y={-16} width={18} height={26} rx={7} fill="#2B2F4A" stroke={TINTA} strokeWidth={4} />
  </g>
);

// Só a cabeça (folhas de expressão, closes).
export const CabecaPersonagem = ({rosto, frame = 20, olhar = 0.2, olharY = 0}) => {
  const lx = olhar * 8;
  const ly = olharY * 6;
  const piscar = (frame % 104) < 4;
  return (
    <g>
      <circle r={62} fill={PELE} stroke={TINTA} strokeWidth={7} />
      <path d="M -60 4 Q -70 8 -62 20" fill="none" stroke={TINTA} strokeWidth={5} strokeLinecap="round" />
      <Cabelo frame={frame} />
      {rosto.sobr !== 0 && rosto.sobr !== undefined && (
        <g stroke={TINTA} strokeWidth={6} strokeLinecap="round">
          <path d={`M ${lx - 32} ${-24 - rosto.sobr * 4} L ${lx - 12} ${-21 + rosto.sobr * 5}`} />
          <path d={`M ${lx + 12} ${-21 + rosto.sobr * 5} L ${lx + 32} ${-24 - rosto.sobr * 4}`} />
        </g>
      )}
      <Olho x={lx - 20} y={-2 + ly} tipo={rosto.olhos} piscar={piscar && rosto.olhos !== 'fechados'} />
      <Olho x={lx + 20} y={-2 + ly} tipo={rosto.olhos} piscar={piscar && rosto.olhos !== 'fechados'} />
      <Boca tipo={rosto.boca} x={lx * 0.8} />
      {rosto.suor > 0 && (
        <path d="M 60 -34 Q 70 -16 64 -8 Q 56 -2 52 -12 Q 52 -22 60 -34 Z" fill="#7FC8F0" stroke={TINTA} strokeWidth={3} opacity={rosto.suor} transform={`translate(0 ${(frame % 30) * 0.6 * rosto.suor})`} />
      )}
    </g>
  );
};

export const Personagem = ({pose, frame, escala = 1, roupa = ROUPAS.moletom, glow = null, id = 'p'}) => {
  const r = calcularRig(pose);
  const respira = Math.sin(frame * 0.07) * 1.6;
  const traco = {stroke: TINTA, strokeWidth: 10, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'};
  const linha = (pts, st = traco) => <path d={`M ${pts.map((p) => p.join(' ')).join(' L ')}`} {...st} />;
  const manga = (b, cor) => (
    <g>
      {linha([r.ombro, b.cot], {...traco, strokeWidth: 26})}
      {linha([r.ombro, b.cot], {...traco, stroke: cor, strokeWidth: 16})}
      {linha([b.cot, b.mao])}
      <circle cx={b.mao[0]} cy={b.mao[1]} r={8} fill={TINTA} />
    </g>
  );
  const perna = (l) => (
    <g>
      {linha([r.quadril, l.joelho, l.pe])}
      <path d={`M ${l.pe[0] - 8} ${l.pe[1] - 2} Q ${l.pe[0] + 8} ${l.pe[1] - 16} ${l.pe[0] + 28} ${l.pe[1] - 2} Z`} fill={TINTA} stroke={TINTA} strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
  const ro = pose.rosto;
  const microCab = ondula(frame, 3) * 1.5;

  return (
    <g transform={`translate(${pose.x} 0) scale(${pose.dir * escala} ${escala})`}>
      {glow && <defs><Glow id={`glow-${id}`} cor={glow} /></defs>}
      <ellipse cx={0} cy={6} rx={70 - (pose.y || 0) * 0.2} ry={10} fill="#000" opacity={0.28} />
      <g filter={glow ? `url(#glow-${id})` : undefined}>
        {perna(r.lE)}
        {manga(r.bE, roupa.sombra)}
        {perna(r.lD)}
        {linha([r.pescoco, r.cabeca], {...traco, strokeWidth: 12})}
        <g transform={`translate(${r.quadril[0]} ${r.quadril[1] + respira * 0.3}) rotate(${r.inc})`}>
          <Roupa roupa={roupa} id={id} />
        </g>
        {roupa.fone && (
          <g transform={`translate(${r.pescoco[0]} ${r.pescoco[1] - 2}) rotate(${r.inc}) scale(0.8)`}>
            <Fone />
          </g>
        )}
        <g transform={`translate(${r.cabeca[0]} ${r.cabeca[1] + respira * 0.5 - (CABECA - 1) * 62}) rotate(${r.angCab * 0.5 + microCab}) scale(${CABECA})`}>
          <CabecaPersonagem rosto={ro} frame={frame} olhar={pose.olhar} olharY={pose.olharY} />
        </g>
        {manga(r.bD, roupa.cor)}
      </g>
    </g>
  );
};
