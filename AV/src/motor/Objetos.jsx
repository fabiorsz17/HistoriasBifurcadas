import React from 'react';
import {FONTE_TXT} from './base.js';
import {TINTA} from './Personagem.jsx';

// Objetos e cenários no mesmo traço de tinta do personagem: contorno escuro grosso, cores chapadas, sombra simples.
// Tudo em coordenadas de mundo 1920x1080, chão em y = CHAO, para usar dentro de <Camada>.

export const CHAO = 860;
const C = {stroke: TINTA, strokeWidth: 6, strokeLinejoin: 'round', strokeLinecap: 'round'};

// ---------- cenário: posto de gasolina 24 horas, à meia-noite ----------
export const CeuNoite = ({frame = 0}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
    <defs>
      <linearGradient id="ceuNoite" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0B1124" />
        <stop offset="0.7" stopColor="#1E2440" />
        <stop offset="1" stopColor="#3A3358" />
      </linearGradient>
    </defs>
    <rect x={-1600} y={-900} width={5120} height={2880} fill="url(#ceuNoite)" />
    {Array.from({length: 60}, (_, i) => (
      <circle key={i} cx={-1400 + ((i * 263) % 4700)} cy={-500 + ((i * 131) % 1100)} r={1.4 + (i % 3) * 0.7} fill="#FFFFFF" opacity={0.25 + 0.2 * Math.sin(frame * 0.06 + i)} />
    ))}
    <circle cx={1650} cy={140} r={46} fill="#F4EBC9" opacity={0.9} />
  </svg>
);

// Prédios ao longe (plano de fundo, para o parallax).
export const Cidade = () => (
  <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
    {Array.from({length: 22}, (_, i) => {
      const x = -1400 + i * 230;
      const h = 220 + ((i * 97) % 260);
      return (
        <g key={i}>
          <rect x={x} y={CHAO - 40 - h} width={190} height={h + 40} fill="#232845" />
          {Array.from({length: 8}, (_, j) => (
            <rect key={j} x={x + 20 + (j % 4) * 42} y={CHAO - h + Math.floor(j / 4) * 60 + 10} width={18} height={26} fill="#F6D58A" opacity={(i + j) % 3 === 0 ? 0.55 : 0.08} />
          ))}
        </g>
      );
    })}
  </svg>
);

export const Posto = ({frame = 0}) => {
  const pisca = 0.85 + 0.15 * Math.sin(frame * 0.9) * (Math.sin(frame * 0.05) > 0.9 ? 1 : 0); // lâmpada falhando de vez em quando
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
      {/* asfalto e meio-fio */}
      <rect x={-1600} y={CHAO} width={5120} height={900} fill="#24242E" />
      <rect x={-1600} y={CHAO + 30} width={5120} height={24} fill="#3A3A48" stroke={TINTA} strokeWidth={5} />
      {/* luz da cobertura no chão */}
      <ellipse cx={900} cy={CHAO + 60} rx={1000} ry={90} fill="#FFF2C2" opacity={0.10 * pisca} />
      {/* cobertura do posto */}
      <path d="M -200 280 L 2000 280 L 2000 330 L -200 330 Z" fill="#D9473E" {...C} />
      <rect x={-200} y={330} width={2200} height={16} fill="#F2EFE6" stroke={TINTA} strokeWidth={5} />
      {[180, 1700].map((x) => (
        <rect key={x} x={x - 22} y={346} width={44} height={CHAO - 346} fill="#B9B6AE" {...C} />
      ))}
      {[300, 700, 1100, 1500].map((x) => (
        <rect key={x} x={x - 70} y={344} width={140} height={12} fill="#FFF6D8" opacity={pisca} />
      ))}
      {/* bombas */}
      {[1500, 1820].map((x) => (
        <g key={x}>
          <rect x={x - 46} y={CHAO - 210} width={92} height={210} rx={10} fill="#E9E3D3" {...C} />
          <rect x={x - 32} y={CHAO - 190} width={64} height={44} rx={4} fill="#2B3A55" stroke={TINTA} strokeWidth={4} />
          <path d={`M ${x + 46} ${CHAO - 120} q 40 10 30 70`} fill="none" stroke={TINTA} strokeWidth={8} />
        </g>
      ))}
      {/* placa 24 horas */}
      <g transform="translate(-60 120)">
        <rect x={-90} y={0} width={180} height={110} rx={12} fill="#F2EFE6" {...C} />
        <text x={0} y={72} textAnchor="middle" fontFamily={FONTE_TXT} fontWeight={800} fontSize={56} fill="#D9473E">24/7</text>
      </g>
    </svg>
  );
};

// ---------- carro sedã de lado (frente para a direita), sem adesivo de aplicativo ----------
// x = centro do carro; abertura 0..1 levanta a tampa do porta-malas.
export const Carro = ({x = 760, cor = '#3F6C8E', abertura = 0, conteudo = null}) => {
  const ang = 72 * abertura;
  return (
    <g transform={`translate(${x} ${CHAO})`}>
      <ellipse cx={0} cy={4} rx={340} ry={16} fill="#000" opacity={0.35} />
      {/* conteúdo do porta-malas (aparece por trás da tampa aberta) */}
      {conteudo && <g transform="translate(-238 -122) scale(0.55)">{conteudo}</g>}
      <path d="M -320 -60 Q -322 -120 -280 -130 L -150 -140 L -90 -215 Q -70 -235 -30 -235 L 120 -235 Q 160 -235 190 -205 L 250 -140 L 300 -128 Q 330 -120 330 -80 L 330 -45 Q 330 -30 310 -30 L -300 -30 Q -320 -30 -320 -60 Z" fill={cor} {...C} />
      <path d="M -75 -205 Q -62 -222 -36 -222 L 40 -222 L 40 -145 L -128 -145 Z" fill="#9CC3DA" stroke={TINTA} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 56 -222 L 118 -222 Q 150 -222 172 -198 L 222 -145 L 56 -145 Z" fill="#9CC3DA" stroke={TINTA} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 52 -140 L 52 -40 M -130 -140 L -130 -40" stroke={TINTA} strokeWidth={4} />
      <rect x={304} y={-112} width={24} height={16} rx={4} fill="#FFF3B0" stroke={TINTA} strokeWidth={4} />
      <rect x={-322} y={-110} width={18} height={18} rx={4} fill="#E2504A" stroke={TINTA} strokeWidth={4} />
      {/* tampa do porta-malas, articulada na base do vidro traseiro */}
      <g transform={`translate(-150 -140) rotate(${ang})`}>
        <path d="M 0 0 L -130 10 Q -170 14 -172 50 L -170 72 L -150 72 L -146 30 Q -140 22 -120 20 L 0 12 Z" fill={cor} {...C} />
      </g>
      {[-200, 200].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={-30} r={52} fill="#1C1C22" {...C} />
          <circle cx={cx} cy={-30} r={22} fill="#9A9AA6" stroke={TINTA} strokeWidth={5} />
        </g>
      ))}
    </g>
  );
};

// ---------- bolsa preta e o dinheiro ----------
// Maço de notas com a cinta carimbada "BM" (pista P3). Cédula desenhada por nós: sem rosto, sem país.
export const Maco = ({x = 0, y = 0, esc = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${esc})`}>
    <rect x={-70} y={-26} width={140} height={52} rx={6} fill="#9CC79A" {...C} strokeWidth={5} />
    <path d="M -58 -14 L 58 -14 M -58 14 L 58 14" stroke="#5E8A5C" strokeWidth={3} />
    <rect x={-18} y={-28} width={36} height={56} fill="#F2EAD3" stroke={TINTA} strokeWidth={4} />
    <text x={0} y={7} textAnchor="middle" fontFamily={FONTE_TXT} fontWeight={800} fontSize={18} fill="#B03A33">BM</text>
  </g>
);

// costura: 0..1 destaca a costura nova e torta do forro (pista P2).
export const Bolsa = ({aberta = 0, costura = 0, esc = 1}) => (
  <g transform={`scale(${esc})`}>
    <path d="M -150 0 Q -160 -90 -110 -96 L 110 -96 Q 160 -90 150 0 Q 150 20 130 20 L -130 20 Q -150 20 -150 0 Z" fill="#26262C" {...C} />
    {aberta > 0 && (
      <g opacity={Math.min(1, aberta * 1.5)}>
        <path d="M -118 -92 Q 0 -150 118 -92" fill="#15151A" stroke={TINTA} strokeWidth={5} />
        <Maco x={-60} y={-104} esc={0.8} rot={-8} />
        <Maco x={30} y={-112} esc={0.8} rot={6} />
        <Maco x={-10} y={-130} esc={0.8} rot={-2} />
      </g>
    )}
    <path d="M -100 -96 Q -90 -150 0 -150 Q 90 -150 100 -96" fill="none" stroke={TINTA} strokeWidth={10} />
    <path d="M -128 -40 L 128 -40" stroke="#4A4A55" strokeWidth={4} strokeDasharray={costura > 0 ? undefined : '10 8'} />
    {costura > 0 && (
      // a costura torta, em linha de outra cor
      <path d="M -120 -24 L -96 -18 L -70 -27 L -44 -16 L -18 -26 L 8 -15 L 36 -27 L 62 -17 L 90 -26 L 118 -18" fill="none" stroke="#E8C24A" strokeWidth={4 + costura * 2} opacity={costura} />
    )}
  </g>
);

// ---------- celular ----------
export const Celular = ({tela = 'chamada', vibra = 0, frame = 0, texto = 'Unknown number'}) => {
  const tremor = vibra * Math.sin(frame * 2.7) * 4;
  return (
    <g transform={`translate(${tremor} 0) rotate(${vibra * Math.sin(frame * 3.1) * 3})`}>
      <rect x={-48} y={-90} width={96} height={180} rx={16} fill="#1B1B22" {...C} />
      <rect x={-38} y={-74} width={76} height={148} rx={8} fill={tela === 'chamada' ? '#1F2A44' : '#F2EFE6'} />
      {tela === 'chamada' && (
        <g>
          <circle cx={0} cy={-26} r={18} fill="#F2EFE6" />
          <text x={0} y={16} textAnchor="middle" fontFamily={FONTE_TXT} fontWeight={700} fontSize={11} fill="#FFFFFF">{texto}</text>
          <circle cx={0} cy={48} r={13} fill="#3CC46B" opacity={0.7 + 0.3 * Math.sin(frame * 0.4)} stroke="#FFFFFF" strokeWidth={2} />
        </g>
      )}
      {tela === 'app' && (
        <g>
          <rect x={-30} y={-60} width={60} height={60} rx={14} fill="#2B3A55" />
          <path d="M -18 -22 L 18 -22 L 12 -38 L -12 -38 Z" fill="#F6D58A" />
          <text x={0} y={30} textAnchor="middle" fontFamily={FONTE_TXT} fontWeight={800} fontSize={14} fill={TINTA}>RIDE</text>
        </g>
      )}
    </g>
  );
};

// ---------- a galinha do banco de trás (piada do V1) ----------
export const Galinha = ({frame = 0}) => {
  const bico = Math.sin(frame * 0.5) > 0.6 ? 6 : 0;
  return (
    <g>
      <ellipse cx={0} cy={0} rx={56} ry={44} fill="#F7F1E3" {...C} />
      <circle cx={42} cy={-46} r={28} fill="#F7F1E3" {...C} />
      <path d="M 34 -76 q 6 -14 14 -2 q 6 -12 12 2" fill="#E2504A" stroke={TINTA} strokeWidth={4} />
      <path d={`M 68 -50 L ${88 + bico} -44 L 68 -38 Z`} fill="#F2B33D" stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={48} cy={-50} r={4} fill={TINTA} />
      <path d="M -20 -6 q -20 24 10 30" fill="none" stroke={TINTA} strokeWidth={5} />
      <path d="M -10 42 L -14 62 M 12 42 L 14 62" stroke="#F2B33D" strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

// Banco de trás visto de lado (cenário do flashback da galinha).
export const BancoTras = () => (
  <g>
    <rect x={-200} y={-40} width={400} height={70} rx={20} fill="#5A4A3E" {...C} />
    <rect x={-190} y={-210} width={70} height={190} rx={20} fill="#5A4A3E" {...C} />
    <rect x={-210} y={30} width={420} height={20} fill="#3A3028" stroke={TINTA} strokeWidth={5} />
  </g>
);
