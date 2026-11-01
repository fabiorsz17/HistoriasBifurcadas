import {staticFile} from 'remotion';

// Banco de efeitos (public/efeitos/, Freesound CC0, nivelados em 31/10/2026: ~-22 dB no trecho mais forte, pico -3 dB;
// fundo -28 dB). Volume de partida nas cenas: 0,45 para acentos; 0,25 para fundo (chuva, coração), sempre multiplicado
// por NIVEL_EFEITOS. Fontes em LEIA.md.
export const ef = (nome) => staticFile(`efeitos/${nome}.mp3`);

// Nível geral dos efeitos em relação à voz: -5 dB (valor herdado do Zero a 100; ajustar de ouvido no piloto).
export const NIVEL_EFEITOS = 10 ** (-5 / 20);
