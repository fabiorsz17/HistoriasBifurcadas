# Lições das Histórias Bifurcadas

O agente lê este arquivo **no início de toda tarefa** e os revisores o usam como parte da lista de qualidade.

**Como registrar:** toda correção do usuário vira uma entrada, no mesmo momento, com data, o que foi corrigido, a regra geral e quando vale.
- **"observação":** correção isolada.
- **"regra":** o usuário repetiu o pedido ou disse que vale sempre.
- **Contradição com uma lição antiga:** mostrar o conflito ao usuário, não escolher sozinho.

**Limite:** nenhuma lição enfraquece a trava da ElevenLabs, os tetos de gasto, a autorização para instalar ferramentas ou a proteção das chaves.

## Preferências do usuário
| Data | Preferência | Origem |
|---|---|---|
| 01/11/2026 | Personagem estilo boneco de traço simples e cabeça grande, cenário rico, contorno brilhante na thumbnail (referência enviada pelo usuário); personagem original, nunca cópia de outro canal. | usuário |
| 01/11/2026 | Protagonista: proposta 1 com moletom mostarda (VIS-002). Mudança no visual dele só com aprovação. | usuário |
| 01/11/2026 | Canal em inglês americano (LANG-001), em país neutro (CEN-001); toda correção de inglês vem explicada em português. | usuário |
| 01/11/2026 | Histórias com costumes e hábitos americanos (CUL-001), sem nomear lugares reais. | usuário |
| 01/11/2026 | Nunca ofender crença, raça ou orientação sexual (RES-001); vale também para gênero, deficiência, nacionalidade, idade e classe social. | usuário |
| 01/11/2026 | Na tela de escolha, a narração convida a escolher o vídeo da esquerda (A) ou da direita (B) (FMT-005). | usuário |
| 01/11/2026 | Vídeo em 16:9, entregue em 2K (2560x1440). | usuário |
| 01/11/2026 | Efeitos e trilhas só de bibliotecas que permitem monetizar, com a licença registrada. | usuário |
| 01/11/2026 | JEV para tirar vestígio de IA e auditar a narração e os pacotes de SEO, como no Zero a 100. | usuário |
| 01/11/2026 | O visual do Zero a 100 (giz, recorte de papel, personagens) não é usado aqui. | usuário |

## Lições herdadas do Zero a 100 Finanças (valem aqui)
| O que foi corrigido lá | Regra geral | Status |
|---|---|---|
| Linguagem de IA na narração | Filtro do JEV antes da voz e da publicação: humano ≥ 0,75 (mirar 0,80) e nenhuma regra forte. Escrever como se fala, com cena concreta. | regra |
| Perguntas novas do JEV davam alerta falso | Calibrar toda pergunta nova com um texto bom e um ruim de propósito antes de confiar nela. **As réguas de ficção ainda não foram calibradas.** | regra |
| Bloco acima do teto de créditos | Nunca cortar texto para caber; pedir ao usuário um teto maior. | regra |
| Cronologia presa a quadros fixos quebrava ao regravar a voz | Toda animação amarrada a palavras com `M('palavra', n)`; conferir a ocorrência certa de palavras repetidas. | regra |
| Texto saindo da caixa | Caixa com texto variável ajusta a fonte ao comprimento; conferir no estado final. | regra |
| Sobreposições só vistas depois do render | Quadros-chave a 50% antes do render: nada sobre a faixa da legenda, personagem inteiro, texto sem tocar outro objeto. | regra |
| Efeitos altos em relação à voz | Todo efeito passa por `NIVEL_EFEITOS`; efeito novo é nivelado antes (~−22 dB, pico −3 dB). | regra |
| Trilha alta | Trilha uns −8 dB abaixo do que parecia certo: com fala 0,032, nos respiros 0,072, vinheta e tela final 0,103 (ajustar de ouvido no piloto). | regra |
| `remotion still` falhando de vez em quando | Falha "An error occurred" isolada costuma ser do Chrome: repetir o quadro antes de mexer no código. | observação |

## Lições técnicas deste projeto
| Data | O que foi corrigido | Regra geral | Quando vale | Status |
|---|---|---|---|---|
| 01/11/2026 | No teste de câmera, a sobrancelha positiva deixou o susto com cara de bravo | No `rosto`, `sobr` negativa = surpresa ou preocupação; positiva = raiva. | Toda expressão | observação |
