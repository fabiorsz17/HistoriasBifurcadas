# Checkpoints — Histórias Bifurcadas

Registro mais recente no topo.

## 01/11/2026 — Animação do V1 começou (PAUSA DO USUÁRIO AQUI)
- **Feito:**
  - Peças visuais no traço de tinta em `AV/src/motor/Objetos.jsx`: céu à noite, cidade ao fundo, posto 24 horas com meio-fio, carro sedã sem adesivo com porta-malas que abre (`abertura`), bolsa com a costura torta (`costura`, P2), maço com cinta "BM" (P3), celular (`chamada` e `app`), galinha e banco de trás.
  - `AV/src/motor/MapaArvore.jsx`: o mapa da árvore animado (FMT-005), com START, A/B, os 4 finais trancados, "YOU ARE HERE" e o brilho dos finais.
  - Áudio do V1 em `AV/public/h01/V1/*.mp3` e tempos das palavras em `AV/src/h01/V1/*.palavras.json`.
  - **V1 B01** (`AV/src/h01/V1/B01.jsx`, composição `H01-V1-B01`): posto, flashback da galinha, "rewind", mapa, olhos e close na costura. Corrigidos nos quadros-chave: bolsa dentro do porta-malas, Kai sentado no meio-fio (pose própria), celular pequeno e visível, tampa do porta-malas, aceno fora do rosto.
- **Em andamento quando o usuário pausou:** render de revisão do B01 em `AV/out/H01-V1-B01.mp4`, ainda não enviado nem aprovado.
- **Ao retomar:**
  1. conferir se `AV/out/H01-V1-B01.mp4` existe (se não, rodar `AV/Renderizar.ps1 -Composicao H01-V1-B01 -Saida out/H01-V1-B01.mp4`);
  2. enviar o vídeo ao usuário e pedir aprovação;
  3. animar V1 B02 a B05 e a ESCOLHA (`TelaEscolha` com "Meet the woman who called" / "Take the bag to the police"), e depois montar o V1 completo.
- **Ainda sem trilha musical:** só efeitos CC0. A trilha precisa de fonte com licença registrada.
- **Nada commitado desde o commit `444646c`:** roteiros, revisões, áudios (que não vão para o git), motor de voz e animação.

## 01/11/2026 — H01 narrada inteira
- Exceção do FA1 B01 (EXC-001) registrada; tetos autorizados pelo usuário (23.900 no total, com 10% de folga).
- 30 blocos gerados pela trava, todos concluídos; o V1 B01 foi recusado por já ter sido gerado, como esperado.
- Tempos: 22,8 min de fala nos 7 vídeos, com todos os blocos dentro da faixa. Ritmo real de 15,2 a 16,1 caracteres/s.
- Gasto: 21.285 caracteres pela contagem da trava. O saldo da conta caiu menos do que isso (de 45.428 para 37.586), provavelmente porque o modelo cobra menos de um crédito por caractere.
- Prévias em áudio corrido: `HISTORIAS/H01_A_MALA/_previa_audio/H01-<nó>.mp3`. Legendas `legenda-en.srt` geradas em cada nó, em sequência; refazer com `--inicios` depois da montagem.
- Próximo: o usuário ouve as prévias; depois vem a animação, começando pelo V1.

## 01/11/2026 — Roteiros da H01, chaves da ElevenLabs e primeiro teste de voz
- Roteiros dos 7 vídeos em inglês: escritos, corrigidos pelo revisor-ingles e aprovados pelo revisor-texto (31 blocos). Os finais têm recapitulação. `ROTEIRO.md`, `REVISAO_INGLES.md` e `REVISAO_HISTORIA.md` estão na pasta da história.
- Pendência: o FA1 B01 está com 0,67 no JEV (corte 0,75). O usuário decide entre aceitar como exceção e calibrar o JEV antes.
- ElevenLabs:
  - duas chaves próprias, a de leitura (saldo e vozes) e a de voz;
  - voz "Kai_" (`x4IlOQV48pkmFjKlH6gP`) configurada na trava;
  - teto de 1.000 créditos autorizado para o V1.
- V1 B01 gerado: `V1/audio/B01-v4.mp3`, 40,7 s, 636 créditos. Ritmo real de 15,6 caracteres/s (o portão ainda usa 14,45).
- Bug de caminho no registro da trava (`relative_to` com pasta relativa), corrigido. O registro do B01, que ficou como "iniciada", foi marcado como concluído com autorização do usuário.

## 01/11/2026 — Bíblia da H01 v2 (inglês, país neutro, cultura americana, respeito)
- `HISTORIAS/H01_A_MALA/`: a BIBLIA.md foi reescrita como "The Bag in the Trunk":
  - Kai, Harold e Laura Pruitt, Vince, Russell Brandt e Detective Bell;
  - dívida médica e aluguel semanal de *rideshare*, *all-night diner*;
  - nenhuma lei nem instituição real.
- O `arvore.json` está em inglês, e os esqueletos dos 7 nós foram refeitos. `verificar_arvore.py estrutura`: ok. Filtro de IA local nas falas e títulos em inglês: sem sinal.
- **Aguardando:** aprovação da bíblia v2. Conferir que "Brandt Markets" não é uma rede real antes de publicar.

## 01/11/2026 — Personagem aprovado e bíblia da H01
- Personagem do canal: `AV/src/motor/Personagem.jsx`, aprovado com o moletom mostarda (VIS-002). Testado em movimento no `TesteCamera` (`out/TesteCamera-heroi.mp4`).
- Nicho: dilemas de vida (NIC-001).
- H01 "A mala no porta-malas": `HISTORIAS/H01_A_MALA/` com `BIBLIA.md`, `arvore.json` (7 nós, 6 pistas, segredo em 4 pedaços) e um `blocos.json`-esqueleto por nó, com as batidas e a narração ainda vazia. `verificar_arvore.py estrutura`: ok.
- **Aguardando:** aprovação da bíblia. Antes do roteiro, conferir no Planalto os artigos 1.233 e 1.234 do Código Civil e o artigo 169 do Código Penal.
- Custo: R$ 0.

## 01/11/2026 — Base técnica trazida do Zero a 100 Finanças
- **Copiado e adaptado:**
  - Remotion em `AV/`: dependências instaladas do store local do pnpm, sem download; o Chrome do render foi copiado.
  - Motor em `AV/src/motor/`: o rig, a base de poses, a legenda/sincronia e os efeitos, mais o `Camera.jsx` novo.
  - 38 efeitos CC0 com o `LEIA.md` das licenças.
  - JEV com as réguas de ficção e o `verificar_arvore.py` novo.
  - ElevenLabs: trava, portões e `palavras.py`, com chave `<história>/<nó>` e voz vazia recusando.
  - 7 subagentes, a skill `bifurcadas-arvore`, 7 skills de animação (licenças MIT/Apache, mais a ficha do Remotion) e `.claude/settings.json` com o bloqueio das chaves e o hook do roteador.
- **Testes:**
  - `TesteCamera`: 3 quadros-chave renderizados e conferidos (parallax, close com desfoque, recuo revelando objeto).
  - `teste_trava.py`: TRAVA OK, 2 envios falsos, o esperado.
  - `verificar_arvore.py estrutura`: pegou os dois erros plantados (final sem `revela`, pista apontando para nó inexistente).
  - Recusa com a voz vazia: ok.
- **Custo:** R$ 0 (nenhuma chamada paga, nenhum download).
- **Não trazido:** visual, personagens, figurinhas e tiras de papel, trilhas musicais, orquestrador, AUDIENCIA, chaves.
- **Próximo passo:** nicho e nome do canal → personagem original → piloto de 30 s.
