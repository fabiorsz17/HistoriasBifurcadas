import React from 'react';
import {COR, FONTE_TXT} from './base.js';

// Sincronia por palavra: marca('Parabéns!') devolve o quadro em que a palavra começa (2ª ocorrência: marca('vinte', 2)).
// A busca ignora maiúsculas e pontuação: conferir a ocorrência de palavras comuns ("Ela" casou antes com "ela", no B02).
// Amarrar a animação às palavras, e não a quadros fixos, faz tudo se reajustar se a voz for regerada.
export const criarMarcador = (palavras, fps = 30) => (texto, ocorrencia = 1) => {
  let n = 0;
  const alvo = texto.toLowerCase();
  for (const w of palavras) {
    if (w.text.toLowerCase().replace(/[.,:;!?…]+$/u, '') === alvo.replace(/[.,:;!?…]+$/u, '') && ++n === ocorrencia) {
      return Math.round((w.startMs / 1000) * fps);
    }
  }
  throw new Error(`Palavra não encontrada na narração: "${texto}" (${ocorrencia}ª)`);
};

const agrupar = (palavras, max = 5) => {
  const out = [];
  let atual = [];
  palavras.forEach((w, i) => {
    atual.push(w);
    if (/[.,?!:…]$/u.test(w.text) || atual.length >= max || i === palavras.length - 1) {
      out.push(atual);
      atual = [];
    }
  });
  return out;
};

// Legenda palavra a palavra (a palavra falada fica em âmbar).
// Shorts: bottom ~560 (acima da interface do app), tam 64 e max 3 palavras por vez.
export const Legenda = ({palavras, frame, fps = 30, bottom = 54, tam = 50, max = 5}) => {
  const frases = React.useMemo(() => agrupar(palavras, max), [palavras, max]);
  const ms = (frame / fps) * 1000;
  const frase = frases.find((fr, i) => {
    const prox = frases[i + 1];
    return ms >= fr[0].startMs - 80 && ms < (prox ? prox[0].startMs - 80 : fr[fr.length - 1].endMs + 600);
  });
  if (!frase) return null;
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        width: '100%',
        padding: '0 60px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontFamily: FONTE_TXT,
        fontWeight: 700,
        fontSize: tam,
        color: COR.giz,
        textShadow: '0 4px 0 #0E1113, 0 0 18px rgba(0,0,0,0.7)',
        WebkitTextStroke: '8px #0E1113',
        paintOrder: 'stroke fill',
      }}
    >
      {frase.map((w, i) => {
        const ativa = ms >= w.startMs - 40 && ms < w.endMs + 120;
        return (
          <span key={i} style={{color: ativa ? COR.ambar : COR.giz, marginRight: 14, display: 'inline-block', transform: `translateY(${ativa ? -4 : 0}px)`}}>
            {w.text.toLowerCase()}
          </span>
        );
      })}
    </div>
  );
};
