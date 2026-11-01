# H01 · Revisão da história (revisor-texto, 01/11/2026)

Revisão do campo `narracao` dos 7 vídeos, depois da passada do `revisor-ingles`, lida caminho a caminho como o espectador vê: V1→V2A→FA1, V1→V2A→FA2, V1→V2B→FB1, V1→V2B→FB2. Nenhuma narração foi editada. Vereditos gravados com `portoes.py revisor` em cada `portoes_voz.json`.

**Resumo:** 31 blocos, **26 aprovados e 5 reprovados** (1 de gravidade alta, 4 de média). Tempos, números por extenso, fórmulas do canal (FMT-005), respeito (RES-001), cultura americana (CUL-001), país neutro (CEN-001) e público adulto: tudo ok. O segredo é o mesmo fato antes da escolha em todos os caminhos, e nenhum final contradiz outro.

## Vereditos por bloco

| Nó | Bloco | Veredito | Motivo |
|---|---|---|---|
| V1 | B01 | aprovado | Gancho e fórmula do canal literais; situa o Kai; 44 s |
| V1 | B02 | aprovado | 350 por semana, três semanas, 18 mil, prazo de segunda; *Three hours earlier* compatível com o pickup às *ten-forty* |
| V1 | B03 | aprovado | P1 e P4 plantadas; o pedido do número explica a ligação da Laura; *seat in front of him* casa com o FB2 |
| V1 | B04 | aprovado | P2 e P3 plantadas (obs. baixa nº 1) |
| V1 | B05 | aprovado | P5 literal; para no auge (obs. baixa nº 2) |
| V1 | ESCOLHA | aprovado | Fórmula ok, opções iguais ao `arvore.json`, escolha equilibrada |
| V2A | B01 | **reprovado** | Problemas nº 2 e nº 3 |
| V2A | B02 | aprovado | Cinco mil, até as oito; o Vince seguiu a Laura desde o hospital (obs. baixa nº 4) |
| V2A | B03 | aprovado | Cinquenta mil, queixa no celular, Laura chorando; auge sem violência |
| V2A | ESCOLHA | aprovado | Fórmula ok; as duas opções custam |
| V2B | B01 | **reprovado** | Problema nº 3 |
| V2B | B02 | **reprovado** | Problema nº 4 |
| V2B | B03 | aprovado | P6 plantada; horários certos (obs. baixa nº 5) |
| V2B | B04 | aprovado | 10% = 20 mil; o Vince chega porque a detetive ligou para o número da queixa |
| V2B | ESCOLHA | aprovado | Fórmula ok; *Twenty grand on one side, nine-ten on the other* |
| FA1 | B01 | aprovado | P2 retomada; revela o pedaço 3 |
| FA1 | B02 | aprovado | Consequência proporcional; *caught up on the car* correto |
| FA1 | B03 | aprovado | Fecho da bíblia (obs. baixa nº 6) |
| FA1 | CTA | aprovado | Contador, convite, mapa |
| FA2 | B01 | aprovado | Fuga sem violência; Laura volta do estacionamento como no V2A (obs. baixa nº 7) |
| FA2 | B02 | **reprovado** | Problema nº 1 |
| FA2 | B03 | aprovado | Revela o pedaço 1; P1 retomada (obs. baixa nº 8) |
| FA2 | CTA | aprovado | Contador, convite, mapa |
| FB1 | B01 | aprovado | P6 retomada; *an hour and a half later* certo |
| FB1 | B02 | aprovado | P3 retomada; revela o pedaço 2 |
| FB1 | B03 | **reprovado** | Problema nº 5 |
| FB1 | CTA | aprovado | Contador, convite, mapa |
| FB2 | B01 | aprovado | Vinte mil cobrem tudo; chaves da Laura iguais ao V2B |
| FB2 | B02 | aprovado | P4 e P1 retomadas; revela o plano B |
| FB2 | B03 | aprovado | Fim aberto, sem sermão |
| FB2 | CTA | aprovado | Contador e mapa (obs. baixa nº 9) |

## Problemas (reprovações)

### 1. FA2 B02: os cinco mil da Laura somem (gravidade **alta**)
No V2A B02, a Laura oferece *"five thousand dollars for your trouble"* para o Kai guardar a bolsa até as oito, e o próprio Kai diz *"That would cover the car, with some left over."* No FA2 ele cumpre exatamente isso (fica com a bolsa até as oito e a entrega à advogada), mas:
> *"On Monday, the rental company came for the car. I'd missed the payment, and that was that."*

No mesmo caminho, o espectador sabe que o dinheiro do carro estava prometido. O preço do final (perder o carro e o trabalho) fica sem causa e parece castigo do roteiro (TEM-001).
**Correção sugerida:** uma ou duas frases dizendo por que os cinco mil não chegaram a tempo, nascidas da própria escolha. Ex.: *"Laura tried to give me the five grand right there. The lawyer stopped her. Paying a witness before this was over would look terrible. So on Monday, the rental company came for the car."* (Outra saída: o Kai recusa o dinheiro, mas aí a perda vira escolha dele e muda o tom.)

### 2. V2A B01: como a Laura conseguiu o número do Kai (média)
> *"If anything happens, find the driver. His name is Kai. You can trust him."*

A mensagem dá o nome, mas não o número, e a Laura ligou para o Kai no V1. O V1 planta o pedido do número (*"he asked for my number"*), mas no V2A a ligação fica no ar.
**Correção sugerida:** *"If anything happens, find the driver. His name is Kai. Here's his number. You can trust him."*

### 3. V2A B01 e V2B B01: abertura dos ramos não situa o Kai (média)
- V2A: *"So, short version. Two hundred thousand dollars in my trunk, and a woman named Laura on the phone…"*
- V2B: *"So, I found two hundred thousand dollars in my trunk, and a woman on the phone begged me…"*

Quem cai direto no ramo não ouve nos primeiros 15 s quem fala (nome, motorista de aplicativo) nem o que ele tem a perder (aluguel atrasado, hospital). No V2A a dívida só aparece no B02; no V2B, só no B04 (regra 4 da skill).
**Correção sugerida (V2A):** *"So, short version. I'm Kai, I drive rideshare, I'm three weeks behind on my car, and there was two hundred thousand dollars in my trunk. A woman named Laura called, begging me not to go to the police."*
**Correção sugerida (V2B):** *"So, I'm Kai. I drive rideshare, I'm three weeks behind on my car, and I found two hundred thousand dollars in my trunk. A woman on the phone begged me not to go to the police. I went anyway."*
Os dois blocos ganham uns 4 a 5 s e continuam na faixa.

### 4. V2B B02: como a Laura chega à delegacia (média)
> *"About ten minutes later, the door opened, and it was her. Laura."*

O Kai não foi ao diner e nunca disse a ela aonde ia. O espectador se pergunta como ela achou a delegacia certa.
**Correção sugerida:** ligar a chegada à prisão do pai. Ex., na fala da detetive: *"They're bringing him in here now."* e, na chegada: *"About ten minutes later, the door opened, and it was her. Laura. She'd come for her dad."*

### 5. FB1 B03: a pista P5 não é retomada (média)
O `arvore.json` manda retomar a P5 (*"If that bag ends up at the police station tonight, my dad goes to prison"*) no FB1, e nenhum bloco do FB1 volta a ela. É a ironia do final: a bolsa chegou à polícia, e foi isso que soltou o Harold.
**Correção sugerida** (depois de *"Harold was released the next afternoon."*): *"Laura had told me that if the bag got to the police that night, her dad would go to prison. It got there. And it's what got him out."* (~+7 s; o bloco vai a uns 57 s.)

## Observações de gravidade baixa (aprovadas, para o roteirista decidir)
1. **V1 B04:** *"I hit the speed bump at the all-night gas station"* não diz por que ele entrou no posto. Sugestão: *"I pulled into the all-night gas station by the overpass for gas, hit the speed bump…"*.
2. **V1 B01 × B05:** o gancho diz *"my phone wouldn't stop ringing"*, mas no B05 o telefone toca uma vez. Sugestão no B05: *"Then my phone rang. Unknown number. I let it ring out. It rang again."*
3. **V1 B03 (para a animação):** o Harold precisa sentar atrás do **banco do passageiro**, para que *"the seat in front of him"* seja o banco do FB2.
4. **V2A B02:** o Vince chama o Kai pelo nome sem que se diga como sabe. Aceitável (o app no celular do Harold mostra o motorista), mas fica implícito.
5. **V2B B03:** *"He was still at the office, waiting for a ride."* Esperar 90 min por um carro é exagerado; basta *"He was still at the office."*. Também: o horário sozinho é indício, não prova; o FB1 completa com o *B M*, então a lógica fecha.
6. **FA1 B03:** *"My own car now, paid for."* Ver dúvida 4 abaixo.
7. **FA2 B01:** *"I grabbed the bag"* sugere que a bolsa estava dentro do diner; no V2A B01 ela estava no banco do carona. Não contradiz, mas o V2A B01 pode dizer que ele a levou para dentro.
8. **FA2 B03:** *"That's why I asked for your number"* vem logo depois do adesivo e fica meio solto. Sugestão: *"I needed a driver I could find again. That's why I asked for your number."*
9. **FB2 CTA:** *"The bag, the money, the drive, all of it"* é ambíguo (a corrida ou o pendrive?). Sugestão: *"the thumb drive"*.

## Conferências que passaram
- **Continuidade por caminho:** pickup *ten-forty*, queixa *nine-ten* (uma hora e meia antes), *two hundred thousand*, *five thousand*, *fifty grand*, *twenty thousand* (10%), *eighteen thousand*, *three hundred and fifty a week*, três semanas, black duffel, carry-on, costura torta, *B M*, pendrive no forro, segunda cópia embaixo do banco do passageiro.
- **Lógica do segredo:** o Vince vigiava a saída de carros de aplicativo no escritório (FA2), o carro do Kai era o único sem adesivo, a queixa veio antes de o dinheiro sair (V2B, FB1), o pendrive no forro (FA1), a segunda cópia (FB2). Nenhum final contradiz outro.
- **Chegadas:** o Vince chega ao diner seguindo a Laura desde o hospital (V2A B02) e à delegacia porque a detetive ligou para o número da queixa (V2B B01).
- **Pistas:** P1 (V1→FA2, FB2), P2 (V1→FA1), P3 (V1→FB1), P4 (V1→FB2), P5 (V1→V2B; **falta o FB1**), P6 (V2B→FB1).
- **Revelação:** cada final entrega o seu pedaço com uma fala clara (*"The cash was just bait"*, o adesivo, *B M* + *filed a theft report first*, *"You're my plan B"*).
- **Escolhas (TEM-001):** as três têm ganho e preço reais; finais sem sermão (*"I lost the car. But I slept fine."*, *"That one, I'm still paying."*).
- **RES-001, CUL-001, CEN-001, público adulto:** ok. Nenhum personagem é suspeito pelo que é; a dívida médica é tratada com dignidade; *precinct*, *out on bail*, *self-service car wash* e *federal building* são genéricos e americanos.

## Dúvidas do `REVISAO_INGLES.md`, do ponto de vista da história
(O arquivo lista 7 dúvidas, não 5; respondo todas. Quem decide é o usuário.)

1. **CTA do FB2 (0,73 no JEV):** pela história o bloco está certo. Recomendo rodar o JEV de novo e, se oscilar, aceitar (perguntas não calibradas, bloco de fórmula). Aproveitar a nova rodada para trocar *"the drive"* por *"the thumb drive"* (obs. 9).
2. **Banco do Harold:** a troca está certa e é necessária para a P4 fechar com o FB2. Recomendo confirmar, com o Harold sentado **atrás do banco do passageiro** no storyboard do V1 B03.
3. **"He's never even met me" → "I drove him to the airport. That's it.":** troca correta; a original contradizia o V1. Recomendo manter.
4. **"Caught up on the car" e "My own car now, paid for" (FA1):** *caught up* está certo. A leitura "comprou um carro depois" funciona (os 50 mil dão para isso), mas o espectador pode ouvir *paid for* como o carro alugado. Recomendo deixar explícito: *"I bought my own car. Paid for."*
5. **CTA do FA1 sem "Three more are waiting…":** pela história, as partes que importam (contador, convite, mapa nos comentários) estão nos quatro CTAs, e cada um provoca o pedaço que falta. Recomendo manter as variações (também evita template repetido). Se o usuário quiser a frase fixa da skill, que seja nos quatro, não só em um.
6. **V1 B01 a 44 s:** sem problema de história. Recomendo conferir na simulação da voz; se ficar abaixo de 42 s, a obs. 2 (o telefone tocando duas vezes) pode ir para o gancho em vez do B05.
7. **"Precinct":** genérico, americano e sem agência real. Recomendo manter.

---

# Rodada 2 (01/11/2026): blocos corrigidos pelo roteirista e revisados no inglês (rodadas 2 e 3 do `REVISAO_INGLES.md`)

Relidos os 7 blocos que mudaram, dentro dos seus caminhos completos. Os **7 foram aprovados** e registrados com `portoes.py revisor`. Com isso, os 31 blocos da H01 estão aprovados na história.

| Nó | Bloco | Veredito | O que resolveu |
|---|---|---|---|
| V2A | B01 | aprovado | *"Here's his number"* explica a ligação da Laura (problema 2). Quem é o Kai aparece na fala dele (*"I'm just the rideshare guy. I can't even make the payments on my rental."*). 60 s |
| V2B | B01 | aprovado | Abre com *"I'm Kai. I drive rideshare…"*, no passado, com aluguel, hospital e dinheiro nos primeiros 15 s (problema 3). 64 s |
| V2B | B02 | aprovado | *"They're bringing my dad in here"* explica a chegada da Laura (problema 4). Bate com o Harold solto dali no FB1 e preso no FB2. 65 s |
| FA2 | B02 | aprovado | A advogada barra o pagamento a uma testemunha, e *"No five grand meant no payment"* liga essa causa ao carro recolhido (problema 1). A perda nasce da escolha, sem castigo do roteiro. 69 s |
| FB1 | B03 | aprovado | A P5 volta, com a ironia certa: a bolsa chegou à polícia, e foi isso que soltou o Harold (problema 5). 60 s |
| FB2 | CTA | aprovado | *"the thumb drive"* tira a ambiguidade (obs. 9) |
| FA1 | B03 | aprovado | *"I bought my own car eventually"* separa o carro novo do alugado (obs. 6 e dúvida 4) |

## Furos novos
Nenhum de gravidade alta ou média. Duas observações baixas, sem reprovação:
- **V2A B01:** quem chega direto ao V2A só ouve o nome do Kai e a dívida perto dos 50 s. Nos primeiros 15 s, o recap e o mapa já mostram o que está em jogo (dinheiro, polícia, Laura). Aceito pelo equilíbrio com a nota do JEV. Se o usuário preferir a regra dos 15 s à risca, a saída é a versão da rodada 2, com nota 0,67.
- **V2B B01 × B02:** o B01 diz *"Just one detective"* e o B02 cita *"the guy at the front desk"*. O atendente do balcão não é detetive, então não há contradição, só um detalhe a mais na cena (a animação pode mostrar os dois).

Conferências repetidas: a mensagem com o número do Kai continua *"Earlier that night"* (o Harold pegou o número no fim da corrida, antes de ser preso, então fecha). O *"until I was forty"* da conta do hospital é exagero de fala, não um número da história. Os horários, os valores e as pistas dos outros blocos não mudaram.

---

# Rodada 3 (01/11/2026): recapitulação no início dos 4 finais e reforço da P1 no FB2 (rodadas 4 e 5 do `REVISAO_INGLES.md`)

Relidos os 5 blocos que mudaram dentro dos seus caminhos (V1 → V2A para FA1 e FA2; V1 → V2B para FB1 e FB2). Para quem chega direto pela busca, conferi três coisas em cada recap: se é fiel, se não adianta o final e se situa o Kai, o que está em jogo e a Laura. Resultado: **2 aprovados e 3 reprovados (gravidade média)**.

Nenhuma recapitulação contradiz o caminho, e nenhuma adianta o final. O problema dos três reprovados é de **clareza para quem chega direto**: o próprio final cita algo que o recap não apresentou.

| Nó | Bloco | Veredito | Motivo |
|---|---|---|---|
| FA1 | B01 | aprovado | Fiel ao V1 e ao V2A (dívida, passageiro, Laura, Vince no booth, cinquenta mil). Não adianta o forro. 67 s. Obs. baixa: o nome **Kai** não aparece no FA1, e *"a passenger"* já mostra que ele é motorista. |
| FA2 | B01 | **reprovado** | Ver R3-1 |
| FB1 | B01 | **reprovado** | Ver R3-2 |
| FB2 | B01 | **reprovado** | Ver R3-3 |
| FB2 | B02 | aprovado | *"Same thing he'd said at the airport, with his hand on my shoulder."* é fiel ao V1 B03 (*"he grabbed my shoulder… 'I'm sorry.'"*) e deixa a P1 explícita. A P4 continua intacta. 51 s |

## Problemas da Rodada 3

### R3-1. FA2 B01: falta o que está em jogo (média)
> *"I'm Kai, I drive rideshare, and a passenger left two hundred grand in my trunk. At an all-night diner, his daughter Laura begged me to keep it safe, and a guy named Vince offered me fifty grand for it."*

Não diz que o Kai estava com o aluguel atrasado nem que a Laura ofereceu cinco mil. Depois o B02 fala em *"the five thousand"* e em *"No five grand meant no payment"*, e o preço do final (o carro recolhido) fica sem causa para quem chegou direto.
**Correção sugerida:** *"I'm Kai, I drive rideshare, I was three weeks behind on my rental, and a passenger left two hundred grand in my trunk. At an all-night diner, his daughter Laura offered me five grand to keep it safe till morning, and a guy named Vince offered me fifty grand for it."* (uns +5 s, para ~67 s)

### R3-2. FB1 B01: a Laura e a dívida não aparecem (média)
> *"I'm Kai. I drive rideshare. I found two hundred grand in my trunk and took it to the police. At the station, the passenger's boss offered me twenty thousand dollars…"*

O B02 diz *"Laura made this sound"* sem que se saiba quem ela é (só o B03 sugere, com *"her dad"*). O carro recolhido no B03 também perde a causa, porque a dívida não foi dita.
**Correção sugerida:** *"I'm Kai. I drive rideshare, and I was three weeks behind on my rental. I found two hundred grand in my trunk and took it to the police. My passenger's daughter, Laura, showed up swearing her dad didn't steal it. Then his boss offered me twenty thousand dollars to sign a statement and go home. But his theft report had a problem."* (~+6 s, para ~71 s)

### R3-3. FB2 B01: Harold preso e Laura soltos (média)
> *"Laura didn't look at me when I left."* … *"Harold stayed in jail."*

O recap não diz que o passageiro se chama Harold, que ele foi preso pelo furto nem quem é a Laura. A dívida está bem coberta por *"caught up on the car… paid off the hospital"*.
**Correção sugerida:** depois de *"like you're supposed to."*, acrescentar *"By then my passenger, Harold, had been arrested for stealing it, and his daughter, Laura, swore he didn't."* (~+5 s, para ~71 s)

Os acréscimos podem baixar a nota do JEV, como aconteceu no V2A e no FA1. Se baixar, a saída que funcionou no V2A foi levar a apresentação para uma fala. Os três blocos continuam abaixo de 78 s.

---

# Rodada 4 (01/11/2026): recapitulações de FA2, FB1 e FB2 reescritas (rodada 6 do `REVISAO_INGLES.md`)

Os 3 blocos reprovados na Rodada 3 foram relidos dentro dos seus caminhos e **aprovados**. Com isso, os 31 blocos da H01 estão aprovados na história.

| Nó | Bloco | Veredito | Motivo |
|---|---|---|---|
| FA2 | B01 | aprovado | Fiel ao V2A: dívida do aluguel, cinco mil para guardar até de manhã, cinquenta mil do Vince. Dá causa ao *"No five grand meant no payment"* do B02. Sem spoiler. 65 s (R3-1 resolvido) |
| FB1 | B01 | aprovado | Fiel ao V2B: dívida, polícia, Laura como filha do passageiro, *"her dad's boss"* sem ambiguidade. Sem spoiler. 72 s (R3-2 resolvido) |
| FB2 | B01 | aprovado | Fiel ao V2B: Harold preso antes da chegada do Kai, a Laura jurando inocência, a dívida. *"Laura didn't look at me"* e *"Harold stayed in jail"* agora se apoiam no recap. 73 s (R3-3 resolvido) |

**Problemas novos:** nenhum. Uma observação baixa, igual à do FA1: o nome **Kai** saiu das recapitulações. No FA2 ele ainda aparece no B02 (*"You must be Kai"*). No FB1 e no FB2, o nome não aparece em nenhuma narração. *"A passenger"* e *"the ride receipt"* já mostram que ele é motorista, então o final se entende. FB1 B01 (72 s) e FB2 B01 (73 s) estão perto do teto de 78 s: conferir na simulação da voz.
