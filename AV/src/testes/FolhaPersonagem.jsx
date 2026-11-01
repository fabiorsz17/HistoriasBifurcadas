import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONTE_TXT} from '../motor/base.js';
import {POSE_BASE} from '../motor/Boneco.jsx';
import {CabecaPersonagem, Personagem, ROUPAS} from '../motor/Personagem.jsx';

// Folha de proposta do personagem: 3 roupas sobre o mesmo corpo e 6 expressões. Para aprovação do usuário.

const PISO = 600;
const VARIANTES = [
  {x: 400, roupa: ROUPAS.moletom, nome: 'A · moletom mostarda', pose: {bracoD: {o: 40, c: 45}, olhar: 0.4}},
  {x: 960, roupa: ROUPAS.xadrez, nome: 'B · camisa xadrez', pose: {dir: -1, bracoD: {o: 18, c: 28}, cabeca: 6, olhar: 0.5, rosto: {olhos: 'felizes', boca: 'sorriso', sobr: 0, suor: 0}}},
  {x: 1520, roupa: ROUPAS.jaqueta, nome: 'C · jaqueta + fone', pose: {inclina: -4, bracoD: {o: 115, c: 35}, olhar: 0.3, rosto: {olhos: 'abertos', boca: 'aberta', sobr: -0.6, suor: 0}}},
];
const EXPRESSOES = [
  ['neutro', {olhos: 'abertos', boca: 'sorriso', sobr: 0}],
  ['feliz', {olhos: 'felizes', boca: 'aberta', sobr: 0}],
  ['tranquilo', {olhos: 'fechados', boca: 'sorriso', sobr: 0}],
  ['surpreso', {olhos: 'arregalados', boca: 'o', sobr: -1.4}],
  ['preocupado', {olhos: 'abertos', boca: 'preocupada', sobr: -0.8, suor: 0.9}],
  ['bravo', {olhos: 'abertos', boca: 'reta', sobr: 1.2}],
];

const Rotulo = ({x, y, children, tam = 30}) => (
  <div style={{position: 'absolute', left: x - 300, top: y, width: 600, textAlign: 'center', fontFamily: FONTE_TXT, fontSize: tam, fontWeight: 700, color: '#DCE6F2'}}>
    {children}
  </div>
);

export const FolhaPersonagem = () => {
  const frame = useCurrentFrame() + 20; // fora do piscar
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #24375E 0%, #121B30 70%)'}}>
      {/* piso em grade, só para dar chão à folha */}
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {Array.from({length: 25}, (_, i) => (
          <line key={`v${i}`} x1={960 + (i - 12) * 40} y1={PISO - 20} x2={960 + (i - 12) * 160} y2={720} stroke="#3B6BD6" strokeOpacity={0.25} strokeWidth={2} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line key={`h${i}`} x1={0} y1={PISO - 20 + i * i * 9 + i * 12} x2={1920} y2={PISO - 20 + i * i * 9 + i * 12} stroke="#3B6BD6" strokeOpacity={0.25} strokeWidth={2} />
        ))}
        <rect y={724} width={1920} height={356} fill="#0E1526" />
        {VARIANTES.map((v, i) => (
          <g key={v.nome} transform={`translate(0 ${PISO})`}>
            <Personagem pose={{...POSE_BASE, x: v.x, ...v.pose, rosto: {...POSE_BASE.rosto, ...(v.pose.rosto || {})}}} frame={frame} escala={0.92} roupa={v.roupa} glow="#8FE3FF" id={`v${i}`} />
          </g>
        ))}
        {EXPRESSOES.map(([nome, rosto], i) => (
          <g key={nome} transform={`translate(${260 + i * 280} 860) scale(0.85)`}>
            <CabecaPersonagem rosto={rosto} frame={frame} olhar={0} />
          </g>
        ))}
      </svg>
      <Rotulo x={960} y={24} tam={38}>Personagem do canal · proposta 1</Rotulo>
      {VARIANTES.map((v) => <Rotulo key={v.nome} x={v.x} y={PISO + 26}>{v.nome}</Rotulo>)}
      {EXPRESSOES.map(([nome], i) => <Rotulo key={nome} x={260 + i * 280} y={960} tam={26}>{nome}</Rotulo>)}
    </AbsoluteFill>
  );
};
