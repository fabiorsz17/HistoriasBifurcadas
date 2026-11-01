"""Legenda oficial do YouTube (.srt, em inglês) a partir do alinhamento que a ElevenLabs devolve com cada bloco.

Cada bloco tem o próprio áudio, então o tempo de cada palavra é deslocado pelo início do bloco no vídeo final.
Enquanto a montagem não existe, os blocos são postos em sequência com um respiro entre eles (--respiro);
quando o vídeo final estiver montado, passe os inícios reais (--inicios B01=3.2,B02=48.0,...), em segundos.

Regras de legenda (padrão de legibilidade usado no YouTube):
  até 42 caracteres por linha e 2 linhas por legenda; de 1 a 6 segundos na tela;
  quebra preferencial em fim de frase e depois em vírgula.

Uso:
  python INTEGRACOES/ELEVENLABS/legendas_srt.py HISTORIAS/H01_A_MALA/V1 [--respiro 0.6] [--inicios B01=0,B02=41.3] [--saida arquivo.srt]
Saída padrão: <pasta do nó>/legenda-en.srt (só os blocos que já têm áudio gerado).
"""
import argparse
import json
from pathlib import Path

from palavras import palavras

MAX_LINHA = 42
MAX_LINHAS = 2
MAX_SEG = 6.0
MIN_SEG = 1.0


def _tempo(s):
    ms = int(round(s * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    seg, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{seg:02d},{ms:03d}"


def _linhas(texto):
    """Quebra o texto em linhas de até MAX_LINHA caracteres, sem cortar palavras.
    Cabendo em 2 linhas, corta no espaço mais perto do meio (linhas equilibradas leem melhor)."""
    if len(texto) <= MAX_LINHA:
        return [texto]
    espacos = [i for i, c in enumerate(texto) if c == " " and i <= MAX_LINHA and len(texto) - i - 1 <= MAX_LINHA]
    if espacos:
        i = min(espacos, key=lambda i: abs(i - len(texto) / 2))
        return [texto[:i], texto[i + 1:]]
    linhas, atual = [], ""
    for p in texto.split():
        if atual and len(atual) + 1 + len(p) > MAX_LINHA:
            linhas.append(atual)
            atual = p
        else:
            atual = f"{atual} {p}".strip()
    return linhas + ([atual] if atual else [])


def agrupar(lista):
    """Palavras com tempo absoluto -> legendas [(inicio, fim, texto)]."""
    legendas, grupo = [], []

    def fechar():
        if grupo:
            legendas.append([grupo[0]["ini"], grupo[-1]["fim"], " ".join(w["text"] for w in grupo)])
            grupo.clear()

    for w in lista:
        tentativa = " ".join(x["text"] for x in grupo + [w])
        if grupo and (len(_linhas(tentativa)) > MAX_LINHAS or w["fim"] - grupo[0]["ini"] > MAX_SEG):
            # Estourou: corta na última vírgula do grupo, se houver, para não deixar uma palavra órfã na próxima legenda.
            k = max((i for i, x in enumerate(grupo[:-1]) if x["text"].endswith((",", ',"'))), default=None)
            resto = grupo[k + 1:] if k is not None else []
            del grupo[len(grupo) - len(resto):]
            fechar()
            grupo.extend(resto)
        grupo.append(w)
        dur = grupo[-1]["fim"] - grupo[0]["ini"]
        if w["text"].endswith((".", "?", "!", '."', '?"', '!"')) and dur >= MIN_SEG:
            fechar()
        elif w["text"].endswith((",", ',"')) and len(" ".join(x["text"] for x in grupo)) > MAX_LINHA:
            fechar()
    fechar()
    # Legenda curta demais fica na tela até a próxima começar (no máximo MIN_SEG).
    for i, (ini, fim, _) in enumerate(legendas):
        limite = legendas[i + 1][0] - 0.05 if i + 1 < len(legendas) else ini + MIN_SEG
        if fim - ini < MIN_SEG:
            legendas[i][1] = min(ini + MIN_SEG, max(fim, limite))
    return legendas


def gerar(pasta, respiro=0.6, inicios=None):
    pasta = Path(pasta)
    blocos = json.loads((pasta / "blocos.json").read_text(encoding="utf-8"))["blocos"]
    todas, cursor = [], 0.0
    for b in blocos:
        alinh = pasta / "audio" / f"{b['id']}-v4.alinhamento.json"
        if not alinh.exists():
            continue
        ws = palavras(alinh)
        base = inicios.get(b["id"], cursor) if inicios else cursor
        todas += [{"text": w["text"], "ini": base + w["startMs"] / 1000, "fim": base + w["endMs"] / 1000} for w in ws]
        cursor = base + ws[-1]["endMs"] / 1000 + respiro
    legendas = agrupar(todas)
    corpo = "\n".join(
        f"{i}\n{_tempo(ini)} --> {_tempo(fim)}\n" + "\n".join(_linhas(txt)) + "\n" for i, (ini, fim, txt) in enumerate(legendas, 1)
    )
    return corpo, len(legendas)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("pasta")
    ap.add_argument("--respiro", type=float, default=0.6)
    ap.add_argument("--inicios", default="")
    ap.add_argument("--saida", default="")
    a = ap.parse_args()
    inicios = {k: float(v) for k, v in (x.split("=") for x in a.inicios.split(",") if x)} or None
    srt, n = gerar(a.pasta, a.respiro, inicios)
    saida = Path(a.saida or Path(a.pasta) / "legenda-en.srt")
    saida.write_text(srt, encoding="utf-8")
    print(f"{n} legendas em {saida}")
