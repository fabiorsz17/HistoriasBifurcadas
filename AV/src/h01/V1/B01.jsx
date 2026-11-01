import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FONTE_TXT, prepararChaves, poseEm, saida, salto, tw} from '../../motor/base.js';
import {POSE_BASE} from '../../motor/Boneco.jsx';
import {Camada, Vinheta, cameraEm, naMao, prepararCamera, somar, tremor} from '../../motor/Camera.jsx';
import {NIVEL_EFEITOS, ef} from '../../motor/efeitos.js';
import {Legenda, criarMarcador} from '../../motor/Legenda.jsx';
import {MapaArvore} from '../../motor/MapaArvore.jsx';
import {BancoTras, Bolsa, CHAO, Carro, Celular, CeuNoite, Cidade, Galinha, Posto} from '../../motor/Objetos.jsx';
import {CabecaPersonagem, Personagem, ROUPAS} from '../../motor/Personagem.jsx';
import dados from './B01.palavras.json';

// V1 B01 · gancho e "como funciona" (FMT-005).
// Cena 1: posto à meia-noite (bolsa no porta-malas, Kai no meio-fio, celular tocando). Cena 2: flashback da galinha.
// Cena 3: "rewind" e mapa da árvore; fecha num close da costura torta da bolsa (pista P2: "the little stuff matters").

const palavras = dados.words;
const M = criarMarcador(palavras);
export const DURACAO_B01 = Math.ceil((palavras[palavras.length - 1].endMs / 1000) * 30) + 24;

const X_CARRO = 700;
const X_KAI = 1250;
const BOLSA = [X_CARRO - 238, CHAO - 150]; // onde a bolsa fica dentro do porta-malas (mundo)

// Sentado no meio-fio: coxas para a frente (q 90) e canelas para baixo (j 90); o rig apoia o pé mais baixo no chão,
// então o quadril fica uma canela acima dos pés, na altura do meio-fio. Antebraços apoiados nos joelhos.
const KAI_SENTADO = {...POSE_BASE, x: X_KAI, dir: -1, inclina: 12, curva: 0.5, cabeca: 8, olhar: 0.6, olharY: 0.3,
  pernaE: {q: 84, j: 88}, pernaD: {q: 96, j: 96}, bracoE: {o: 38, c: 22}, bracoD: {o: 48, c: 14},
  rosto: {olhos: 'abertos', boca: 'reta', sobr: -0.4, suor: 0}};
const PE_NA_RUA = CHAO + 30 + 92 * 0.85; // topo do meio-fio + uma canela (na escala do Kai)

export const V1B01 = () => {
  const f = useCurrentFrame();

  // ---------- tempos (todos amarrados às palavras) ----------
  const tFlash = M('until');
  const tVolta = M('Long');
  const tRewind = M('rewind');
  const tMapa = M('This');
  const tOlhos = M('eyes');
  const tPista = M('little');

  const cena = f < tFlash ? 'posto' : f < tVolta ? 'flash' : f < tMapa ? 'posto2' : f < tOlhos ? 'mapa' : f < tPista ? 'olhos' : 'pista';

  // ---------- câmera do posto ----------
  const camPosto = cameraEm(f, prepararCamera([
    {f: 0, x: BOLSA[0] + 10, y: BOLSA[1] - 40, z: 2.7},
    {f: M('trunk') - 8, x: BOLSA[0] + 14, y: BOLSA[1] - 38, z: 2.6},
    {f: M('trunk') + 6, x: 640, y: 640, z: 1.45, ease: saida},
    {f: M('Cash') + 4, x: BOLSA[0] + 10, y: BOLSA[1] - 50, z: 2.5, ease: saida},
    {f: M('sitting'), x: BOLSA[0] + 30, y: BOLSA[1] - 50, z: 2.4},
    {f: M('sitting') + 20, x: 1120, y: 640, z: 1.3, ease: saida},
    {f: M('staring') + 10, x: 1160, y: 680, z: 1.5},
    {f: M('phone') + 6, x: 1090, y: 840, z: 2.6, ease: saida},
    {f: M('Kai') - 4, x: 1090, y: 840, z: 2.6},
    {f: M('Kai') + 10, x: 1230, y: 620, z: 1.45, ease: saida},
    {f: tFlash, x: 1240, y: 600, z: 1.6},
    {f: tVolta, x: 1240, y: 640, z: 1.5},
    {f: tRewind, x: 1250, y: 620, z: 1.7},
  ]));
  const cam = somar(camPosto, naMao(f, 0.8), tremor(f, M('Cash'), 12, 10));

  // ---------- atuação do Kai ----------
  const pose = poseEm(f, prepararChaves(KAI_SENTADO, [
    {f: 0, pose: {}},
    {f: M('Kai') - 6, pose: {}},
    {f: M('Kai') + 4, pose: {dir: 1, cabeca: 0, olhar: 0, olharY: 0, inclina: 6, bracoD: {o: 115, c: 35}, rosto: {olhos: 'abertos', boca: 'sorriso', sobr: 0}}, ease: salto},
    {f: M('rideshare'), pose: {bracoD: {o: 60, c: 70}}},
    {f: tVolta, pose: {bracoE: {o: -70, c: -60}, bracoD: {o: 70, c: -60}, cabeca: -6, rosto: {olhos: 'fechados', boca: 'reta', sobr: -0.6}}, ease: salto},
    {f: M('Okay'), pose: {bracoE: {o: 40, c: 60}, bracoD: {o: 115, c: 45}, cabeca: 0, rosto: {olhos: 'abertos', boca: 'aberta', sobr: -0.6}}, ease: salto},
    {f: tRewind, pose: {rosto: {olhos: 'felizes', boca: 'sorriso', sobr: 0}}},
  ]));
  const vibra = f >= M('staring') && f < M('Kai') ? 1 : 0;
  const pBolsa = tw(f, 0, 10, 0.4, 1);

  return (
    <AbsoluteFill style={{backgroundColor: '#0B1124', overflow: 'hidden'}}>
      {(cena === 'posto' || cena === 'posto2') && (
        <>
          <Camada cam={cam} prof={0.12}><CeuNoite frame={f} /></Camada>
          <Camada cam={cam} prof={0.4} desfoque={2}><Cidade /></Camada>
          <Camada cam={cam} prof={1}>
            <Posto frame={f} />
            <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
              <Carro x={X_CARRO} abertura={1} conteudo={<Bolsa aberta={pBolsa} costura={0} esc={0.9} />} />
              <g transform={`translate(1060 ${CHAO + 2}) rotate(-8) scale(0.32)`}>
                <Celular frame={f} vibra={vibra} tela="chamada" />
              </g>
              <g transform={`translate(0 ${PE_NA_RUA})`}>
                <Personagem pose={pose} frame={f} escala={0.85} roupa={ROUPAS.moletom} id="kai" />
              </g>
            </svg>
          </Camada>
          {/* ícone do app de corrida, fora da câmera */}
          {f >= M('rideshare') - 4 && f < tFlash && (
            <div style={{position: 'absolute', left: 1430, top: 230, transform: `scale(${tw(f, M('rideshare') - 4, M('rideshare') + 8, 0, 1.4, salto)})`}}>
              <svg width={200} height={260} viewBox="-100 -130 200 260"><Celular tela="app" frame={f} /></svg>
            </div>
          )}
        </>
      )}

      {cena === 'flash' && <Flashback f={f - tFlash} chicken={M('chicken') - tFlash} />}

      {cena === 'mapa' && (
        <CenaMapa f={f} t={{v1: tMapa, ramos: M('splits'), aqui: M('decide'), finais: M('every'), brilho: M('Only'), fimBrilho: M('truth') + 20}} />
      )}

      {cena === 'olhos' && (
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #2A3354 0%, #0B1124 75%)'}}>
          <svg width={1920} height={1080} style={{position: 'absolute'}}>
            <g transform={`translate(960 ${tw(f, tOlhos, tOlhos + 10, 1300, 560, saida)}) scale(3.2)`}>
              <CabecaPersonagem rosto={{olhos: 'arregalados', boca: 'reta', sobr: -1}} frame={f} olhar={0} olharY={-0.1} />
            </g>
          </svg>
        </AbsoluteFill>
      )}

      {cena === 'pista' && (
        // close na costura torta do forro (P2): "the little stuff matters"
        <AbsoluteFill style={{backgroundColor: '#14141A'}}>
          <svg width={1920} height={1080} style={{position: 'absolute'}}>
            <g transform={`translate(960 640) scale(${tw(f, tPista, DURACAO_B01, 5.2, 5.8)})`}>
              <Bolsa aberta={0} costura={tw(f, tPista + 6, tPista + 18, 0, 1)} />
            </g>
          </svg>
        </AbsoluteFill>
      )}

      {/* "rewind": linhas de VHS e o símbolo de voltar, logo antes do mapa */}
      {f >= tRewind && f < tMapa && <EfeitoRewind f={f - tRewind} dur={tMapa - tRewind} />}

      <Vinheta forca={cena === 'mapa' ? 0.35 : 0.5} />
      <Legenda palavras={palavras} frame={f} bottom={40} tam={46} />

      <Audio src={staticFile('h01/V1/B01.mp3')} />
      <Sequence from={M('trunk') - 6} durationInFrames={30}><Audio src={ef('woosh_suave')} volume={0.35 * NIVEL_EFEITOS} /></Sequence>
      <Sequence from={M('Cash') - 2} durationInFrames={30}><Audio src={ef('notas_contar')} volume={0.4 * NIVEL_EFEITOS} /></Sequence>
      <Sequence from={M('sitting') + 6} durationInFrames={30}><Audio src={ef('woosh_suave')} volume={0.3 * NIVEL_EFEITOS} /></Sequence>
      <Sequence from={M('staring')} durationInFrames={M('Kai') - M('staring')}><Audio src={ef('celular_vibrar')} volume={0.4 * NIVEL_EFEITOS} loop /></Sequence>
      <Sequence from={M('chicken') - 4} durationInFrames={30}><Audio src={ef('pop_boca')} volume={0.45 * NIVEL_EFEITOS} /></Sequence>
      <Sequence from={tRewind} durationInFrames={30}><Audio src={ef('whoosh')} volume={0.4 * NIVEL_EFEITOS} /></Sequence>
      {['This', 'splits', 'every'].map((p) => (
        <Sequence key={p} from={M(p)} durationInFrames={20}><Audio src={ef('pop_bolha')} volume={0.35 * NIVEL_EFEITOS} /></Sequence>
      ))}
      <Sequence from={M('Only')} durationInFrames={60}><Audio src={ef('magia_brilho')} volume={0.4 * NIVEL_EFEITOS} /></Sequence>
      <Sequence from={tPista} durationInFrames={40}><Audio src={ef('vidro_tique')} volume={0.4 * NIVEL_EFEITOS} /></Sequence>
    </AbsoluteFill>
  );
};

// Flashback do banco de trás com a galinha: quadro arredondado e tom quente, como lembrança.
const Flashback = ({f, chicken}) => {
  const p = tw(f, 0, 10, 0, 1, saida);
  const g = tw(f, chicken - 6, chicken + 4, 0, 1, salto);
  return (
    <AbsoluteFill style={{backgroundColor: '#0B1124'}}>
      <div style={{position: 'absolute', left: 260, top: 140, width: 1400, height: 760, borderRadius: 60, overflow: 'hidden', border: '10px solid #F2EFE6', transform: `scale(${0.9 + 0.1 * p})`, opacity: p, background: 'linear-gradient(#5B4A63, #3A2F45)', filter: 'sepia(0.35)'}}>
        <svg width={1400} height={760}>
          <g transform="translate(640 560) scale(1.4)"><BancoTras /></g>
          <g transform={`translate(720 ${470 - 20 * Math.abs(Math.sin(f * 0.3)) * g}) scale(${1.6 * g})`}><Galinha frame={f} /></g>
        </svg>
      </div>
      <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: FONTE_TXT, fontWeight: 800, fontSize: 40, color: '#F2EFE6', opacity: p}}>
        A FEW MONTHS EARLIER
      </div>
    </AbsoluteFill>
  );
};

const CenaMapa = ({f, t}) => {
  const z = tw(f, t.v1, t.fimBrilho + 60, 1.0, 1.08);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #253055 0%, #0B1124 75%)'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 45%'}}>
        <MapaArvore
          frame={f}
          t={{v1: t.v1, ramos: t.ramos, finais: t.finais, aqui: t.aqui}}
          aceso={f >= t.aqui ? 'V1' : null}
          brilhoFinais={tw(f, t.brilho, t.brilho + 10, 0, 1) * (1 - tw(f, t.fimBrilho, t.fimBrilho + 15, 0, 1))}
        />
      </div>
    </AbsoluteFill>
  );
};

const EfeitoRewind = ({f, dur}) => {
  const p = Math.min(1, f / 6) * (1 - Math.max(0, (f - dur + 6) / 6));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: p}}>
      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 6px)', transform: `translateY(${(f * 37) % 12}px)`}} />
      <div style={{position: 'absolute', inset: 0, background: 'rgba(40, 60, 120, 0.35)'}} />
      <div style={{position: 'absolute', left: 80, top: 60, fontFamily: FONTE_TXT, fontWeight: 800, fontSize: 70, color: '#FFFFFF', textShadow: '0 0 12px #000'}}>◀◀ REWIND</div>
    </AbsoluteFill>
  );
};
