---
name: bifurcadas-arvore
description: Passo a passo para produzir uma história em árvore das Histórias Bifurcadas (V1 → V2A/V2B → 4 finais), da bíblia ao pacote de publicação. Use ao criar, escrever, revisar, narrar, animar ou publicar qualquer vídeo de uma história.
---

# Produzir uma árvore

**Idioma:** narração e textos de tela em inglês americano (LANG-001), cenário em país neutro (CEN-001). Respostas ao usuário em português.

Uma história = **7 vídeos**: `V1` (início) → `V2A` e `V2B` → finais `FA1`, `FA2`, `FB1` e `FB2`. O usuário aprova cada etapa; nada pago acontece sem autorização dele.

## Pastas
```
HISTORIAS/H01_<slug>/
  BIBLIA.md        premissa, personagens, cenários, segredo e mapa (aprovada pelo usuário antes de qualquer roteiro)
  arvore.json      estrutura da árvore (formato abaixo) — fonte única das escolhas, pistas e do que cada final revela
  V1/blocos.json   narração e storyboard de cada vídeo (um blocos.json por nó)
  V2A/ V2B/ FA1/ FA2/ FB1/ FB2/
  VERIFICACAO.md   saída do verificar_arvore.py
```
Cada nó também recebe `audio/`, `portoes_voz.json` e, na publicação, `PUBLICACAO.md`.

## Formato do `arvore.json`
```json
{
  "titulo": "A mala no porta-malas",
  "premissa": "Duas ou três frases.",
  "segredo": "A verdade completa, que só quem vê os quatro finais entende.",
  "nos": {
    "V1":  {"filhos": {"A": "V2A", "B": "V2B"}, "escolha": {"pergunta": "Abrir a mala?", "A": "Abrir", "B": "Devolver fechada"}},
    "V2A": {"pai": "V1", "filhos": {"A": "FA1", "B": "FA2"}, "escolha": {"pergunta": "...", "A": "...", "B": "..."}},
    "V2B": {"pai": "V1", "filhos": {"A": "FB1", "B": "FB2"}, "escolha": {"pergunta": "...", "A": "...", "B": "..."}},
    "FA1": {"pai": "V2A", "revela": "o pedaço do segredo que este final mostra"}
  },
  "pistas": [{"id": "P1", "plantada_em": "V1", "descricao": "o relógio parado às três e dez", "retomada_em": ["FA1", "FB2"]}]
}
```
`blocos.json` de cada nó: `{"blocos": [{"id": "B01", "narracao": "...", "tags": "...", "visual": "storyboard: ação, câmera, sons"}, ..., {"id": "ESCOLHA", ...}]}`. O bloco `ESCOLHA` (8 a 30 s) fecha todo vídeo que bifurca; os finais terminam num bloco `CTA` (convite a ver os outros finais).

## Regras de história
1. **O segredo em pedaços:** cada final é um desfecho completo **e** revela um pedaço diferente do segredo. Só quem vê os 4 entende tudo.
2. **Escolha equilibrada:** as duas opções tentam e as duas custam algo. Nenhuma é a "certa".
3. **Parar no auge:** o vídeo que bifurca termina no momento de maior tensão.
4. **Abertura que situa:** quem cai direto num ramo entende em até 15 s quem é o personagem e o que está em jogo.
5. **Pistas:** tudo o que é plantado no V1 é retomado em pelo menos um final.
6. **Continuidade:** nada contradiz o que veio antes no mesmo caminho.
7. **Público adulto e seguro para anunciantes:** sem tom infantil, sem violência explícita, palavrão ou tema chocante.
8. **Cultura americana (CUL-001):** dilemas, empregos, dinheiro e família do jeito americano, num país sem nome.
9. **Respeito (RES-001), inegociável:** nada que ofenda crença, raça, orientação sexual, identidade de gênero, deficiência, nacionalidade, idade ou classe social. Nenhum estereótipo, nenhum vilão definido por esses traços, nenhuma piada com eles.

## Dinâmica do canal (FMT-005): o espectador precisa entender o jogo
1. **Abertura do V1 (depois do gancho, até 10 s):** a fórmula fixa, com o mapa da árvore na tela: *"This story splits. At the end of this video, you decide what I do, and every choice leads somewhere different. There are four endings. Only one of them tells you the whole truth."* Os ramos não repetem a explicação; mostram só o mapa por 2 s.
2. **Mapa da árvore ("You are here"):** no início de todo vídeo, o mapa (V1 → 2 → 4) acende o nó atual. Nos finais, o final assistido "destrava" e os outros aparecem trancados: *"Ending 2 of 4 unlocked"*.
3. **Aviso de escolha (no último terço do vídeo):** um selo discreto, *"Your choice is coming"*, uns 60 s antes da tela de escolha.
4. **Tela de escolha (últimos 20 s, sempre igual; componente `TelaEscolha` em `AV/src/motor/TelaEscolha.jsx`):** o personagem de costas no centro de uma bifurcação, olhando um caminho, depois o outro, e virando para o espectador com um "?" e os ombros encolhidos. **A sempre à esquerda (azul), B sempre à direita (laranja)**, cada caminho terminando numa moldura vazia (`MOLDURA_A`/`MOLDURA_B`) com a letra e o texto da opção embaixo. No YouTube Studio, os dois elementos de vídeo da tela final vão exatamente sobre as molduras. Narração fixa: *"If you think I should [opção A], tap the video on the left. If I should [opção B], tap the one on the right. And you can always come back and try the other path."* Na tela final do YouTube, os dois quadros de vídeo vão exatamente nesses lugares. Diga "the video on the left/right", não "card": card é outra coisa no YouTube.
5. **Fim de cada final (CTA):** o contador e o convite: *"That's ending one of four. Three more are waiting, and one of them changes everything. The full map is pinned in the comments."* Tela final com os outros caminhos e a playlist da história.
6. **Fora do vídeo:** comentário fixado com o mapa e os links (A ▶ / B ▶), descrição com os links e *"Comment A or B before you choose"*, trailer do canal de 60 s explicando o formato, banner com a frase do canal (ex.: *"Every story splits. You choose."*), títulos padronizados (*Part 1*, *Path A*, *Ending 1 of 4*).

## Etapas
1. **Bíblia** (`BIBLIA.md` + `arvore.json`) → aprovação do usuário.
2. **Estrutura:** `python INTEGRACOES/JEV/verificar_arvore.py HISTORIAS/H01_x estrutura` (grátis) até dar "Estrutura ok".
3. **Roteiro** (subagente `roteirista`, em inglês) → `revisor-ingles` (idioma, com explicação em português) → `revisor-texto` (história) → `verificar_arvore.py` completo (centavos) → `linguagem_ia.py blocos HISTORIAS/H01_x` → aprovação do usuário.
4. **Voz:** `portoes.py automaticos <nó>`, depois `narracao_unica.py autorizar <nó> <teto> "<ordem do usuário>"` (pede aprovação) e `gerar <nó> <bloco>`. Para testar sem gastar: `simular`.
5. **Palavras:** `python INTEGRACOES/ELEVENLABS/palavras.py <nó>/audio/Bxx-v4.alinhamento.json AV/src/<história>/<nó>/Bxx.palavras.json`; copiar o mp3 para `AV/public/<história>/<nó>/`.
6. **Animação** (subagente `programador-cenas`) com o motor de `AV/src/motor/` → quadros-chave → `revisor-visual` → aprovação.
7. **Render final:** `AV/Renderizar.ps1 -Composicao <id> -Final` → enviar o `-upload.mp4` (2560x1440, sem metadados).
8. **Publicação** (só quando o usuário pedir): pacote por vídeo em `PUBLICAR/`, em inglês, revisado pelo `revisor-ingles` e pelo `linguagem_ia.py`.

## Regras do YouTube (o formato depende delas)
- **Nunca "conteúdo para crianças".** Esse tipo de vídeo perde a tela final, os cards e os comentários. O JEV `publico` precisa ler "adultos".
- **Tela final:** de 5 a 20 s no fim do vídeo. Reservar os **últimos 20 s** de todo vídeo que bifurca: cena congelada, as duas opções escritas e espaço livre para os 2 quadros de vídeo.
- **Reforço:** links dos dois caminhos na descrição e no comentário fixado, cards durante o vídeo e uma playlist por história.
- **Publicar a árvore inteira junta** (ou agendada no mesmo horário). Ramo sem destino é beco sem saída.
- **A tela final é configurada à mão no YouTube Studio** (não existe pela API). Entregar ao usuário um passo a passo com os títulos de destino.
- **Originalidade:** narração e roteiro próprios, sem template repetido entre histórias (política de conteúdo inautêntico).
- **Som:** só efeitos registrados em `AV/public/efeitos/LEIA.md` (CC0 ou com crédito) e trilhas com licença registrada. Nunca CC-BY-NC.
- **Depois da árvore:** compilado "Todos os caminhos" (25 a 35 min, com mapa das decisões e valor novo) e Shorts com o momento da primeira escolha, ligados ao V1.
