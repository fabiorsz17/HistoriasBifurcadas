import React from 'react';
import {Audio, interpolate} from 'remotion';
import {FONTE_TXT, salto, suave, tw} from './base.js';
import {Camada, Vinheta, naMao} from './Camera.jsx';
import {NIVEL_EFEITOS, ef} from './efeitos.js';
import {CABECA, CabecaPersonagem, PELE, ROUPAS, TINTA} from './Personagem.jsx';

// Tela de escolha (FMT-005): os últimos ~20 s de todo vídeo que bifurca.
// O personagem fica de costas no centro de uma bifurcação; o caminho A vai para a esquerda (azul), o B para a direita
// (laranja), cada um terminando numa moldura vazia onde entra o quadro de vídeo da tela final do YouTube.
// De tempos em tempos ele olha para um caminho, para o outro, e vira para o espectador com cara de "e aí?".

export const COR_A = '#4DA3FF';
export const COR_B = '#FF8A3D';

// Molduras no espaço 1920x1080 (a versão 1440p escala junto). Na tela final do YouTube,
// os dois elementos de vídeo são posicionados exatamente sobre estes retângulos.
export const MOLDURA_A = {x: 170, y: 140, w: 600, h: 338};
export const MOLDURA_B = {x: 1150, y: 140, w: 600, h: 338};

const CICLO = 180; // 6 s: olha A, olha B, vira para quem assiste, volta
const INTRO = 24;

// Estado da cabeça e dos braços num quadro do ciclo.
const atuacao = (f) => {
  if (f < INTRO) return {olhar: 0, virado: 0, ombros: 0};
  const c = (f - INTRO) % CICLO;
  const olhar = c < 50 ? tw(c, 0, 12, 0, -1) : c < 100 ? tw(c, 50, 64, -1, 1) : tw(c, 100, 110, 1, 0);
  const virado = c < 112 ? 0 : c < 168 ? tw(c, 112, 120, 0, 1, salto) : tw(c, 168, 176, 1, 0);
  const ombros = c < 126 ? 0 : tw(c, 126, 136, 0, 1, salto) * (1 - tw(c, 150, 162, 0, 1));
  return {olhar, virado, ombros};
};

// Personagem de costas: moletom com capuz caído, cabelo cobrindo a nuca, redemoinho no topo.
const PersonagemCostas = ({frame, olhar, virado, ombros, roupa = ROUPAS.moletom}) => {
  const balanco = Math.sin(frame * 0.05) * 2.5; // troca o peso de um pé para o outro
  const respira = Math.sin(frame * 0.07) * 1.6;
  const traco = {stroke: TINTA, strokeWidth: 10, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'};
  const mao = (lado) => [lado * (52 + ombros * 40), -186 - ombros * 50];
  const cotovelo = (lado) => [lado * (46 + ombros * 22), -246 - ombros * 10];
  const braco = (lado) => {
    const co = cotovelo(lado);
    const m = mao(lado);
    return (
      <g key={lado}>
        <path d={`M ${lado * 36} -302 L ${co[0]} ${co[1]}`} {...traco} strokeWidth={26} />
        <path d={`M ${lado * 36} -302 L ${co[0]} ${co[1]}`} {...traco} stroke={roupa.cor} strokeWidth={16} />
        <path d={`M ${co[0]} ${co[1]} L ${m[0]} ${m[1]}`} {...traco} />
        <circle cx={m[0]} cy={m[1]} r={8} fill={TINTA} />
      </g>
    );
  };
  // Virar a cabeça: achata no eixo x até quase sumir, troca a nuca pelo rosto e volta (truque clássico de desenho).
  const giro = Math.abs(Math.cos(virado * Math.PI));
  const mostraRosto = virado > 0.5;
  const yCabeca = -312 - 14 - 62 * CABECA + respira * 0.5;

  return (
    <g transform={`translate(${balanco} 0)`}>
      <ellipse cx={0} cy={6} rx={80} ry={12} fill="#000" opacity={0.3} />
      {[-1, 1].map((lado) => (
        <g key={lado}>
          <path d={`M ${lado * 15} -184 L ${lado * 18} -4`} {...traco} />
          <ellipse cx={lado * 20} cy={-4} rx={17} ry={9} fill={TINTA} />
        </g>
      ))}
      <path d="M 0 -312 L 0 -340" {...traco} strokeWidth={12} />
      <g transform={`translate(0 ${respira * 0.3})`}>
        <path d="M -38 -310 Q 0 -318 38 -310 L 40 -250 L 37 -178 Q 0 -172 -37 -178 L -40 -250 Z" fill={roupa.cor} stroke={TINTA} strokeWidth={6} strokeLinejoin="round" />
        {/* capuz caído nas costas */}
        <path d="M -32 -308 Q -36 -258 0 -250 Q 36 -258 32 -308 Q 0 -298 -32 -308 Z" fill={roupa.sombra} stroke={TINTA} strokeWidth={5} strokeLinejoin="round" />
      </g>
      {braco(-1)}
      {braco(1)}
      <g transform={`translate(${olhar * 10} ${yCabeca}) rotate(${olhar * 9 + (mostraRosto ? -6 : 0)}) scale(${CABECA * Math.max(0.08, giro)} ${CABECA})`}>
        {mostraRosto ? (
          <CabecaPersonagem rosto={{olhos: 'abertos', boca: 'reta', sobr: -0.9}} frame={frame} olhar={0} olharY={-0.2} />
        ) : (
          <g>
            <circle r={62} fill={PELE} stroke={TINTA} strokeWidth={7} />
            <path
              d="M -64 4 C -70 -52 -34 -84 0 -82 C 34 -84 70 -52 64 4 C 62 30 50 50 34 60 L 28 72 L 18 62 L 8 74 L 0 63 L -10 74 L -18 62 L -28 72 L -34 60 C -50 50 -62 30 -64 4 Z"
              fill={TINTA}
              stroke={TINTA}
              strokeWidth={6}
              strokeLinejoin="round"
            />
            <path d="M 2 -78 C 10 -98 32 -112 44 -100 C 50 -92 38 -84 28 -88 C 30 -84 30 -80 22 -76 Z" fill={TINTA} stroke={TINTA} strokeWidth={6} strokeLinejoin="round" />
            <ellipse cx={-64} cy={14} rx={8} ry={13} fill={PELE} stroke={TINTA} strokeWidth={5} />
            <ellipse cx={64} cy={14} rx={8} ry={13} fill={PELE} stroke={TINTA} strokeWidth={5} />
          </g>
        )}
      </g>
    </g>
  );
};

const Interrogacao = ({p}) =>
  p <= 0.01 ? null : (
    <g transform={`translate(96 -540) scale(${p})`} opacity={p}>
      <circle cx={0} cy={0} r={46} fill="#FFFFFF" stroke={TINTA} strokeWidth={6} />
      <circle cx={-44} cy={52} r={10} fill="#FFFFFF" stroke={TINTA} strokeWidth={5} />
      <circle cx={-62} cy={74} r={6} fill="#FFFFFF" stroke={TINTA} strokeWidth={4} />
      <text x={0} y={22} textAnchor="middle" fontFamily={FONTE_TXT} fontWeight={800} fontSize={66} fill={TINTA}>?</text>
    </g>
  );

const Cenario = ({frame}) => {
  const estrada = '#3A3150';
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
      <defs>
        <linearGradient id="ceuEscolha" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141C36" />
          <stop offset="0.55" stopColor="#3A2F5E" />
          <stop offset="1" stopColor="#B4607A" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-300} width={2720} height={1000} fill="url(#ceuEscolha)" />
      {Array.from({length: 40}, (_, i) => (
        <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 520} r={1.5 + (i % 3)} fill="#FFFFFF" opacity={0.25 + 0.25 * Math.sin(frame * 0.08 + i)} />
      ))}
      <path d="M -400 640 L 300 560 L 760 620 L 1180 560 L 1620 610 L 2320 560 L 2320 1400 L -400 1400 Z" fill="#231C33" />
      <rect x={-400} y={640} width={2720} height={800} fill="#1A1526" />
      {/* a bifurcação: um caminho só no chão que se abre em dois */}
      <path d="M 840 1080 C 860 900 900 820 940 760 L 980 760 C 1020 820 1060 900 1080 1080 Z" fill={estrada} />
      <path d="M 940 762 C 820 700 640 650 470 600 L 520 588 C 680 630 860 680 960 720 Z" fill={estrada} />
      <path d="M 980 762 C 1100 700 1280 650 1450 600 L 1400 588 C 1240 630 1060 680 960 720 Z" fill={estrada} />
      <path d="M 960 1070 C 960 900 960 820 960 770 M 948 752 C 800 690 650 645 500 600 M 972 752 C 1120 690 1270 645 1420 600" stroke="#F3E9C8" strokeOpacity={0.35} strokeWidth={4} strokeDasharray="22 26" fill="none" />
      {/* brilho de cada destino no horizonte */}
      <ellipse cx={490} cy={590} rx={180} ry={40} fill={COR_A} opacity={0.18 + 0.06 * Math.sin(frame * 0.1)} />
      <ellipse cx={1430} cy={590} rx={180} ry={40} fill={COR_B} opacity={0.18 + 0.06 * Math.sin(frame * 0.1 + 1.5)} />
    </svg>
  );
};

const Moldura = ({m, cor, letra, texto, p, pulso}) => (
  <div
    style={{
      position: 'absolute',
      left: m.x,
      top: m.y,
      width: m.w,
      height: m.h + 120,
      opacity: p,
      transform: `translateY(${(1 - p) * 30}px)`,
    }}
  >
    <div
      style={{
        width: m.w,
        height: m.h,
        boxSizing: 'border-box',
        borderRadius: 18,
        border: `6px solid ${cor}`,
        background: 'rgba(8, 10, 22, 0.55)',
        boxShadow: `0 0 ${30 + pulso * 25}px ${cor}`,
      }}
    />
    <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, justifyContent: 'center'}}>
      <div style={{width: 64, height: 64, borderRadius: 32, background: cor, color: '#FFFFFF', fontFamily: FONTE_TXT, fontWeight: 800, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `4px solid ${TINTA}`}}>
        {letra}
      </div>
      <div style={{fontFamily: FONTE_TXT, fontWeight: 700, fontSize: Math.min(40, 1500 / Math.max(1, texto.length)), color: '#FFFFFF', textShadow: '0 3px 0 #000, 0 0 14px rgba(0,0,0,0.8)'}}>
        {texto}
      </div>
    </div>
  </div>
);

// frame: quadro relativo ao início da tela de escolha.
export const TelaEscolha = ({frame, textoA, textoB, som = true}) => {
  const entra = tw(frame, 0, INTRO, 0, 1, suave);
  const {olhar, virado, ombros} = atuacao(frame);
  const zoom = interpolate(entra, [0, 1], [1.12, 1]);
  const cam = {x: 960, y: 560, z: zoom, rot: 0, ...{}};
  const mao = naMao(frame, 0.6);
  const camFinal = {...cam, x: cam.x + mao.x, y: cam.y + mao.y, rot: mao.rot};
  const c = frame < INTRO ? -1 : (frame - INTRO) % CICLO;
  const pergunta = c >= 120 && c < 166 ? tw(c, 120, 128, 0, 1, salto) * (1 - tw(c, 158, 166, 0, 1)) : 0;
  const pulso = (Math.sin(frame * 0.12) + 1) / 2;

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#141C36'}}>
      <Camada cam={camFinal} prof={0.5}><Cenario frame={frame} /></Camada>
      <Camada cam={camFinal} prof={1}>
        <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
          <g transform="translate(960 1040) scale(1)">
            <PersonagemCostas frame={frame} olhar={olhar} virado={virado} ombros={ombros} />
            <Interrogacao p={pergunta} />
          </g>
        </svg>
      </Camada>
      <Vinheta forca={0.45} />
      <Moldura m={MOLDURA_A} cor={COR_A} letra="A" texto={textoA} p={tw(frame, 10, 30, 0, 1)} pulso={olhar < -0.5 ? 1 : pulso * 0.4} />
      <Moldura m={MOLDURA_B} cor={COR_B} letra="B" texto={textoB} p={tw(frame, 16, 36, 0, 1)} pulso={olhar > 0.5 ? 1 : pulso * 0.4} />
      {som && <Audio src={ef('relogio_tique')} volume={0.18 * NIVEL_EFEITOS} loop />}
    </div>
  );
};
