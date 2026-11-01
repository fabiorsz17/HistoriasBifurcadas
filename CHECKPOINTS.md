# Checkpoints — Histórias Bifurcadas

Registro mais recente no topo.

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
