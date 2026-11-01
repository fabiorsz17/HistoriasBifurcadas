"""Teste da trava da ElevenLabs: prova que a segunda chamada é recusada ANTES de qualquer envio.
Usa um registro e um vídeo de teste em INTEGRACOES/ELEVENLABS/_teste_trava/ e um "envio" falso: nenhuma rede, nenhum crédito.
    python INTEGRACOES/ELEVENLABS/teste_trava.py
"""
import base64
import json
import os
import shutil
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
TRAB = Path(__file__).resolve().parent / '_teste_trava'
shutil.rmtree(TRAB, ignore_errors=True)
TRAB.mkdir(parents=True)
os.environ['HB_REGISTRO_ELEVENLABS'] = str(TRAB / 'registro.json')
sys.path.insert(0, str(Path(__file__).resolve().parent))
import narracao_unica as nu  # noqa: E402
nu.VOZ = 'voz-de-teste'  # a voz real ainda não foi escolhida; o envio aqui é falso
import portoes  # noqa: E402

EP = TRAB / 'HTESTE' / 'V1'
EP.mkdir(parents=True)
TEXTO = 'Este é um bloco de teste, escrito como se fala, sem nenhum número em algarismo.'
(EP / 'blocos.json').write_text(json.dumps({'blocos': [{'id': 'B01', 'narracao': TEXTO}]}, ensure_ascii=False), encoding='utf-8')

chamadas = []


def envio_falso(texto, lista, i):
    chamadas.append(texto)
    return {'audio_base64': base64.b64encode(b'ID3 falso').decode(), 'alignment': {}}


def envio_que_cai(texto, lista, i):
    chamadas.append(texto)
    raise ConnectionError('queda simulada no meio da geração')


def portoes_ok():
    for p in nu.PORTOES:
        portoes.marcar(EP, 'B01', p, True, 'teste', 'teste')


def espera_recusa(nome, fn, contem):
    antes = len(chamadas)
    try:
        fn()
    except nu.Recusa as r:
        assert contem in str(r), (nome, str(r))
        assert len(chamadas) == antes, f'{nome}: houve envio!'
        print(f'ok  {nome}: recusado antes de enviar ({str(r)[:90]}...)')
        return
    raise AssertionError(f'{nome}: NÃO foi recusado')


g = lambda: nu.gerar(EP, 'B01', enviar=envio_falso)  # noqa: E731
espera_recusa('sem teto autorizado', g, 'teto')
nu.autorizar(EP, 1000, 'teste automático')
espera_recusa('sem portões', g, 'portões')
portoes_ok()
mp3 = g()
assert len(chamadas) == 1 and mp3.exists()
print('ok  primeira geração: enviada uma vez e registrada como concluida')
espera_recusa('SEGUNDA geração do mesmo bloco', g, 'já foi gerada')
espera_recusa('segunda geração de novo (insistência)', g, 'já foi gerada')

nu.liberar(EP, 'B01', 'teste: usuário pediu regravação')
(EP / 'blocos.json').write_text(json.dumps({'blocos': [{'id': 'B01', 'narracao': TEXTO + ' Mudou.'}]}, ensure_ascii=False), encoding='utf-8')
espera_recusa('texto mudou depois dos portões', g, 'portões')
portoes_ok()
try:
    nu.gerar(EP, 'B01', enviar=envio_que_cai)
except ConnectionError:
    pass
print('ok  geração liberada pelo usuário caiu no meio (registro ficou "iniciada")')
espera_recusa('depois de queda no meio', g, 'iniciada')

nu.autorizar(EP, 10, 'teto pequeno')
reg = nu.ler_registro()
reg['episodios']['HTESTE/V1']['blocos']['B01']['liberacoes'] = 5  # só para isolar a checagem do teto
nu.gravar_registro(reg)
espera_recusa('acima do teto do episódio', g, 'teto')
print(f'\nTRAVA OK: {len(chamadas)} envios falsos no total (esperado 2: a primeira geração e a liberada que caiu).')
assert len(chamadas) == 2
shutil.rmtree(TRAB, ignore_errors=True)
