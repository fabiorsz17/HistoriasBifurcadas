import React from 'react';
import {COR, ondula} from './base.js';

// Rig 2D articulado (cinemática direta), trazido do Zero a 100 Finanças:
// cabeça grande, corpo de traço único, gravata, pernas longas.
// Ângulos em graus. Membros: 0 = apontando para baixo, + = para frente (lado do rosto).
// Cotovelo/joelho são relativos ao segmento anterior.

export const POSE_BASE = {
  x: 0,
  y: 0, // deslocamento vertical extra (pulo)
  dir: 1, // 1 = olha para a direita, -1 = esquerda (interpolar gera um "giro")
  inclina: 0, // tronco, + = para frente
  curva: 0, // curvatura do tronco (postura cansada > 0)
  cabeca: 0, // inclinação da cabeça
  olhar: 0.3, // -1..1 horizontal
  olharY: 0, // -1..1 vertical
  bracoE: {o: -8, c: 20},
  bracoD: {o: 8, c: 20},
  pernaE: {q: -4, j: 2},
  pernaD: {q: 6, j: 2},
  passo: 0, // fase do ciclo de caminhada (em ciclos)
  amp: 0, // intensidade da caminhada 0..1
  agacha: 0, // 0..1 dobra os joelhos simetricamente
  travaD: 0, // 1 = braço da frente não balança ao andar (segurando algo)
  rosto: {olhos: 'abertos', boca: 'sorriso', sobr: 0, suor: 0},
};

const M = {coxa: 92, canela: 92, tronco: 128, pescoco: 14, cabeca: 60, braco: 74, antebraco: 68};

const rad = (g) => (g * Math.PI) / 180;
const dirV = (g) => [Math.sin(rad(g)), Math.cos(rad(g))];
const soma = (p, comp, g) => {
  const [dx, dy] = dirV(g);
  return [p[0] + dx * comp, p[1] + dy * comp];
};

export const calcularRig = (pose) => {
  const fase = pose.passo * Math.PI * 2;
  const a = pose.amp || 0;
  const ag = pose.agacha || 0;

  const perna = (p, faseP) => {
    const q = p.q + a * 26 * Math.sin(faseP) - ag * 38;
    const j = p.j + a * 42 * Math.max(0, Math.cos(faseP)) + ag * 80;
    return {q, j};
  };
  const pE = perna(pose.pernaE, fase + Math.PI);
  const pD = perna(pose.pernaD, fase);

  const pe = (p) => {
    const joelho = soma([0, 0], M.coxa, p.q);
    return {joelho, pe: soma(joelho, M.canela, p.q - p.j)};
  };
  const lE = pe(pE);
  const lD = pe(pD);
  // Ancoragem automática: o pé mais baixo toca o chão.
  const alturaQuadril = Math.max(lE.pe[1], lD.pe[1]);
  const quadril = [0, -alturaQuadril - (pose.y || 0)];
  const mover = (pt) => [pt[0] + quadril[0], pt[1] + quadril[1]];

  const inc = pose.inclina + a * 4;
  const pescoco = [
    quadril[0] + Math.sin(rad(inc)) * M.tronco,
    quadril[1] - Math.cos(rad(inc)) * M.tronco,
  ];
  const ombro = [
    quadril[0] + Math.sin(rad(inc)) * (M.tronco - 14),
    quadril[1] - Math.cos(rad(inc)) * (M.tronco - 14),
  ];
  const angCab = inc + pose.cabeca;
  const cabeca = [
    pescoco[0] + Math.sin(rad(angCab)) * (M.pescoco + M.cabeca),
    pescoco[1] - Math.cos(rad(angCab)) * (M.pescoco + M.cabeca),
  ];

  const braco = (b, sinal, trava = 0) => {
    const o = b.o + inc * 0.6 + sinal * a * 22 * Math.sin(fase) * (1 - trava);
    const cot = soma(ombro, M.braco, o);
    const mao = soma(cot, M.antebraco, o + b.c);
    return {cot, mao, ang: o + b.c};
  };

  return {
    quadril,
    pescoco,
    ombro,
    cabeca,
    angCab,
    inc,
    bE: braco(pose.bracoE, 1),
    bD: braco(pose.bracoD, -1, pose.travaD || 0),
    lE: {joelho: mover(lE.joelho), pe: mover(lE.pe), q: pE.q - pE.j},
    lD: {joelho: mover(lD.joelho), pe: mover(lD.pe), q: pD.q - pD.j},
  };
};

// Posição da mão em coordenadas do mundo (para objetos que saem da mão).
export const maoMundo = (pose, lado = 'D', chaoY = 860, escala = 1) => {
  const r = calcularRig(pose);
  const m = lado === 'D' ? r.bD.mao : r.bE.mao;
  return [pose.x + m[0] * pose.dir * escala, chaoY + m[1] * escala];
};

const Olho = ({x, y, tipo, piscar, cilios}) => {
  if (piscar || tipo === 'fechados')
    return <path d={`M ${x - 8} ${y} Q ${x} ${y + 5} ${x + 8} ${y}`} stroke={COR.giz} strokeWidth={5} fill="none" strokeLinecap="round" />;
  if (tipo === 'felizes')
    return <path d={`M ${x - 9} ${y + 3} Q ${x} ${y - 9} ${x + 9} ${y + 3}`} stroke={COR.giz} strokeWidth={5} fill="none" strokeLinecap="round" />;
  const r = tipo === 'arregalados' ? 9 : 6.5;
  return (
    <g>
      {tipo === 'arregalados' && <circle cx={x} cy={y} r={14} stroke={COR.giz} strokeWidth={3.5} fill="none" />}
      <circle cx={x} cy={y} r={r} fill={COR.giz} />
      {cilios && (
        <path d={`M ${x + 4} ${y - r - 1} L ${x + 9} ${y - r - 7} M ${x - 1} ${y - r - 2} L ${x + 1} ${y - r - 9}`} stroke={COR.giz} strokeWidth={3} strokeLinecap="round" />
      )}
    </g>
  );
};

const Boca = ({tipo, x}) => {
  const p = {stroke: COR.giz, strokeWidth: 5.5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'};
  switch (tipo) {
    case 'aberta':
      return <path d={`M ${x - 18} 20 Q ${x} 48 ${x + 18} 20 Z`} {...p} fill={COR.fundo} />;
    case 'triste':
      return <path d={`M ${x - 17} 32 Q ${x} 18 ${x + 17} 32`} {...p} />;
    case 'reta':
      return <path d={`M ${x - 14} 26 L ${x + 14} 25`} {...p} />;
    case 'o':
      return <ellipse cx={x} cy={28} rx={8} ry={10} {...p} />;
    case 'preocupada':
      return <path d={`M ${x - 18} 29 Q ${x - 9} 22 ${x} 28 Q ${x + 9} 34 ${x + 18} 26`} {...p} />;
    default:
      return <path d={`M ${x - 20} 18 Q ${x} 40 ${x + 20} 18`} {...p} />;
  }
};

// Visual provisório sobre o rig. O personagem oficial do canal ainda vai ser desenhado e aprovado pelo usuário;
// até lá, este visual serve só para testar câmera, poses e sincronia.
export const VISUAL_TESTE = {cabelo: 'espetado', roupa: 'camiseta', corRoupa: COR.ambar};

const Cabelo = ({tipo, t, cor = '#3A4148'}) => {
  if (tipo === 'chanel') {
    return (
      <path
        d="M -62 -4 C -66 -60 -14 -76 14 -62 C 40 -72 68 -50 62 -6 C 52 -30 34 -42 6 -38 C -22 -44 -48 -30 -62 -4 Z"
        fill={cor}
        stroke={COR.giz}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    );
  }
  if (tipo === 'espetado') {
    // mechas espetadas dos mestres 02 e 04
    return (
      <path
        d="M -57 -16 C -62 -48 -32 -66 -2 -62 L 6 -88 L 18 -63 L 32 -84 L 37 -58 L 56 -70 L 51 -44 C 58 -36 60 -26 58 -18 C 40 -36 10 -44 -20 -38 C -36 -34 -48 -28 -57 -16 Z"
        fill={cor}
        stroke={COR.giz}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    );
  }
  if (tipo === 'coque') {
    return (
      <g>
        <circle cx={-26} cy={-64} r={20} fill={cor} stroke={COR.giz} strokeWidth={6} />
        <path
          d="M -58 -6 C -64 -58 -10 -72 12 -60 C 34 -70 64 -50 58 -8 C 50 -36 32 -48 12 -42 C -10 -50 -46 -36 -58 -6 Z"
          fill={cor}
          stroke={COR.giz}
          strokeWidth={6}
          strokeLinejoin="round"
        />
      </g>
    );
  }
  if (tipo === 'longo') {
    // topo com risca, as mechas da frente caem por fora do rosto (a parte de trás fica em CabeloAtras)
    return (
      <path
        d="M -60 -2 C -64 -58 -12 -74 10 -60 C 32 -74 66 -52 60 -2 C 52 -34 32 -48 10 -42 C -12 -50 -48 -36 -60 -2 Z"
        fill="#3A4148"
        stroke={COR.giz}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    );
  }
  return (
    <g>
      <path
        d="M -57 -14 C -62 -56 -16 -80 28 -66 C 50 -58 62 -42 59 -24 C 46 -44 24 -50 2 -44 C -18 -42 -40 -32 -57 -14 Z"
        fill="#3A4148"
        stroke={COR.giz}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path d="M 4 -46 C 18 -70 44 -66 52 -48" {...t} strokeWidth={5} />
    </g>
  );
};

// Mechas laterais até o ombro, com movimento secundário: balançam com a respiração, a caminhada e os pulos.
const CabeloAtras = ({tipo, frame, pose}) => {
  if (tipo === 'chanel') {
    // corte reto na altura do queixo
    return <path d="M -66 -8 C -72 -70 72 -70 66 -8 L 70 34 Q 70 42 62 42 L 34 42 L 34 10 L -34 10 L -34 42 L -62 42 Q -70 42 -70 34 Z" fill="#3A4148" stroke={COR.giz} strokeWidth={6} strokeLinejoin="round" />;
  }
  if (tipo !== 'longo') return null;
  const b = Math.sin(frame * 0.11) * 3 + (pose.amp || 0) * Math.sin(pose.passo * Math.PI * 4) * 6 - Math.min(14, (pose.y || 0) * 0.25);
  return (
    <path
      d={`M -62 -6 C -70 -72 70 -72 62 -6 L ${70 + b} 62 C ${62 + b} 78 ${44 + b} 76 ${38 + b * 0.6} 62 L 34 18
          L -34 18 L ${-38 + b * 0.6} 62 C ${-44 + b} 76 ${-62 + b} 78 ${-70 + b} 62 Z`}
      fill="#3A4148"
      stroke={COR.giz}
      strokeWidth={6}
      strokeLinejoin="round"
    />
  );
};

export const Boneco = ({pose, frame, escala = 1, visual = VISUAL_TESTE, segurarD, segurarE, sementePiscar = 0}) => {
  const r = calcularRig(pose);
  const respira = Math.sin(frame * 0.07) * 1.6;
  const ciclo = (frame + sementePiscar * 37) % 104;
  const piscar = ciclo < 4;
  const t = {stroke: COR.giz, strokeWidth: 10, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'};
  const tFundo = {...t, stroke: COR.gizSuave};
  const linha = (pts, st = t) => (
    <path d={`M ${pts.map((p) => p.join(' ')).join(' L ')}`} {...st} />
  );
  const ro = pose.rosto;
  const lx = pose.olhar * 9;
  const ly = pose.olharY * 6;
  const microCab = ondula(frame, 3) * 1.5;

  // Tronco levemente curvo (bezier quadrática)
  const meio = [
    (r.quadril[0] + r.pescoco[0]) / 2 - pose.curva * 22 - respira * 0.3,
    (r.quadril[1] + r.pescoco[1]) / 2,
  ];

  const pe = (l, st) => (
    <g>
      {linha([l.joelho, l.pe], st)}
      <path d={`M ${l.pe[0] - 4} ${l.pe[1]} L ${l.pe[0] + 22} ${l.pe[1] + 1}`} {...st} strokeWidth={13} />
    </g>
  );

  return (
    <g transform={`translate(${pose.x} 0) scale(${pose.dir * escala} ${escala})`}>
      {/* sombra */}
      <ellipse cx={0} cy={6} rx={70 - (pose.y || 0) * 0.2} ry={10} fill="#000" opacity={0.25} />

      {/* membros de trás */}
      {linha([r.quadril, r.lE.joelho], tFundo)}
      {pe(r.lE, tFundo)}
      {linha([r.ombro, r.bE.cot, r.bE.mao], tFundo)}
      <circle cx={r.bE.mao[0]} cy={r.bE.mao[1]} r={8} fill={COR.fundo} stroke={COR.gizSuave} strokeWidth={6} />
      {segurarE && <g transform={`translate(${r.bE.mao[0]} ${r.bE.mao[1]})`}>{segurarE}</g>}

      {/* tronco */}
      <path d={`M ${r.quadril.join(' ')} Q ${meio.join(' ')} ${r.pescoco.join(' ')}`} {...t} />
      {visual.roupa === 'gravata' && (
        <g transform={`translate(${r.pescoco[0]} ${r.pescoco[1]}) rotate(${r.inc})`}>
          <path d="M -16 2 L 0 18 L 16 2" {...t} strokeWidth={6} />
          <path d="M -6 14 L 6 14 L 9 62 L 0 76 L -9 62 Z" fill={COR.verde} stroke={COR.giz} strokeWidth={4} strokeLinejoin="round" />
        </g>
      )}
      {visual.roupa === 'camiseta' && (
        <g transform={`translate(${r.quadril[0]} ${r.quadril[1]}) rotate(${r.inc})`}>
          {visual.bag && (
            // bag de entrega nas costas
            <g transform="translate(-40 -104)">
              <rect x={-30} y={0} width={44} height={56} rx={6} fill="#1E3A2C" stroke={COR.verde} strokeWidth={5} />
              <path d="M -24 16 L 8 16" stroke={COR.verde} strokeWidth={4} strokeLinecap="round" />
            </g>
          )}
          {/* camiseta com manguinha, como o tronco contornado do mestre 04 */}
          <path
            d="M -22 -114 Q 0 -104 22 -114 L 40 -98 L 31 -84 L 22 -90 L 25 -4 Q 0 2 -25 -4 L -22 -90 L -31 -84 L -40 -98 Z"
            fill="#3B2A2C"
            stroke={visual.corRoupa}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          {visual.cracha && (
            // crachá do primeiro emprego, com um leve balanço
            <g>
              <path d="M -12 -112 L 0 -74 L 12 -112" stroke={COR.ambar} strokeWidth={3.5} fill="none" strokeLinejoin="round" />
              <g transform={`translate(0 -74) rotate(${Math.sin(frame * 0.09) * 6 + (pose.amp || 0) * Math.sin(pose.passo * Math.PI * 4) * 10})`}>
                <rect x={-10} y={0} width={20} height={26} rx={3} fill={COR.fundo} stroke={COR.ambar} strokeWidth={3.5} />
                <path d="M -5 9 L 5 9 M -5 16 L 3 16" stroke={COR.ambar} strokeWidth={2.5} strokeLinecap="round" />
              </g>
            </g>
          )}
        </g>
      )}

      {/* perna da frente */}
      {linha([r.quadril, r.lD.joelho], t)}
      {pe(r.lD, t)}
      {visual.roupa === 'vestido' && (
        // vestido triangular, como o mestre 06 (desenhado por cima das pernas)
        <g transform={`translate(${r.quadril[0]} ${r.quadril[1]}) rotate(${r.inc})`}>
          <path d="M -14 -114 Q 0 -108 14 -114 L 50 44 Q 0 52 -50 44 Z" fill="#1E3140" stroke={visual.corRoupa} strokeWidth={6} strokeLinejoin="round" />
        </g>
      )}

      {/* cabeça */}
      <g
        transform={`translate(${r.cabeca[0]} ${r.cabeca[1] + respira * 0.5 - (visual.cabecaEsc ? (visual.cabecaEsc - 1) * M.cabeca : 0)}) rotate(${r.angCab * 0.5 + microCab}) scale(${visual.cabecaEsc || 1})`}
      >
        <CabeloAtras tipo={visual.cabelo} frame={frame} pose={pose} />
        <circle r={M.cabeca} {...t} fill={COR.fundo} />
        <Cabelo tipo={visual.cabelo} t={t} cor={visual.corCabelo} />
        <ellipse cx={-52} cy={4} rx={7} ry={12} {...t} strokeWidth={6} />
        {visual.cilios && <circle cx={-52} cy={20} r={4.5} fill={COR.ambar} />}
        {/* sobrancelhas */}
        {ro.sobr !== 0 && (
          <g>
            <path d={`M ${lx - 30} ${-26 - ro.sobr * 4} L ${lx - 10} ${-24 + ro.sobr * 5}`} {...t} strokeWidth={5} />
            <path d={`M ${lx + 10} ${-24 + ro.sobr * 5} L ${lx + 30} ${-26 - ro.sobr * 4}`} {...t} strokeWidth={5} />
          </g>
        )}
        <Olho x={lx - 18} y={-6 + ly} tipo={ro.olhos} piscar={piscar && ro.olhos !== 'fechados'} cilios={visual.cilios} />
        <Olho x={lx + 18} y={-6 + ly} tipo={ro.olhos} piscar={piscar && ro.olhos !== 'fechados'} cilios={visual.cilios} />
        {visual.oculos && (
          <g stroke={COR.giz} strokeWidth={3.5} fill="none">
            <circle cx={lx - 18} cy={-6 + ly} r={14} />
            <circle cx={lx + 18} cy={-6 + ly} r={14} />
            <path d={`M ${lx - 4} ${-8 + ly} Q ${lx} ${-12 + ly} ${lx + 4} ${-8 + ly}`} />
          </g>
        )}
        <Boca tipo={ro.boca} x={lx * 0.8} />
        {ro.suor > 0 && (
          <path
            d="M 62 -30 Q 72 -12 66 -4 Q 58 2 54 -8 Q 54 -18 62 -30 Z"
            fill={COR.azul}
            opacity={ro.suor}
            transform={`translate(0 ${(frame % 30) * 0.6 * ro.suor})`}
          />
        )}
      </g>

      {/* braço da frente */}
      {linha([r.ombro, r.bD.cot, r.bD.mao], t)}
      <circle cx={r.bD.mao[0]} cy={r.bD.mao[1]} r={8} fill={COR.fundo} stroke={COR.giz} strokeWidth={6} />
      {segurarD && <g transform={`translate(${r.bD.mao[0]} ${r.bD.mao[1]})`}>{segurarD}</g>}
    </g>
  );
};


