"""Verificador de uma história em árvore (V1 → V2A/V2B → 4 finais), com o JEV como juiz de cada pergunta.

Garante o "tudo se encaixa": estrutura sem beco sem saída, continuidade entre os vídeos de cada caminho,
pistas plantadas que são retomadas, cada final revelando o seu pedaço do segredo e escolhas equilibradas.

Camadas:
  0. Estrutura (código, grátis): nós, pastas, pais e filhos, 4 finais, escolha com A e B, pistas apontando para nós reais.
  1. Cada vídeo: jev.REGUA_HISTORIA (público, anunciante, respeito RES-001, cultura americana, clareza, tensão) + jev.REGUA_GANCHO na abertura.
  2. Cada escolha: jev.REGUA_ESCOLHA no último bloco + as duas opções.
  3. Continuidade: o vídeo contra tudo o que veio antes no MESMO caminho (nomes, objetos, quem sabe o quê).
  4. Pistas: plantada onde diz que foi plantada; retomada em cada nó listado.
  5. Segredo: cada final mostra o pedaço que o arvore.json diz que ele revela.

Entradas: HISTORIAS/<id>/arvore.json e um blocos.json por nó (HISTORIAS/<id>/V1/blocos.json ...).
Formato do arvore.json: ver a skill `bifurcadas-arvore`.
Saídas: verificacao.resultado.json (respostas brutas) e VERIFICACAO.md (relatório com alertas).

Uso:
  python INTEGRACOES/JEV/verificar_arvore.py HISTORIAS/H01_x              # tudo (custa centavos)
  python INTEGRACOES/JEV/verificar_arvore.py HISTORIAS/H01_x estrutura    # só a camada 0, sem rede
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from jev import REGUA_ESCOLHA, REGUA_GANCHO, REGUA_HISTORIA, avaliar  # noqa: E402

# Ponto de partida, ainda sem calibração (LICOES: calibrar com texto bom × texto ruim de propósito).
LIMITE_SIM_RUIM = 0.30  # perguntas em que "sim" é ruim (anunciante, óbvia, contradiz)
LIMITE_SIM_BOM = 0.70  # perguntas em que "sim" é bom (situa, retoma, revela)
LIMITE_NOTA = 0.75  # nota normalizada (score / máximo)

SIM_RUIM = {"anunciante", "obvia", "contradiz", "ofensa", "estereotipo", "vilao_por_traco"}

CONTINUIDADE = {
    "contradiz": {
        "type": "noul",
        "instructions": "O trecho 'este_video' contradiz algum fato de 'historia_ate_aqui' (nomes, objetos, lugares, horários, o que cada personagem sabe ou já fez)?",
    }
}
PISTA_PLANTADA = {"aparece": {"type": "noul", "instructions": "A pista descrita em 'pista' aparece no 'texto', de forma que um espectador atento possa notá-la?"}}
PISTA_RETOMADA = {"retoma": {"type": "noul", "instructions": "O 'texto' retoma, usa ou explica a pista descrita em 'pista'?"}}
SEGREDO = {"revela": {"type": "noul", "instructions": "Ao fim do 'texto', o espectador fica sabendo o que está descrito em 'revela'?"}}


def carregar(pasta):
    pasta = Path(pasta)
    arvore = json.loads((pasta / "arvore.json").read_text(encoding="utf-8"))
    textos = {}
    for no in arvore["nos"]:
        arq = pasta / no / "blocos.json"
        if arq.exists():
            textos[no] = [b["narracao"] for b in json.loads(arq.read_text(encoding="utf-8"))["blocos"]]
    return arvore, textos


def estrutura(arvore, textos):
    """Camada 0: devolve a lista de problemas (vazia = estrutura ok)."""
    nos, erros = arvore["nos"], []
    raizes = [n for n, d in nos.items() if not d.get("pai")]
    if raizes != ["V1"]:
        erros.append(f"A raiz precisa ser só V1; raízes encontradas: {raizes}")
    finais = [n for n, d in nos.items() if not d.get("filhos")]
    if len(finais) != 4:
        erros.append(f"São esperados 4 finais; encontrados {len(finais)}: {finais}")
    for n, d in nos.items():
        if n not in textos:
            erros.append(f"{n}: falta {n}/blocos.json")
        for lado, filho in (d.get("filhos") or {}).items():
            if filho not in nos:
                erros.append(f"{n}: o filho {lado} aponta para {filho}, que não existe")
            elif nos[filho].get("pai") != n:
                erros.append(f"{filho}: o pai deveria ser {n}")
        if d.get("filhos"):
            esc = d.get("escolha") or {}
            if not (esc.get("pergunta") and esc.get("A") and esc.get("B")) or set(d["filhos"]) != {"A", "B"}:
                erros.append(f"{n}: bifurca, então precisa de filhos A e B e de escolha com pergunta, A e B")
        elif not d.get("revela"):
            erros.append(f"{n}: é final, então precisa dizer em 'revela' que pedaço do segredo mostra")
    for p in arvore.get("pistas", []):
        for alvo in [p.get("plantada_em"), *p.get("retomada_em", [])]:
            if alvo not in nos:
                erros.append(f"Pista {p.get('id')}: aponta para o nó {alvo}, que não existe")
    return erros


def caminho_ate(arvore, no):
    """Nós anteriores no mesmo caminho, da raiz até o pai."""
    antes, atual = [], arvore["nos"][no].get("pai")
    while atual:
        antes.insert(0, atual)
        atual = arvore["nos"][atual].get("pai")
    return antes


def nota(r):
    return r["score"] / (len(r["legend"]) - 1)


def alertas_de(nome, resp, bons=()):
    out = []
    for k, r in resp["answers"].items():
        if r["type"] == "noul":
            ruim = r["noul"] > LIMITE_SIM_RUIM if k in SIM_RUIM else (k in bons and r["noul"] < LIMITE_SIM_BOM)
            if ruim:
                out.append(f"{nome} · {k}: sim={r['noul']:.2f}")
        elif r["type"] == "score" and nota(r) < LIMITE_NOTA:
            out.append(f"{nome} · {k}: nota {nota(r):.2f}")
        elif r["type"] == "choice" and k == "publico" and r["choice"] == "criancas":
            out.append(f"{nome} · público lido como CRIANÇAS (risco de 'conteúdo para crianças': perde tela final e cards)")
    return out


def verificar(pasta):
    arvore, textos = carregar(pasta)
    bruto, alertas, tokens = {}, [], 0

    def perguntar(chave, estado, perguntas, bons=()):
        nonlocal tokens
        r = avaliar(estado, perguntas)
        bruto[chave] = r
        tokens += r["usage"]["input_tokens"]
        alertas.extend(alertas_de(chave, r, bons))

    for no, blocos in textos.items():
        d = arvore["nos"][no]
        inteiro = "\n\n".join(blocos)
        perguntar(f"{no} história", inteiro, REGUA_HISTORIA, bons=("cultura_americana",))
        perguntar(f"{no} abertura", blocos[0], REGUA_GANCHO, bons=("situa",))
        if d.get("filhos"):
            esc = d["escolha"]
            # O bloco ESCOLHA sozinho é só a fórmula do canal: o dilema está no bloco narrativo anterior.
            perguntar(f"{no} escolha", {"fim_do_video": "\n\n".join(blocos[-2:]), "pergunta": esc["pergunta"], "opcao_A": esc["A"], "opcao_B": esc["B"]}, REGUA_ESCOLHA)
        antes = caminho_ate(arvore, no)
        if antes:
            historia = "\n\n".join(t for n in antes for t in textos.get(n, []))
            perguntar(f"{no} continuidade", {"premissa": arvore.get("premissa", ""), "historia_ate_aqui": historia, "este_video": inteiro}, CONTINUIDADE)
        if not d.get("filhos"):
            perguntar(f"{no} segredo", {"texto": inteiro, "revela": d["revela"]}, SEGREDO, bons=("revela",))

    for p in arvore.get("pistas", []):
        if p["plantada_em"] in textos:
            perguntar(f"pista {p['id']} plantada em {p['plantada_em']}", {"pista": p["descricao"], "texto": "\n\n".join(textos[p["plantada_em"]])}, PISTA_PLANTADA, bons=("aparece",))
        for no in p.get("retomada_em", []):
            if no in textos:
                perguntar(f"pista {p['id']} retomada em {no}", {"pista": p["descricao"], "texto": "\n\n".join(textos[no])}, PISTA_RETOMADA, bons=("retoma",))

    pasta = Path(pasta)
    (pasta / "verificacao.resultado.json").write_text(json.dumps(bruto, ensure_ascii=False, indent=1), encoding="utf-8")
    L = [f"# Verificação da árvore — {arvore.get('titulo', pasta.name)}", "",
         "Limites ainda sem calibração (sim ruim > 0,30; sim bom < 0,70; nota < 0,75).", ""]
    L += ["## Alertas", ""] + ([f"- {a}" for a in alertas] or ["Nenhum."])
    L += ["", f"{len(bruto)} perguntas ao JEV · {tokens} tokens de entrada (US$ {tokens * 42e-9:.5f})."]
    (pasta / "VERIFICACAO.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    return alertas


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    arv, txt = carregar(sys.argv[1])
    problemas = estrutura(arv, txt)
    for p in problemas:
        print("ESTRUTURA:", p)
    if problemas:
        print(f"{len(problemas)} problema(s) de estrutura: corrija antes de gastar chamadas no JEV.")
        sys.exit(2)
    print("Estrutura ok.")
    if sys.argv[2:] != ["estrutura"]:
        achados = verificar(sys.argv[1])
        print(f"{len(achados)} alerta(s). Relatório em {Path(sys.argv[1]) / 'VERIFICACAO.md'}")
