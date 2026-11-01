# Ficha de homologação — Remotion + React/SVG

- Origem oficial: https://github.com/remotion-dev/remotion ; https://www.remotion.dev/docs/.
- Versão/commit inspecionado: licença no branch principal, repositório em `dae1d38e70f4e1957bf34585718564fd43f6056a` em 21/10/2026. Ensaio fixado em Remotion 4.0.537 e React/ReactDOM 19.3.1.
- Mantenedor: Remotion.
- Licença e uso comercial: licença própria do Remotion, não licença open source OSI. Permite uso comercial gratuito para indivíduos e organizações de até 3 pessoas, segundo documentação oficial; o usuário informou estar nessa faixa. Crescimento da equipe ou mudança de operação exige reavaliação. Não revender derivado do software Remotion sob essa licença.
- React/ReactDOM: 19.3.1, MIT; dependências transitivas registradas em `AV/piloto/pnpm-lock.yaml` e inventário em `AV/piloto/auditoria/licencas-pnpm.json`.
- Assets/fontes: usar SVG próprio e fontes locais/sistema no ensaio; nenhum asset externo aprovado por esta ficha.
- Segurança/permissões: instalação local autorizada, com scripts de dependências desabilitados. `pnpm audit --audit-level high` não encontrou vulnerabilidades conhecidas. Comando de composição baixou automaticamente Chrome Headless Shell 157.0.8080.0 (~120 MB) em `node_modules/.remotion`; nenhuma conta ou segredo foi usado. A licença dos pacotes `@remotion/media` e `@remotion/compositor-win32-x64-msvc` não veio como arquivo próprio; avaliar distribuição futura com a licença oficial do conjunto.
- Compatibilidade: documentação oficial requer Node 16 ou superior; ambiente observado Node 24.19.0, pnpm 11.25.0, Windows 10 Pro, i7-2600K, 32 GB RAM e GTX 1050 Ti. Bundling, enumeração de composição, Studio local e render de um frame 1920×1080 foram concluídos. `schema-utils@4.8.1` declara peer webpack ^5.112.0, enquanto o bundler Remotion fixa webpack 5.105.0; sem falha observada no ensaio.
- Utilidade: alta para compor SVG/2D, animação e sincronização no piloto 60–90 s; inline SVG evita dependência de biblioteca de formas no primeiro ensaio.
- Alternativa aberta: React/HTML/SVG com ferramentas genéricas de navegador/FFmpeg poderia substituir Remotion, mas exigiria construir a linha do tempo e a renderização do zero; comparação de desempenho pendente.
- Custo: R$ 0 de licença informado para a faixa atual do usuário; sem geração paga observada. O teste baixou 241 pacotes e Chrome Headless Shell; não foi medido custo de produção audiovisual.
- Escopo recomendado: `AV/piloto`, instalações locais, versões exatas e lockfile.
- Parecer JEV: pendente; integração não verificada.
- Aprovação humana para instalação/ensaio: concedida pelo usuário nesta conversa.
- Status: **PASS_LOCAL_TECNICO** para composição SVG de três segundos; piloto de 60–90 segundos e publicação não realizados.
