# Lucas Martinez — Developer Portfolio Ultra

Primeira versão para avaliação, em português. Construída com React, TypeScript, Vite, Motion e CSS/Canvas. A prévia utiliza a estrutura gerenciada Bun/Hono; **a exportação para GitHub Pages é inteiramente estática, sem backend, banco, credenciais ou chamadas à API**.

## Rodar e editar

Requisito: Bun (https://bun.sh).

```sh
bun install
bun run dev
```

Abra http://localhost:4200. Não precisa configurar `.env` para este portfólio. A infraestrutura genérica do template não é utilizada pela página. Não coloque segredos em código frontend.

- Página e conteúdo: `packages/web/src/web/pages/portfolio.tsx`
- Estilo e responsividade: `packages/web/src/web/styles.css`
- Partículas: `packages/web/src/web/components/digital-field.tsx`
- Imagens e fontes: `packages/web/public/`
- Direção visual: `design.md`

## Gerar versão estática

```sh
bun run build
bun run build:pages
```

A pasta `github-pages/` conterá `index.html`, `.nojekyll`, CSS/JS, imagens, fontes e o script de analytics padrão da prévia. A exportação ajusta seu caminho para funcionar também em subpastas. Todos os caminhos de assets são relativos. Não copie `.env`, código de servidor, `node_modules` ou arquivos internos para o Pages.

## Publicar no GitHub Pages — somente quando você decidir

Para não substituir o portfólio atual, **crie primeiro outro repositório**, por exemplo `portfolio-ultra-preview`.

1. Extraia o ZIP `lucas-martinez-github-pages.zip`.
2. Envie **o conteúdo** extraído para a raiz do novo repositório (não uma pasta extra envolvendo `index.html`). Inclua `.nojekyll`.
3. Em **Settings → Pages**, selecione **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Aguarde o próprio GitHub disponibilizar o endereço do Pages.

A mesma saída funciona na raiz do repositório `LucasMartinez96.github.io`, mas **não substitua o site original antes de aprovar esta versão e fazer backup**. Nenhuma alteração ou publicação foi feita por esta entrega.

Não abra `index.html` diretamente com `file://`; módulos ES precisam de servidor HTTP. Para testar localmente a exportação: `python3 -m http.server 8080 --directory github-pages`.

## Recursos

- Nome pixel art com entrada progressiva, retrato autorizado e HUD de identidade.
- Terminal demonstrativo das quatro áreas, sem executar comandos ou expor sistemas.
- Cinco projetos preservados, filtros, inclinação no desktop e imagens ampliadas em diálogo acessível.
- Navegação por seções, menu móvel, botão de copiar GitHub e estado ativo.
- Canvas leve, grade em perspectiva CSS, animações de entrada e revelação.
- Preferência `prefers-reduced-motion`, botão para desativar movimento e persistência local.
- Imagens WebP, carregamento tardio da galeria, fontes locais e separação de bundles.

## Fidelidade, direitos e privacidade

Textos e capturas foram verificados em https://lucasmartinez96.github.io/ e https://github.com/LucasMartinez96 em 29/10/2026. O retrato foi fornecido e autorizado pelo titular nesta conversa. O avatar geométrico do GitHub não foi apresentado como foto.

Os desafios e recursos descrevem somente o que já aparece publicamente; não foram acrescentados resultados, métricas, empregos, certificações ou níveis de proficiência. As capturas já têm conteúdo operacional protegido e não foram recriadas como dashboards funcionais. Exposição de material de terceiros continua sujeita à autorização do titular.

As fontes Manrope, Silkscreen e IBM Plex Mono são distribuídas sob SIL Open Font License; licenças em `packages/web/public/fonts/`. Mantido o analytics padrão do template Runable; considere a política de privacidade correspondente ao publicar. Não há formulário de coleta de dados pessoais.

## Verificação

Build e lint aprovados. Navegador Chromium: larguras 360, 390, 768 e 1440 px, sem overflow horizontal; filtros, diálogo/Escape, menu, cópia do GitHub, persistência de movimento e movimento reduzido. Exportação testada em raiz e subpasta, com imagens e fontes locais. Isso não equivale a teste físico em todos os aparelhos Android; recomenda-se avaliar no seu celular antes da publicação final.
