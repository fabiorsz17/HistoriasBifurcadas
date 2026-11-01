# Histórias Bifurcadas — guia do Claude Code

Canal de histórias animadas em árvore para o YouTube, **em inglês americano, com costumes americanos num país neutro e respeito total a crença, raça, orientação sexual e demais traços** (LANG-001, CEN-001, CUL-001, RES-001; respostas ao usuário em português): o V1 termina numa escolha, cada escolha leva a um vídeo, e cada um desses leva a dois finais (7 vídeos e 4 finais por história). Personagem de traço simples e cabeça grande, cenários ricos, câmera viva, 16:9 em 2K. Monetização desde o início, então as regras do YouTube valem para tudo.

Regras inegociáveis: [AGENTS.md](AGENTS.md). Lições: [LICOES.md](LICOES.md) (ler no início de toda tarefa). Passo a passo de produção: skill `bifurcadas-arvore` (`.claude/skills/`). Histórico: [CHECKPOINTS.md](CHECKPOINTS.md). Decisões: [GOVERNANCA/DECISOES.md](GOVERNANCA/DECISOES.md).

A base técnica veio do projeto irmão `D:\Zeroa100Financas` em 01/11/2026 (copiada e adaptada; o visual de lá não é usado aqui).

## Modo de trabalho
O usuário aprova cada etapa (bíblia, roteiro, voz, animação, publicação). Chamadas pagas só com autorização explícita e teto. Quem cria nunca revisa (subagentes `roteirista` → `revisor-ingles` (idioma, explicado em português) → `revisor-texto` (história); `programador-cenas` → `revisor-visual`). Sempre que o JEV puder ajudar numa fase, avisar o usuário.

## Ambiente (Windows, PowerShell 5.1)
- Node e Python **não estão no PATH**. Use os do runtime:
  - Node: `C:\Users\fabio\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
  - Python: `C:\Users\fabio\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`
  - pnpm: `node <runtime>\node\node_modules\pnpm\bin\pnpm.cjs` (o store fica em `D:\.pnpm-store`, compartilhado com o Zero a 100).
- Remotion em `AV/` (v4.0.537, React 19). A GPU (GTX 1050 Ti) está ativada em `AV/remotion.config.js`. O Chrome do render está em `AV/node_modules/.remotion` (copiado do Zero a 100, sem download).
- Studio para revisão: porta **3020** (`.claude/launch.json`, nome `remotion-studio`).
- Render: `AV/Renderizar.ps1 -Composicao X [-Quadros a-b] [-Final]`. Revisão em 1080p; o `-Final` usa a composição `X-1440p` (2560x1440) e gera `…-upload.mp4` sem metadados, que é o arquivo do YouTube. Toda composição é registrada com `Par` em `AV/src/Root.jsx`, que cria as duas versões.
- Encoding: no PowerShell 5.1, `Set-Content -Encoding UTF8` grava com BOM e `Get-Content` sem `-Encoding UTF8` corrompe acentos. Prefira Edit/Write.
- Saída do Python com acento: rodar com `PYTHONIOENCODING=utf-8`.

## Motor de animação (`AV/src/motor/`)
- `Camera.jsx`: câmera por keyframes (`prepararCamera`, `cameraEm`), `Camada` com profundidade para parallax e desfoque, `tremor`, `naMao`, `Vinheta`. Teste aprovado tecnicamente: composição `TesteCamera`.
- `Boneco.jsx`: rig 2D (caminhada procedural, piscar, respiração, expressões). O visual é **provisório** (`VISUAL_TESTE`) até o personagem do canal ser aprovado.
- `Personagem.jsx`: **personagem do canal, aprovado com o moletom mostarda (VIS-002, 01/11/2026)**. Traço de tinta, cabeça grande (1,25×) e clara, cabelo preto com franja picotada e redemoinho em gancho (a marca), roupas `ROUPAS.moletom` (protagonista) e `xadrez|jaqueta` (para coadjuvantes) (a jaqueta com fone no pescoço), `glow` opcional e `CabecaPersonagem` para closes. Usa o mesmo rig e as mesmas poses do `Boneco`. Folha: composição `FolhaPersonagem`.
- `TelaEscolha.jsx`: a tela de escolha (FMT-006), com o personagem de costas na bifurcação, as molduras A e B no lugar dos vídeos da tela final e o ciclo olha A, olha B, vira com "?". Demonstração: composição `TelaEscolhaDemo`.
- `base.js`: paleta provisória, easing, poses por keyframes (`prepararChaves`, `poseEm`).
- `Legenda.jsx`: `criarMarcador` (sincronia por palavra) e legenda palavra a palavra.
- `efeitos.js`: `ef('nome')` e `NIVEL_EFEITOS`. Banco em `AV/public/efeitos/` (38 efeitos Freesound CC0, licenças em `LEIA.md`).

## Integrações
- **JEV** (TypeSafe AI, perguntas fechadas, muito barato), em `INTEGRACOES/JEV/`:
  - `linguagem_ia.py`: vestígio de IA (narração, títulos, descrição, comentário fixado). Regras e perguntas em **inglês** por padrão (`HB_IDIOMA=pt` volta ao português).
  - `jev.py`: réguas de ficção — `REGUA_HISTORIA` (público, anunciante, clareza, tensão), `REGUA_ESCOLHA` (equilíbrio, óbvia, suspense), `REGUA_GANCHO` (curiosidade, situa). **Ainda não calibradas.**
  - `verificar_arvore.py`: estrutura, continuidade por caminho, pistas, segredo por final e escolhas.
  - `roteador.py`: hook de modelo e esforço.
  - **Chave pendente:** o usuário roda `INTEGRACOES/JEV/Configurar-Chave-JEV.ps1`. Sem a chave, o roteador cai na heurística local e os portões do JEV falham.
- **ElevenLabs** (`INTEGRACOES/ELEVENLABS/`): `narracao_unica.py` é o único caminho (trava por bloco, teto por vídeo, portões). Cada nó da árvore conta como um episódio (`<história>/<nó>`). Teste: `teste_trava.py` (passou em 01/11/2026). **Pendentes:** a chave (`Configurar-Chave-ElevenLabs.ps1 -Purpose TTS`) e a escolha da voz (`VOZ` vazia recusa toda geração real).
- **Canva Pro:** conector por conta, para cenários e objetos.

## Estado atual (01/11/2026)
- Base copiada e testada: motor de câmera (stills conferidos), trava da voz (teste ok), verificador de estrutura (pegou os erros plantados).
- **Nicho:** dilemas de vida (NIC-001).
- **Pendente do usuário:** nome do canal, chaves do JEV e da ElevenLabs, escolha da voz.
- **H01 "The Bag in the Trunk"** (`HISTORIAS/H01_A_MALA/`): bíblia v2 adaptada (LANG-001, CEN-001, CUL-001, RES-001), aguardando aprovação; estrutura ok.
- **Pendente com aprovação do usuário:** incluir o portão `revisor_ingles` na trava da voz (`narracao_unica.py`, edição protegida).
- **Próximo:** aprovação da bíblia → roteiro dos 7 vídeos (roteirista → revisor-texto → JEV) → piloto de 30 s com a narração.
