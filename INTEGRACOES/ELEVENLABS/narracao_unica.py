"""ÚNICO caminho do projeto até a ElevenLabs (trazido do Zero a 100). Gera a narração de UM bloco, uma vez só.

Cada vídeo da árvore (HISTORIAS/<id>/V1, V2A...) é um "episódio" para a trava: a chave no registro é <id>/<nó>.

Trava em programa, não só em instrução:
  1. O registro (INTEGRACOES/ELEVENLABS/registro_elevenlabs.json) diz se o bloco já foi gerado. Se existir QUALQUER entrada
     para o bloco ("iniciada" ou "concluida"), a chamada é recusada. Uma segunda geração só com `liberar`,
     que é decisão do usuário (o .claude/settings.json pede a aprovação dele para esse comando).
  2. O episódio precisa de um teto de créditos autorizado (`autorizar`, também com aprovação do usuário).
     A soma do que já foi gerado no episódio + este bloco não passa do teto.
  3. O saldo da conta é consultado antes; sem saldo, nada é enviado.
  4. O texto precisa ter passado em TODOS os portões (portoes.py) com o mesmo texto de agora (hash).
  5. Grava "iniciada" ANTES de chamar e "concluida" depois de salvar o áudio. "iniciada" sem "concluida"
     (queda no meio) também recusa: o usuário confere o histórico da conta antes de decidir.

Uso:
  python narracao_unica.py gerar   <pasta do episódio> <bloco>             # chamada PAGA (só com teto autorizado)
  python narracao_unica.py simular <pasta do episódio> <bloco>             # voz do Windows, grátis, para testes
  python narracao_unica.py autorizar <pasta do episódio> <teto> "<ordem do usuário>"
  python narracao_unica.py liberar <pasta do episódio> <bloco> "<motivo dito pelo usuário>"
  python narracao_unica.py estado  <pasta do episódio>
A chave nunca é impressa nem gravada.
"""
import ctypes
import ctypes.wintypes as wt
import datetime as dt
import hashlib
import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
REGISTRO = Path(os.environ.get('HB_REGISTRO_ELEVENLABS', RAIZ / 'INTEGRACOES' / 'ELEVENLABS' / 'registro_elevenlabs.json'))
CHAVE = Path(__file__).resolve().parent / '.secrets' / 'elevenlabs-tts-key.dpapi'  # Configurar-Chave-ElevenLabs.ps1 -Purpose TTS
VOZ = ''  # voz do canal: ainda não escolhida pelo usuário. Enquanto vazia, toda geração real é recusada.
MODELO = 'eleven_v4'  # o mesmo do Zero a 100; confirmar com o usuário ao escolher a voz
SUFIXO = 'v4'
PORTOES = ['revisor_texto', 'extenso', 'tempo', 'jev']


class Recusa(Exception):
    pass


def agora():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')


def sha(texto):
    return hashlib.sha256(texto.encode('utf-8')).hexdigest()


def ler_registro():
    if REGISTRO.exists():
        return json.loads(REGISTRO.read_text(encoding='utf-8'))
    return {'_leia': 'Registro da trava da ElevenLabs (ORQ-001). Não editar à mão.', 'episodios': {}}


def gravar_registro(reg):
    REGISTRO.parent.mkdir(parents=True, exist_ok=True)
    tmp = REGISTRO.with_suffix('.tmp')
    tmp.write_text(json.dumps(reg, ensure_ascii=False, indent=1), encoding='utf-8')
    os.replace(tmp, REGISTRO)


def chave_ep(pasta):
    p = Path(pasta)
    return f'{p.parent.name}/{p.name}'


def blocos(pasta):
    return json.loads((Path(pasta) / 'blocos.json').read_text(encoding='utf-8'))['blocos']


def texto_do_bloco(lista, bloco):
    for i, b in enumerate(lista):
        if b['id'] == bloco:
            return i, b, (b.get('tags') or b['narracao'])
    raise Recusa(f'Bloco {bloco} não existe no blocos.json.')


def checar(pasta, bloco, reg, real=True):
    """Todas as travas, sem rede. Devolve (i, bloco, texto)."""
    ep = chave_ep(pasta)
    e = reg['episodios'].get(ep, {})
    gb = e.get('blocos', {}).get(bloco, {})
    liberacoes = gb.get('liberacoes', 0)
    geracoes = [g for g in gb.get('geracoes', []) if g.get('tipo', 'real') == 'real'] if real else []
    if real and len(geracoes) > liberacoes:
        ult = geracoes[-1]
        if ult.get('status') == 'iniciada':
            raise Recusa(f'{ep} {bloco}: há uma geração "iniciada" sem "concluida" ({ult["inicio"]}). Pode ter caído no meio. '
                         'Confira o histórico da conta na ElevenLabs com o usuário antes de qualquer nova chamada. Nada foi enviado.')
        raise Recusa(f'{ep} {bloco}: a narração já foi gerada em {ult.get("fim") or ult["inicio"]}. Uma segunda geração é decisão do usuário '
                     '(comando liberar). Nada foi enviado.')
    lista = blocos(pasta)
    i, b, texto = texto_do_bloco(lista, bloco)
    if real:
        if not VOZ:
            raise Recusa('A voz do canal ainda não foi escolhida (VOZ vazia em narracao_unica.py). Nada foi enviado.')
        teto = e.get('teto_creditos')
        if not teto:
            raise Recusa(f'{ep}: nenhum teto de créditos autorizado pelo usuário (comando autorizar). Nada foi enviado.')
        usado = sum(g.get('caracteres', 0) for gb2 in e.get('blocos', {}).values() for g in gb2.get('geracoes', []) if g.get('tipo', 'real') == 'real')
        if usado + len(texto) > teto:
            raise Recusa(f'{ep} {bloco}: {len(texto)} caracteres + {usado} já usados passam do teto de {teto}. '
                         'Não corte o texto: peça ao usuário um teto maior. Nada foi enviado.')
    # portões: o mesmo texto de agora precisa ter passado em todos
    arq = Path(pasta) / 'portoes_voz.json'
    portoes = json.loads(arq.read_text(encoding='utf-8')).get(bloco, {}) if arq.exists() else {}
    h = sha(texto)
    faltam = [p for p in PORTOES if not (portoes.get(p, {}).get('ok') and portoes[p].get('texto_sha') == h)]
    if faltam:
        raise Recusa(f'{ep} {bloco}: o texto ainda não passou (ou mudou depois) nos portões: {", ".join(faltam)}. Nada foi enviado.')
    return i, b, texto, lista


# ---------- chave (DPAPI do usuário Windows), só dentro deste arquivo ----------
class _Blob(ctypes.Structure):
    _fields_ = [('cbData', wt.DWORD), ('pbData', ctypes.POINTER(ctypes.c_char))]


def _chave():
    dados = bytes.fromhex(CHAVE.read_text(encoding='utf-8').strip())
    entrada = _Blob(len(dados), ctypes.cast(ctypes.create_string_buffer(dados, len(dados)), ctypes.POINTER(ctypes.c_char)))
    saida = _Blob()
    if not ctypes.windll.crypt32.CryptUnprotectData(ctypes.byref(entrada), None, None, None, None, 0, ctypes.byref(saida)):
        raise Recusa('Não foi possível abrir a chave da ElevenLabs (DPAPI).')
    try:
        return ctypes.string_at(saida.pbData, saida.cbData).decode('utf-16-le')
    finally:
        ctypes.windll.kernel32.LocalFree(saida.pbData)


def _pedido(metodo, url, corpo=None, timeout=60):
    cab = {'xi-api-key': _chave(), 'Content-Type': 'application/json; charset=utf-8'}
    dados = json.dumps(corpo).encode('utf-8') if corpo is not None else None
    with urllib.request.urlopen(urllib.request.Request(url, data=dados, headers=cab, method=metodo), timeout=timeout) as r:
        return json.loads(r.read().decode('utf-8'))


def saldo():
    s = _pedido('GET', 'https://api.elevenlabs.io/v1/user/subscription', timeout=20)
    return int(s['character_limit']) - int(s['character_count'])


def _enviar(texto, lista, i):
    corpo = {'text': texto, 'model_id': MODELO, 'language_code': 'pt'}
    if i > 0:
        corpo['previous_text'] = lista[i - 1]['narracao']
    if i < len(lista) - 1:
        corpo['next_text'] = lista[i + 1]['narracao']
    return _pedido('POST', f'https://api.elevenlabs.io/v1/text-to-speech/{VOZ}/with-timestamps?output_format=mp3_44100_128', corpo, timeout=180)


# ---------- comandos ----------
def gerar(pasta, bloco, enviar=None):
    """enviar é injetável só para o teste provar que a recusa acontece ANTES da rede."""
    import base64
    reg = ler_registro()
    i, b, texto, lista = checar(pasta, bloco, reg, real=True)
    if enviar is None:
        disponivel = saldo()
        if disponivel < len(texto):
            raise Recusa(f'Saldo da conta ({disponivel}) menor que o texto ({len(texto)}). Nada foi enviado.')
        enviar = _enviar
    ep = chave_ep(pasta)
    g = {'tipo': 'real', 'status': 'iniciada', 'inicio': agora(), 'caracteres': len(texto), 'texto_sha': sha(texto), 'modelo': MODELO}
    reg['episodios'].setdefault(ep, {}).setdefault('blocos', {}).setdefault(bloco, {}).setdefault('geracoes', []).append(g)
    gravar_registro(reg)  # "iniciada" fica gravado antes de qualquer byte sair
    resp = enviar(texto, lista, i)
    if not resp.get('audio_base64'):
        raise Recusa('Resposta sem áudio. O registro ficou "iniciada": confira o histórico da conta antes de repetir.')
    saida = Path(pasta) / 'audio'
    saida.mkdir(exist_ok=True)
    mp3 = saida / f'{bloco}-{SUFIXO}.mp3'
    if mp3.exists():
        mp3 = saida / f'{bloco}-{SUFIXO}-{dt.datetime.now():%Y%m%d%H%M%S}.mp3'
    mp3.write_bytes(base64.b64decode(resp['audio_base64']))
    mp3.with_suffix('').with_suffix('.alinhamento.json').write_text(json.dumps(resp.get('alignment'), ensure_ascii=False), encoding='utf-8')
    g.update(status='concluida', fim=agora(), audio=str(mp3.relative_to(RAIZ)), audio_sha256=hashlib.sha256(mp3.read_bytes()).hexdigest())
    reg = ler_registro()
    reg['episodios'][ep]['blocos'][bloco]['geracoes'][-1] = g
    gravar_registro(reg)
    return mp3


def simular(pasta, bloco):
    """Narração simulada com a voz do Windows (System.Speech): grátis, sem rede, fora da trava real."""
    lista = blocos(pasta)
    _, b, _ = texto_do_bloco(lista, bloco)
    texto = b['narracao']
    saida = Path(pasta) / 'audio'
    saida.mkdir(exist_ok=True)
    wav = saida / f'{bloco}-simulado.wav'
    ps = ("Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
          "$v = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -like 'pt*' } | Select-Object -First 1; "
          "if ($v) { $s.SelectVoice($v.VoiceInfo.Name) }; $s.Rate = 1; "
          f"$s.SetOutputToWaveFile('{wav}'); $s.Speak([IO.File]::ReadAllText('{saida / (bloco + '-simulado.txt')}', [Text.Encoding]::UTF8)); $s.Dispose()")
    (saida / f'{bloco}-simulado.txt').write_text(texto, encoding='utf-8')
    subprocess.run(['powershell', '-NoProfile', '-Command', ps], check=True)
    # alinhamento estimado: palavras distribuídas pelo tamanho, no formato da ElevenLabs (caracteres)
    import wave
    with wave.open(str(wav)) as w:
        dur = w.getnframes() / w.getframerate()
    chars = list(texto)
    passo = dur / max(1, len(chars))
    alin = {'characters': chars, 'character_start_times_seconds': [k * passo for k in range(len(chars))],
            'character_end_times_seconds': [(k + 1) * passo for k in range(len(chars))]}
    (saida / f'{bloco}-simulado.alinhamento.json').write_text(json.dumps(alin, ensure_ascii=False), encoding='utf-8')
    reg = ler_registro()
    reg['episodios'].setdefault(chave_ep(pasta), {}).setdefault('blocos', {}).setdefault(bloco, {}).setdefault('geracoes', []).append(
        {'tipo': 'simulada', 'status': 'concluida', 'inicio': agora(), 'fim': agora(), 'caracteres': 0, 'audio': str(wav.relative_to(RAIZ))})
    gravar_registro(reg)
    return wav


def autorizar(pasta, teto, ordem):
    reg = ler_registro()
    e = reg['episodios'].setdefault(chave_ep(pasta), {})
    e['teto_creditos'] = int(teto)
    e.setdefault('autorizacoes', []).append({'quando': agora(), 'teto': int(teto), 'ordem_do_usuario': ordem})
    gravar_registro(reg)


def liberar(pasta, bloco, motivo):
    reg = ler_registro()
    gb = reg['episodios'].setdefault(chave_ep(pasta), {}).setdefault('blocos', {}).setdefault(bloco, {})
    gb['liberacoes'] = gb.get('liberacoes', 0) + 1
    gb.setdefault('historico_liberacoes', []).append({'quando': agora(), 'motivo_do_usuario': motivo})
    gravar_registro(reg)


def estado(pasta):
    e = ler_registro()['episodios'].get(chave_ep(pasta), {})
    usado = sum(g.get('caracteres', 0) for gb in e.get('blocos', {}).values() for g in gb.get('geracoes', []) if g.get('tipo', 'real') == 'real')
    print(json.dumps({'teto': e.get('teto_creditos'), 'usado': usado,
                      'blocos': {k: [g['status'] + ('' if g.get('tipo', 'real') == 'real' else ' (simulada)') for g in v.get('geracoes', [])] for k, v in e.get('blocos', {}).items()}},
                     ensure_ascii=False, indent=1))


if __name__ == '__main__':
    a = sys.argv[1:]
    try:
        if a[:1] == ['gerar']:
            print('OK:', gerar(a[1], a[2]))
        elif a[:1] == ['simular']:
            print('OK (simulada):', simular(a[1], a[2]))
        elif a[:1] == ['autorizar']:
            autorizar(a[1], a[2], a[3]); print('Teto registrado.')
        elif a[:1] == ['liberar']:
            liberar(a[1], a[2], a[3]); print('Uma nova geração liberada para o bloco.')
        elif a[:1] == ['estado']:
            estado(a[1])
        else:
            print(__doc__)
            sys.exit(2)
    except Recusa as r:
        print('RECUSADO:', r)
        sys.exit(3)
