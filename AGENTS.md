# Regras operacionais — Histórias Bifurcadas

## Autoridade
- O usuário decide sobre estratégia, gastos, publicação e ações de risco.
- O executor é o Claude Code. Ele propõe e executa o que foi autorizado, e não presume capacidades de integrações sem testar.

## Restrições
1. Não instalar dependências, apps, skills ou MCPs sem validar licença, segurança e utilidade. Instalações ficam locais ao projeto.
2. Não comprar, vincular contas, acessar serviços pagos ou publicar sem autorização específica. Voz da ElevenLabs só pela trava (`narracao_unica.py`), com teto autorizado.
3. Não ler, exibir nem copiar chaves (`.secrets`, `*.dpapi`). O usuário cadastra cada chave com os scripts `Configurar-Chave-*.ps1`.
4. Conteúdo para público adulto e seguro para anunciantes. Nunca produzir algo que leve o vídeo a ser classificado como "para crianças".
5. Nenhuma imagem, personagem ou música de outro canal. O personagem do canal é original e aprovado pelo usuário.
6. Todo som e música usados têm a licença registrada (`AV/public/efeitos/LEIA.md`). Nunca CC-BY-NC.
7. **Respeito (RES-001), regra inegociável:** nenhum vídeo, diálogo, título ou miniatura ofende crença ou religião, raça ou etnia, orientação sexual, identidade de gênero, deficiência, nacionalidade, idade ou classe social. Nada de estereótipo nem de piada com esses traços, e nenhum personagem é vilão, ridículo ou "suspeito" por causa deles. Na dúvida, corta.
8. **Cultura (CUL-001):** temas e hábitos americanos (casa, trabalho, dinheiro, família, feriados), num país sem nome (CEN-001).
9. Registrar entregas relevantes em `CHECKPOINTS.md` (comando, resultado, custo, próximo passo) e decisões em `GOVERNANCA/DECISOES.md`.
