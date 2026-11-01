"""Roteador de modelo e esforço: o JEV classifica a tarefa e devolve só categorias (sem texto livre).

Uso como hook UserPromptSubmit (lê o JSON do hook no stdin, imprime a recomendação para o Claude):
    python INTEGRACOES/JEV/roteador.py
Uso manual:
    python INTEGRACOES/JEV/roteador.py "texto da tarefa"

O Fable nunca é recomendado. Se o JEV falhar, cai numa heurística local (custo zero).
"""

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import jev  # noqa: E402

NIVEIS = {
    "mecanico": ("haiku", "low", "executor-leve", "Trabalho mecânico: renders, scripts prontos, copiar/mover arquivos, conferir saída, registrar checkpoint."),
    "padrao": ("sonnet", "medium", "executor-padrao", "Trabalho seguindo padrão já estabelecido: animar bloco, Shorts, ajustar caixas, editar blocos.json, edições localizadas."),
    "complexo": ("opus", "high", "executor-complexo", "Trabalho que exige raciocínio: história nova, árvore de escolhas, segredo e pistas, depuração difícil, sistema novo, decisão de arquitetura."),
}

PERGUNTA = {
    "nivel": {
        "type": "choice",
        "instructions": "Qual o nível de complexidade desta tarefa de um projeto de vídeo animado em código?",
        "criteria": {k: v[3] for k, v in NIVEIS.items()},
    }
}

PALAVRAS_COMPLEXO = r"\b(roteiro novo|hist[óo]ria nova|[áa]rvore|arquitetura|depur|bug dif|por que (?:n[ãa]o|est[áa])|planej|estrat[ée]gia|criar sistema|redesenh|investig)"
PALAVRAS_MECANICO = r"\b(render|renderiz|copi|mov(?:a|er)|liste|rode|execute|confira|registr|checkpoint)"


def heuristica(texto: str) -> str:
    t = texto.lower()
    if re.search(PALAVRAS_COMPLEXO, t) or len(t) > 1500:
        return "complexo"
    if re.search(PALAVRAS_MECANICO, t) and len(t) < 300:
        return "mecanico"
    return "padrao"


def classificar(texto: str) -> tuple[str, str]:
    try:
        resp = jev.avaliar(texto[:4000], PERGUNTA)
        nivel = resp["answers"]["nivel"]["choice"]
        if nivel in NIVEIS:
            return nivel, "JEV"
    except Exception as erro:  # sem rede, chave ausente, limite: segue pela heurística
        return heuristica(texto), f"heurística local (JEV indisponível: {str(erro)[:60]})"
    return heuristica(texto), "heurística local"


def recomendacao(texto: str) -> str:
    nivel, fonte = classificar(texto)
    modelo, esforco, agente, _ = NIVEIS[nivel]
    return (
        f"[Roteador de modelo — {fonte}] Nível: {nivel}. Modelo: {modelo}, esforço: {esforco}. "
        f"Se a tarefa tiver partes que um subagente faça bem, delegue-as com subagent_type \"{agente}\". "
        f"Se o nível pedir mais que o modelo desta sessão, avise o usuário em uma linha. Nunca usar Fable."
    )


if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(recomendacao(" ".join(sys.argv[1:])))
    else:
        try:
            prompt = json.loads(sys.stdin.read()).get("prompt", "")
        except Exception:
            prompt = ""
        # Mensagens curtas ("sim", "ok") herdam a tarefa em curso: não gastam chamada.
        if len(prompt.strip()) >= 25 and not prompt.lstrip().startswith("/"):
            print(recomendacao(prompt))
