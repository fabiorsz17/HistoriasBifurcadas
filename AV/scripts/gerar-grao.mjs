// Gera public/grao.png: textura de ruído 2304x1440 (tons de cinza) usada como grão de giz.
// Vertical (Shorts): node scripts/gerar-grao.mjs 1440 2304 grao-v.png
// Substitui um feTurbulence de alta frequência recalculado a cada quadro (render ~2x mais rápido).
import {writeFileSync} from 'node:fs';
import {deflateSync} from 'node:zlib';

const W = Number(process.argv[2] || 2304);
const H = Number(process.argv[3] || 1440);
const ARQ = process.argv[4] || 'grao.png';
let semente = 1234567;
const aleatorio = () => ((semente = (semente * 1103515245 + 12345) % 2147483648) / 2147483648);

const linhas = Buffer.alloc((W + 1) * H);
for (let y = 0; y < H; y++) {
  linhas[y * (W + 1)] = 0;
  for (let x = 0; x < W; x++) linhas[y * (W + 1) + 1 + x] = Math.floor(aleatorio() * 256);
}

const crcTabela = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc = (buf) => {
  let c = -1;
  for (const b of buf) c = crcTabela[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const bloco = (tipo, dados) => {
  const tam = Buffer.alloc(4);
  tam.writeUInt32BE(dados.length);
  const td = Buffer.concat([Buffer.from(tipo), dados]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(td));
  return Buffer.concat([tam, td, c]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bits
ihdr[9] = 0; // tons de cinza
writeFileSync(
  new URL('../public/' + ARQ, import.meta.url),
  Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    bloco('IHDR', ihdr),
    bloco('IDAT', deflateSync(linhas)),
    bloco('IEND', Buffer.alloc(0)),
  ]),
);
console.log('public/' + ARQ + ' gerado');

