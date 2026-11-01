import React from 'react';
import {FONTE_TXT, salto, tw} from './base.js';
import {COR_A, COR_B} from './TelaEscolha.jsx';
import {TINTA} from './Personagem.jsx';

// Mapa da árvore (FMT-005): V1 no alto, dois caminhos, quatro finais. Ensina a dinâmica do canal.
// Cada parte entra num quadro próprio (quadros relativos ao início do mapa); o que não for passado já aparece pronto.
// aceso: nó em destaque ("You are here"); destravados: finais já vistos.

const NOS = {
  V1: {x: 960, y: 230, rotulo: 'START'},
  V2A: {x: 620, y: 470, rotulo: 'A', cor: COR_A},
  V2B: {x: 1300, y: 470, rotulo: 'B', cor: COR_B},
  FA1: {x: 440, y: 730, rotulo: '?', cor: COR_A},
  FA2: {x: 800, y: 730, rotulo: '?', cor: COR_A},
  FB1: {x: 1120, y: 730, rotulo: '?', cor: COR_B},
  FB2: {x: 1480, y: 730, rotulo: '?', cor: COR_B},
};
const ARESTAS = [['V1', 'V2A', 'ramos'], ['V1', 'V2B', 'ramos'], ['V2A', 'FA1', 'finais'], ['V2A', 'FA2', 'finais'], ['V2B', 'FB1', 'finais'], ['V2B', 'FB2', 'finais']];

const Linha = ({a, b, p, cor}) => {
  const A = NOS[a];
  const B = NOS[b];
  const x = A.x + (B.x - A.x) * p;
  const y = A.y + (B.y - A.y) * p;
  return p <= 0 ? null : <path d={`M ${A.x} ${A.y} L ${x} ${y}`} stroke={cor || '#C9CEDB'} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 22" />;
};

const No = ({id, p, aceso, destravado, brilho, frame}) => {
  const n = NOS[id];
  if (p <= 0.01) return null;
  const final = id.startsWith('F');
  const r = final ? 58 : id === 'V1' ? 78 : 68;
  const pulso = aceso ? 1 + Math.sin(frame * 0.2) * 0.06 : 1;
  return (
    <g transform={`translate(${n.x} ${n.y}) scale(${p * pulso})`}>
      {(aceso || brilho > 0) && <circle r={r + 26} fill={n.cor || '#FFFFFF'} opacity={0.25 + 0.25 * Math.max(brilho, aceso ? 1 : 0)} />}
      <circle r={r} fill={final && !destravado ? '#2A2F45' : n.cor || '#F2EFE6'} stroke={TINTA} strokeWidth={8} />
      {final && !destravado ? (
        // cadeado: final ainda não visto
        <g transform="translate(0 6)">
          <path d="M -16 -8 L -16 -22 Q -16 -38 0 -38 Q 16 -38 16 -22 L 16 -8" fill="none" stroke="#C9CEDB" strokeWidth={7} />
          <rect x={-24} y={-10} width={48} height={36} rx={6} fill="#C9CEDB" />
        </g>
      ) : (
        <text y={id === 'V1' ? 12 : 18} textAnchor="middle" fontFamily={FONTE_TXT} fontWeight={800} fontSize={id === 'V1' ? 34 : 54} fill={id === 'V1' ? TINTA : '#FFFFFF'}>
          {n.rotulo}
        </text>
      )}
    </g>
  );
};

// t: quadros de entrada de cada parte, relativos ao início do mapa. Ex.: {v1: 0, ramos: 20, finais: 60, travas: 90}.
// brilhoFinais: 0..1 faz os quatro finais pulsarem juntos ("only one tells the whole truth").
export const MapaArvore = ({frame, t = {}, aceso = null, destravados = [], brilhoFinais = 0, rotuloAqui = true}) => {
  const ent = (k, dur = 12) => (t[k] === undefined ? 1 : tw(frame, t[k], t[k] + dur, 0, 1, salto));
  const linha = (k) => (t[k] === undefined ? 1 : tw(frame, t[k], t[k] + 18, 0, 1));
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
      {ARESTAS.map(([a, b, k]) => (
        <Linha key={a + b} a={a} b={b} p={linha(k)} cor={NOS[b].cor} />
      ))}
      <No id="V1" p={ent('v1')} aceso={aceso === 'V1'} frame={frame} />
      {['V2A', 'V2B'].map((id) => (
        <No key={id} id={id} p={ent('ramos')} aceso={aceso === id} frame={frame} />
      ))}
      {['FA1', 'FA2', 'FB1', 'FB2'].map((id, i) => (
        <No key={id} id={id} p={t.finais === undefined ? 1 : tw(frame, t.finais + i * 4, t.finais + i * 4 + 12, 0, 1, salto)} aceso={aceso === id} destravado={destravados.includes(id)} brilho={brilhoFinais * (0.5 + 0.5 * Math.sin(frame * 0.25 + i * 1.6))} frame={frame} />
      ))}
      {aceso && rotuloAqui && (
        <text x={NOS[aceso].x} y={NOS[aceso].y - 110} textAnchor="middle" fontFamily={FONTE_TXT} fontWeight={800} fontSize={34} fill="#FFFFFF" opacity={ent('aqui', 10)}>
          YOU ARE HERE
        </text>
      )}
    </svg>
  );
};
