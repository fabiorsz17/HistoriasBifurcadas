"""Converte o alinhamento por caractere da ElevenLabs em tempos por palavra, sem as audio tags.

Uso: python INTEGRACOES/ELEVENLABS/palavras.py <arquivo.alinhamento.json> [saida.json]
Saída: [{"text": "Seu", "startMs": 0, "endMs": 210}, ...], o mesmo formato do captions.json do piloto.
"""

import json
import sys
from pathlib import Path


def palavras(caminho):
    a = json.loads(Path(caminho).read_text(encoding="utf-8-sig"))
    chars, ini, fim = a["characters"], a["character_start_times_seconds"], a["character_end_times_seconds"]
    out, atual, dentro_tag = [], None, False
    for c, s, e in zip(chars, ini, fim):
        if c == "[":
            dentro_tag = True
            continue
        if dentro_tag:
            dentro_tag = c != "]"
            continue
        if c.isspace():
            if atual:
                out.append(atual)
            atual = None
            continue
        if atual is None:
            atual = {"text": c, "startMs": round(s * 1000), "endMs": round(e * 1000)}
        else:
            atual["text"] += c
            atual["endMs"] = round(e * 1000)
    if atual:
        out.append(atual)
    return out


if __name__ == "__main__":
    lista = palavras(sys.argv[1])
    if len(sys.argv) > 2:
        Path(sys.argv[2]).write_text(json.dumps({"words": lista}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(" ".join(f"{w['text']}@{w['startMs'] / 1000:.2f}" for w in lista))
