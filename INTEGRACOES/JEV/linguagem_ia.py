"""Filtro de "linguagem de IA" (DECISOES FMT-006): detecta texto com cara de gerado por máquina, do roteiro à publicação.

Duas camadas:
  1. REGRAS: marcas conhecidas de texto de IA em português (clichês, conectores formais, construções típicas). Código puro, custo zero.
  2. JEV: perguntas fechadas sobre cada trecho (soa humano? é genérico? tem "não é só X, é Y"? registro de redação?).
Um trecho é sinalizado se cair numa regra forte OU se o JEV o julgar artificial acima do limite.

Uso:
  python INTEGRACOES/JEV/linguagem_ia.py blocos HISTORIAS/H01_x            # narração de todos os vídeos da história (ou de um só: HISTORIAS/H01_x/V1)
  python INTEGRACOES/JEV/linguagem_ia.py texto "Seu texto aqui"                       # título, descrição, comentário...
  python INTEGRACOES/JEV/linguagem_ia.py publicacao HISTORIAS/H01_x/V1     # títulos e descrição do PUBLICACAO.md
Saída dos modos de pasta: <pasta>/LINGUAGEM_IA.md
"""

import json
import os
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from jev import avaliar  # noqa: E402

# Idioma do canal: inglês americano (LANG-001). HB_IDIOMA=pt volta às regras em português.
IDIOMA = os.environ.get("HB_IDIOMA", "en")

# ---------- Camada 1: regras ----------
# (padrão, motivo, peso) — peso 2 = sinal forte por si só; 1 = só conta se aparecer junto com outros
REGRAS_PT = [
    (r"\bno mundo (de hoje|atual|moderno)\b", "abertura-clichê de IA", 2),
    (r"\b(vale (a pena )?(ressaltar|destacar|lembrar)|é importante (ressaltar|destacar|lembrar|notar))\b", "conector de redação escolar", 2),
    (r"\b(em suma|em resumo|em síntese|por fim, mas não menos importante|em última análise)\b", "fecho formal de redação", 2),
    (r"\b(mergulh(ar|e|ando|aremos)|desvend(ar|e|ando)|explorar(emos)?|navegar pelo|jornada (financeira|rumo))\b", "metáfora típica de IA", 2),
    (r"\b(crucial|fundamental|essencial) (para|que)\b", "ênfase genérica", 1),
    (r"\bnão (é|se trata) (apenas|só|somente) [^.!?]{2,40}[,;:—-] (é|mas|e sim)\b", "construção 'não é só X, é Y'", 2),
    (r"\b(potencializ|alavanc|otimiz|maximiz)\w*", "jargão corporativo", 1),
    (r"\b(descubra|desbloqueie|transforme sua vida|segredo que ninguém)\b", "frase de propaganda", 2),
    (r"\b(além disso|ademais|outrossim|dessa forma|nesse sentido|diante disso)\b", "conector formal (pouco oral)", 1),
    (r"\b(seja (você|ele|ela) [^,]+, seja)\b", "paralelismo artificial", 1),
    (r"—", "travessão (comum em texto de IA; na fala, prefira vírgula)", 1),
    (r"[\U0001F300-\U0001FAFF]", "emoji", 1),
]

REGRAS_EN = [
    (r"\bdelv(e|es|ed|ing)\b", "verbo típico de IA ('delve')", 2),
    (r"\b(tapestry|testament to|a symphony of|intricate dance)\b", "metáfora típica de IA", 2),
    (r"\bin today'?s (fast-paced |digital |modern |ever-changing )?world\b", "abertura-clichê de IA", 2),
    (r"\b(it'?s|this is|that'?s) not (just|only|merely) [^.!?]{2,40}[,;:—-] (it'?s|but|this is)\b", "construção 'it's not just X, it's Y'", 2),
    (r"\bnavigat(e|ing) the (complexities|landscape|world|challenges) of\b", "metáfora típica de IA", 2),
    (r"\b(a chill ran down|time seemed to (stop|stand still)|a breath (i|he|she|they) didn'?t know|heart pounding in (my|his|her) chest|little did (i|he|she|they) know)\b", "clichê de ficção gerada", 2),
    (r"\b(unlock|unleash|elevate|harness|game-?changer|ever-evolving|realm|seamless(ly)?|embark(ed|ing)? on)\b", "palavra de propaganda ou de IA", 1),
    (r"\b(furthermore|moreover|additionally|in conclusion|in summary|ultimately|it'?s worth noting|it'?s important to note)\b", "conector de redação (pouco oral)", 1),
    (r"—", "travessão (comum em texto de IA; na fala, prefira vírgula ou ponto)", 1),
    (r"[\U0001F300-\U0001FAFF]", "emoji", 1),
]


def checar_regras(texto, idioma=None):
    idioma = idioma or IDIOMA
    achados = []
    for padrao, motivo, peso in (REGRAS_EN if idioma == "en" else REGRAS_PT):
        for m in re.finditer(padrao, texto, flags=re.IGNORECASE):
            achados.append({"trecho": m.group(0), "motivo": motivo, "peso": peso})
    # tríades em série ("X, Y e Z" / "X, Y, and Z") repetidas são um tique: 3+ no mesmo texto
    triades = re.findall(r"\b\w+, \w+,? (?:e|and) \w+\b", texto)
    if len(triades) >= 3:
        achados.append({"trecho": "; ".join(triades[:3]), "motivo": "muitas listas de três (ritmo artificial)", "peso": 1})
    return achados


# ---------- Camada 2: JEV ----------
PERGUNTAS_PT = {
    "humano": {
        "type": "score",
        "instructions": "Este texto em português do Brasil soa como uma pessoa real falando ou escrevendo, ou como texto gerado por inteligência artificial?",
        "criteria": [
            "Soa claramente gerado por IA: genérico, polido demais, frases-feitas, ritmo uniforme",
            "Misto: em geral natural, mas com alguns trechos de cara artificial",
            "Soa como uma pessoa real: concreto, com o jeito de falar brasileiro, frases de tamanhos variados",
        ],
    },
    "generico": {
        "type": "noul",
        "instructions": "O texto é genérico, isto é, poderia estar em qualquer vídeo ou post sobre o assunto, sem detalhes concretos?",
    },
    "nao_so_x": {
        "type": "noul",
        "instructions": "O texto usa a construção 'não é só X, é Y' ou 'não se trata apenas de X, mas de Y'?",
    },
    "redacao": {
        "type": "noul",
        "instructions": "O texto tem tom de redação formal ou relatório (conectores como 'além disso', 'vale ressaltar', 'em suma'), em vez de fala do dia a dia?",
    },
    "exagero": {
        "type": "noul",
        "instructions": "O texto usa entusiasmo ou adjetivos exagerados e vazios (incrível, poderoso, transformador, revolucionário)?",
    },
}
PERGUNTAS_EN = {
    "humano": {
        "type": "score",
        "instructions": "Does this American English text sound like a real person talking, or like text generated by artificial intelligence?",
        "criteria": [
            "Clearly AI-generated: generic, over-polished, stock phrases, uniform rhythm",
            "Mixed: mostly natural, with a few artificial-sounding parts",
            "Sounds like a real American telling a story: concrete details, contractions, natural rhythm, varied sentence length",
        ],
    },
    "generico": {
        "type": "noul",
        "instructions": "Is this text generic, meaning it could appear in any video about the topic, with no concrete details?",
    },
    "nao_so_x": {
        "type": "noul",
        "instructions": "Does the text use the construction 'it's not just X, it's Y' or 'this isn't about X, it's about Y'?",
    },
    "redacao": {
        "type": "noul",
        "instructions": "Does the text sound like a formal essay or report (connectors like 'moreover', 'furthermore', 'in conclusion') instead of everyday speech?",
    },
    "exagero": {
        "type": "noul",
        "instructions": "Does the text use empty hype or inflated adjectives (incredible, powerful, transformative, life-changing)?",
    },
}
LIMITE_HUMANO = 0.75  # nota normalizada mínima (score / 2)
LIMITE_SIM = 0.5


def analisar(texto, contexto="", idioma=None):
    idioma = idioma or IDIOMA
    regras = checar_regras(texto, idioma)
    estado = {"texto": texto, "contexto": contexto} if contexto else texto
    r = avaliar(estado, PERGUNTAS_EN if idioma == "en" else PERGUNTAS_PT)
    a = r["answers"]
    humano = a["humano"]["score"] / 2
    motivos_jev = [k for k in ("generico", "nao_so_x", "redacao", "exagero") if a[k]["noul"] > LIMITE_SIM]
    # Título e CTA são curtos e diretos por natureza: o JEV os acha "genéricos" mesmo quando soam humanos (calibrado no EP01).
    # Para eles vale a nota "humano" e as demais perguntas.
    if any(p in contexto for p in ("título", "chamada")):
        motivos_jev = [k for k in motivos_jev if k != "generico"]
    forte = any(x["peso"] >= 2 for x in regras) or sum(x["peso"] for x in regras) >= 3
    sinalizado = forte or humano < LIMITE_HUMANO or bool(motivos_jev)
    return {
        "sinalizado": sinalizado,
        "humano": round(humano, 2),
        "jev": {k: round(a[k]["noul"], 2) for k in ("generico", "nao_so_x", "redacao", "exagero")},
        "motivos_jev": motivos_jev,
        "regras": regras,
        "tokens": r["usage"]["input_tokens"],
    }


def _linha(nome, res):
    marca = "⚠️" if res["sinalizado"] else "✅"
    extra = []
    if res["regras"]:
        extra.append("regras: " + "; ".join(f"“{x['trecho']}” ({x['motivo']})" for x in res["regras"]))
    if res["motivos_jev"]:
        extra.append("JEV: " + ", ".join(f"{k} {res['jev'][k]}" for k in res["motivos_jev"]))
    return f"| {marca} {nome} | {res['humano']:.2f} | {' · '.join(extra) or '—'} |"


def relatorio(pasta, titulo, itens):
    L = [f"# Filtro de linguagem de IA — {titulo}", "", "Humano = nota do JEV (0 a 1; abaixo de 0,75 sinaliza). Regras = marcas conhecidas de texto de IA.", ""]
    L += ["| Trecho | Humano | Sinais |", "|---|---|---|"]
    tokens = 0
    sinal = 0
    for nome, res in itens:
        L.append(_linha(nome, res))
        tokens += res["tokens"]
        sinal += res["sinalizado"]
    L += ["", f"{sinal} de {len(itens)} trechos sinalizados · {tokens} tokens de entrada (US$ {tokens * 42e-9:.5f})."]
    Path(pasta, "LINGUAGEM_IA.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    return sinal


CONTEXTO_NARRACAO = "narração falada de uma história animada com escolhas para o espectador"


def pastas_de_video(pasta):
    """Aceita a pasta de um vídeo (com blocos.json) ou a de uma história inteira (um blocos.json por nó: V1, V2A...)."""
    pasta = Path(pasta)
    if (pasta / "blocos.json").exists():
        return [pasta]
    return sorted(p.parent for p in pasta.glob("*/blocos.json"))


def modo_blocos(pasta):
    ctx = lambda b: "chamada para escolha falada no fim do vídeo" if b["id"] in ("ESCOLHA", "CTA") else CONTEXTO_NARRACAO
    itens = []
    for video in pastas_de_video(pasta):
        blocos = json.loads(Path(video, "blocos.json").read_text(encoding="utf-8"))["blocos"]
        itens += [(f"{video.name} {b['id']}", analisar(b["narracao"], ctx(b))) for b in blocos]
    return itens


def modo_publicacao(pasta):
    md = Path(pasta, "PUBLICACAO.md").read_text(encoding="utf-8")
    titulos = re.findall(r"^\d\. (.+)$", md.split("## Descrição")[0], flags=re.MULTILINE)
    desc = md.split("## Descrição", 1)[1].split("Capítulos:", 1)[0].strip()
    itens = [(f"Título {i + 1}: {t}", analisar(t, "título de vídeo do YouTube")) for i, t in enumerate(titulos)]
    itens.append(("Descrição", analisar(desc, "descrição de vídeo do YouTube")))
    return itens


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    modo, alvo = sys.argv[1], sys.argv[2]
    if modo == "texto":
        print(json.dumps(analisar(alvo), ensure_ascii=False, indent=2))
    else:
        itens = modo_blocos(alvo) if modo == "blocos" else modo_publicacao(alvo)
        if modo == "blocos" and Path(alvo, "PUBLICACAO.md").exists():
            itens += modo_publicacao(alvo)
        n = relatorio(alvo, Path(alvo).name, itens)
        for nome, res in itens:
            print(_linha(nome, res))
        print(f"{n} sinalizado(s).")
