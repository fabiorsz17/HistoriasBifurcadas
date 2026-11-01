"""Cliente mínimo do JEV (TypeSafe AI, System One) — só biblioteca padrão.

O JEV não escreve texto: ele responde perguntas fechadas sobre um conteúdo
("noul" = sim/não com probabilidade, "choice" = categoria, "score" = nota numa régua).
Docs: https://docs.typesafe.ai/api/system-one.md

A chave vem de .secrets/jev-api-key.dpapi (cadastrada por Configurar-Chave-JEV.ps1),
decifrada com DPAPI do usuário Windows. Ela nunca é impressa nem gravada em log.

Uso:
    python INTEGRACOES/JEV/jev.py teste                  # uma única chamada curta, para validar a integração
    python INTEGRACOES/JEV/jev.py revisar narracao.txt   # 2 chamadas: roteiro inteiro + gancho; salva narracao.jev.json
"""

import ctypes
import ctypes.wintypes as wt
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

URL = "https://api.typesafe.ai/v1/systemone"
MODELO = "jev-latest"
ARQUIVO_CHAVE = Path(__file__).with_name(".secrets") / "jev-api-key.dpapi"


class _Blob(ctypes.Structure):
    _fields_ = [("cbData", wt.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]


def _ler_chave() -> str:
    """Decifra o arquivo gerado por ConvertFrom-SecureString (hex de um blob DPAPI)."""
    if not ARQUIVO_CHAVE.exists():
        raise RuntimeError("Chave do JEV não cadastrada. Rode INTEGRACOES/JEV/Configurar-Chave-JEV.ps1.")
    dados = bytes.fromhex(ARQUIVO_CHAVE.read_text(encoding="utf-8").strip())
    entrada = _Blob(len(dados), ctypes.cast(ctypes.create_string_buffer(dados, len(dados)), ctypes.POINTER(ctypes.c_char)))
    saida = _Blob()
    if not ctypes.windll.crypt32.CryptUnprotectData(ctypes.byref(entrada), None, None, None, None, 0, ctypes.byref(saida)):
        raise RuntimeError("Não foi possível decifrar a chave (DPAPI). Ela precisa ser cadastrada pelo mesmo usuário Windows.")
    try:
        return ctypes.string_at(saida.pbData, saida.cbData).decode("utf-16-le")
    finally:
        ctypes.windll.kernel32.LocalFree(saida.pbData)


def avaliar(estado, perguntas: dict, modelo: str = MODELO, tentativas: int = 3) -> dict:
    """Envia um conteúdo + perguntas tipadas e devolve a resposta JSON da API."""
    corpo = json.dumps({"model": modelo, "state": estado, "questions": perguntas}, ensure_ascii=False).encode("utf-8")
    pedido = urllib.request.Request(
        URL,
        data=corpo,
        method="POST",
        headers={"Authorization": f"Bearer {_ler_chave()}", "Content-Type": "application/json"},
    )
    for tentativa in range(tentativas):
        try:
            with urllib.request.urlopen(pedido, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as erro:
            # 429/529: limite ou sobrecarga — espera com recuo exponencial (orientação oficial).
            if erro.code in (429, 529) and tentativa < tentativas - 1:
                time.sleep(2 ** (tentativa + 1))
                continue
            detalhe = erro.read().decode("utf-8", "replace")[:500]
            raise RuntimeError(f"JEV respondeu HTTP {erro.code}: {detalhe}") from None
    raise RuntimeError("JEV indisponível após novas tentativas.")


# ---------- Réguas das Histórias Bifurcadas ----------
# ATENÇÃO (lição herdada do Zero a 100): pergunta nova só é confiável depois de calibrada com um texto bom e um
# ruim de propósito. Estas ainda NÃO foram calibradas; os limites em verificar_arvore.py são o ponto de partida.

# Régua de cada vídeo (narração inteira de um nó da árvore).
REGUA_HISTORIA = {
    "publico": {
        # Risco nº 1 do formato: vídeo marcado "para crianças" perde tela final, cards e comentários.
        "type": "choice",
        "instructions": "Para qual público esta história foi escrita?",
        "criteria": {
            "criancas": "Crianças até 12 anos: linguagem e temas infantis",
            "adolescentes": "Adolescentes de 13 a 17 anos",
            "adultos": "Adultos: dilemas, trabalho, dinheiro, relações, consequências de vida adulta",
        },
    },
    "anunciante": {
        "type": "noul",
        "instructions": "O texto tem violência explícita, palavrões, conteúdo sexual, drogas, automutilação ou outro tema chocante que um anunciante evitaria?",
    },
    # Respeito (RES-001): três perguntas separadas, porque a ofensa direta, o estereótipo e o vilão "por traço" falham de jeitos diferentes.
    "ofensa": {
        "type": "noul",
        "instructions": "O texto tem alguma fala, piada, apelido ou descrição que ofenda ou ridicularize pessoas por religião, raça, etnia, orientação sexual, identidade de gênero, deficiência, nacionalidade, idade ou classe social?",
    },
    "estereotipo": {
        "type": "noul",
        "instructions": "Algum personagem é retratado com um estereótipo ligado a religião, raça, etnia, orientação sexual, identidade de gênero, deficiência, nacionalidade, idade ou classe social?",
    },
    "vilao_por_traco": {
        "type": "noul",
        "instructions": "A história sugere que alguém é perigoso, suspeito, desonesto ou ridículo por causa da religião, raça, etnia, orientação sexual, identidade de gênero, deficiência, nacionalidade, idade ou classe social?",
    },
    "cultura_americana": {
        "type": "noul",
        "instructions": "Os hábitos, lugares do dia a dia, trabalho, dinheiro e relações descritos soam naturais para um americano (e não para alguém de outro país)?",
    },
    "clareza": {
        "type": "score",
        "instructions": "Quem ouve esta narração uma única vez, sem imagem, entende o que está acontecendo?",
        "criteria": [
            "Confuso: personagens, lugar ou ação não ficam claros",
            "Compreensível com atenção; algum trecho exige voltar",
            "Claro na primeira escuta: quem, onde e o que está em jogo",
        ],
    },
    "tensao": {
        "type": "score",
        "instructions": "Esta narração mantém a vontade de saber o que acontece em seguida?",
        "criteria": [
            "Morna: nada está em jogo, dá para parar a qualquer momento",
            "Há algo em jogo, mas a tensão cai em trechos longos",
            "Cada trecho aumenta a dúvida ou o risco; difícil parar de ouvir",
        ],
    },
}

# Régua do ponto de escolha (último bloco de um vídeo que bifurca + as duas opções).
REGUA_ESCOLHA = {
    "equilibrio": {
        "type": "score",
        "instructions": "As duas opções oferecidas ao espectador são igualmente tentadoras?",
        "criteria": [
            "Uma opção é claramente a certa (ou a mais divertida); quase ninguém escolheria a outra",
            "As duas têm apelo, mas uma puxa bem mais",
            "Dilema real: dá vontade de escolher as duas, e cada uma custa algo",
        ],
    },
    "obvia": {
        "type": "noul",
        "instructions": "Uma das opções é moralmente óbvia ou claramente a mais segura, sem nenhum custo?",
    },
    "suspense": {
        "type": "score",
        "instructions": "O vídeo para no momento de maior tensão, deixando a pessoa precisando saber o que acontece?",
        "criteria": [
            "Para num momento calmo; a escolha parece um detalhe",
            "Há tensão, mas a escolha chega cedo ou tarde demais",
            "Para no auge: a decisão é urgente e as consequências parecem grandes",
        ],
    },
}

# Régua da abertura (primeiros ~15 s de cada vídeo).
REGUA_GANCHO = {
    "curiosidade": {
        "type": "score",
        "instructions": "Esta abertura de vídeo faz a pessoa querer continuar assistindo?",
        "criteria": [
            "Abertura genérica; nada faz querer saber o que vem depois",
            "Desperta algum interesse, mas a situação demora a ficar clara",
            "Joga a pessoa direto numa situação tensa ou estranha e cria uma pergunta",
        ],
    },
    "situa": {
        # Muita gente cai direto num ramo pela busca: a abertura precisa situar sem o vídeo anterior.
        "type": "noul",
        "instructions": "Alguém que nunca viu os vídeos anteriores entende, por esta abertura, quem é o personagem e o que está acontecendo?",
    },
}


def revisar(caminho: str) -> dict:
    """Narração inteira com REGUA_HISTORIA + primeiro parágrafo com REGUA_GANCHO. Salva <arquivo>.jev.json."""
    arquivo = Path(caminho)
    texto = arquivo.read_text(encoding="utf-8").strip()
    gancho = texto.split("\n\n")[0]
    relatorio = {"historia": avaliar(texto, REGUA_HISTORIA), "gancho": avaliar(gancho, REGUA_GANCHO)}
    arquivo.with_suffix(".jev.json").write_text(json.dumps(relatorio, ensure_ascii=False, indent=2), encoding="utf-8")
    return relatorio


def _resumo(relatorio: dict):
    for parte, resp in relatorio.items():
        print(f"[{parte}] modelo {resp['model']}, tokens de entrada {resp['usage']['input_tokens']}")
        for nome, r in resp["answers"].items():
            if r["type"] == "noul":
                print(f"  {nome}: sim={r['noul']:.2f}")
            elif r["type"] == "score":
                print(f"  {nome}: {r['score']:.2f} de {len(r['legend']) - 1} (confiança {r['confidence']:.2f})")
            else:
                print(f"  {nome}: {r['choice']} (confiança {r['confidence']:.2f})")


def _teste():
    narracao = "Era quase meia-noite quando o Davi abriu o porta-malas do carro alugado e viu a mala. Não era dele. E estava pesada."
    resultado = avaliar(narracao, REGUA_HISTORIA)
    print(json.dumps(resultado, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    if sys.argv[1:] == ["teste"]:
        _teste()
    elif len(sys.argv) == 3 and sys.argv[1] == "revisar":
        _resumo(revisar(sys.argv[2]))
    else:
        print(__doc__)
