"""Portões do texto antes da voz (trazidos do Zero a 100). O narracao_unica.py só envia um bloco que passou em todos,
com o MESMO texto de agora (qualquer edição depois invalida o portão).

  revisor_texto  marcado pelo subagente revisor-texto (que não escreveu o texto)
  extenso        código: nenhum algarismo nem símbolo (números, datas, siglas e símbolos escritos como se fala)
  tempo          código: duração estimada pelo ritmo real da voz (14,45 caracteres/s nos EP02 e EP03)
  jev            JEV: nota "humano" >= corte (FMT-006; 0,75 até a calibração) e nenhuma regra forte

Uso:
  python portoes.py automaticos <pasta do episódio> [bloco]     # extenso + tempo + jev (o jev custa centavos)
  python portoes.py revisor <pasta do episódio> <bloco> aprovado|reprovado "<observação>"
  python portoes.py ver <pasta do episódio>
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'JEV'))
from narracao_unica import blocos, sha, texto_do_bloco, agora  # noqa: E402

CPS = 14.45
FAIXA = {'bloco': (42, 78), 'curto': (8, 30)}  # segundos de fala; ESCOLHA e CTA são curtos
CORTE_ARQ = Path(__file__).resolve().parents[1] / 'JEV' / 'config.json'


def corte_jev():
    try:
        return json.loads(CORTE_ARQ.read_text(encoding='utf-8'))['jev']['corte_humano']
    except Exception:
        return 0.75


def sem_tags(t):
    return re.sub(r'\[[^\]]*\]\s*', '', t)


def p_extenso(texto):
    falado = sem_tags(texto)
    achados = re.findall(r'\d+|%|R\$|\$|&|/|\bn\.?\s?[º°]|º|ª|\+|=', falado)
    return (not achados, f'escrever por extenso: {sorted(set(achados))}' if achados else 'ok')


def p_tempo(bloco, narracao):
    s = len(narracao) / CPS
    lo, hi = FAIXA['curto' if bloco in ('ESCOLHA', 'CTA') else 'bloco']
    return (lo <= s <= hi, f'{s:.0f} s estimados (faixa {lo}–{hi} s)')


def p_jev(narracao):
    from linguagem_ia import CONTEXTO_NARRACAO, analisar
    r = analisar(narracao, CONTEXTO_NARRACAO)
    forte = any(x['peso'] >= 2 for x in r['regras'])
    ok = r['humano'] >= corte_jev() and not forte
    return (ok, f"humano {r['humano']} (corte {corte_jev()}); motivos {r['motivos_jev']}; regras {[x['trecho'] for x in r['regras']]}")


def carregar(pasta):
    arq = Path(pasta) / 'portoes_voz.json'
    return arq, (json.loads(arq.read_text(encoding='utf-8')) if arq.exists() else {})


def marcar(pasta, bloco, nome, ok, nota, por):
    arq, dados = carregar(pasta)
    _, b, texto = texto_do_bloco(blocos(pasta), bloco)
    dados.setdefault(bloco, {})[nome] = {'ok': bool(ok), 'nota': nota, 'por': por, 'quando': agora(), 'texto_sha': sha(texto)}
    arq.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding='utf-8')


def automaticos(pasta, so=None):
    resultado = {}
    for b in blocos(pasta):
        if so and b['id'] != so:
            continue
        texto = b.get('tags') or b['narracao']
        for nome, (ok, nota) in (('extenso', p_extenso(texto)), ('tempo', p_tempo(b['id'], b['narracao'])), ('jev', p_jev(b['narracao']))):
            marcar(pasta, b['id'], nome, ok, nota, 'portoes.py')
            resultado.setdefault(b['id'], {})[nome] = ('ok' if ok else 'REPROVADO') + f' — {nota}'
    return resultado


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['automaticos']:
        print(json.dumps(automaticos(a[1], a[2] if len(a) > 2 else None), ensure_ascii=False, indent=1))
    elif a[:1] == ['revisor']:
        marcar(a[1], a[2], 'revisor_texto', a[3] == 'aprovado', a[4] if len(a) > 4 else '', 'revisor-texto')
        print('Registrado.')
    elif a[:1] == ['ver']:
        print(json.dumps(carregar(a[1])[1], ensure_ascii=False, indent=1))
    else:
        print(__doc__)
        sys.exit(2)
