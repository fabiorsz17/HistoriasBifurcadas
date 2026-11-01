# Decisões — Histórias Bifurcadas

| Código | Data | Decisão | Quem decidiu |
|---|---|---|---|
| FMT-001 | 01/11/2026 | Formato em árvore: V1 → 2 vídeos → 4 finais (7 vídeos por história), de 3 a 5 min cada, ligados pela tela final. | usuário |
| FMT-002 | 01/11/2026 | 16:9, entrega em 2560x1440 a 30 fps; revisão em 1080p. | usuário |
| FMT-003 | 01/11/2026 | Os últimos ~20 s de todo vídeo que bifurca são a tela de escolha (espaço para os quadros da tela final). | proposta do Claude, aceita no plano |
| FMT-004 | 01/11/2026 | Cada final revela um pedaço diferente do segredo da história; só quem vê os 4 entende tudo. | proposta do Claude, aceita no plano |
| VIS-001 | 01/11/2026 | Estilo: boneco de traço simples, cabeça grande, cenário rico, glow na thumbnail; personagem original. Visual do Zero a 100 fora. | usuário |
| AUD-001 | 01/11/2026 | Efeitos e trilhas só de fontes que permitem monetizar, com a licença registrada. | usuário |
| GOV-001 | 01/11/2026 | Base técnica copiada e adaptada do Zero a 100 Finanças (Remotion, rig, JEV, trava da ElevenLabs, subagentes, skills de animação, efeitos CC0). Trilhas, visual, orquestrador e chaves ficaram lá. | usuário ("Sim, copiar a base") |
| GOV-002 | 01/11/2026 | O usuário aprova cada etapa; o orquestrador automático do Zero a 100 não foi trazido. | proposta do Claude, aceita |
| VIS-002 | 01/11/2026 | Protagonista aprovado: `Personagem.jsx`, proposta 1, roupa A (moletom mostarda com capuz e bolso canguru); redemoinho no cabelo é a marca. | usuário |
| NIC-001 | 01/11/2026 | Nicho: dilemas de vida (pessoas comuns diante de escolhas morais e de vida, com consequências). | usuário |
| LANG-001 | 01/11/2026 | Canal para o público de língua inglesa: narração, textos de tela e SEO em inglês americano. Correção pelo agente `revisor-ingles`, com explicação em português. | usuário |
| CEN-001 | 01/11/2026 | Cenário em país neutro: nenhum país, estado, cidade, agência ou lei real nas histórias; todo texto que aparece na tela é em inglês. | usuário |
| FMT-005 | 01/11/2026 | Dinâmica do canal ensinada em todo vídeo: explicação fixa no V1, mapa da árvore, aviso de escolha, tela de escolha padronizada (A à esquerda, B à direita, com narração fixa) e contador de finais (skill `bifurcadas-arvore`). | usuário pediu; formato proposto pelo Claude |
| FMT-006 | 01/11/2026 | Tela de escolha em cena: personagem de costas na bifurcação, olhando os dois caminhos e virando para o espectador ("e aí?"); molduras A (esquerda, azul) e B (direita, laranja) para os vídeos da tela final. Componente `TelaEscolha`. | usuário (ideia), Claude (execução) |
| CUL-001 | 01/11/2026 | Temas, situações e diálogos seguem costumes e hábitos americanos (casa no subúrbio, diner, aluguel, dívida de faculdade, gorjeta, seguro-saúde, motorista de aplicativo, feriados de família), dentro do país neutro da CEN-001: a cultura é americana, mas sem nomear lugares nem instituições reais. | usuário |
| RES-001 | 01/11/2026 | Nenhum vídeo ou diálogo pode ofender crença ou religião, raça ou etnia, orientação sexual ou identidade de gênero. O Claude estendeu a regra a deficiência, nacionalidade, idade e classe social. Sem estereótipos: vilão nunca é definido por esses traços, nenhuma piada com eles. | usuário (ampliado pelo Claude) |
| TEM-001 | 01/11/2026 | Tema fixo do canal: escolhas e consequências. Toda escolha custa algo dos dois lados; toda consequência é plausível e proporcional; nenhum final é castigo nem sermão. | usuário |
