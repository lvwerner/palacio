# Palácio Sushi Experience — landing page (demonstração)

Página estática em HTML, CSS e JavaScript puros. Não tem build, framework, backend nem coleta de dados.
O formulário de reserva só monta uma mensagem e abre o WhatsApp.

> **Versão de demonstração.** Está com `noindex` e `robots.txt` bloqueando buscadores.
> Só libere depois da aprovação do restaurante (checklist no fim).

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | Conteúdo e SEO (title, Open Graph, JSON-LD) |
| `styles.css` | Visual. As cores ficam no bloco `:root`, no topo |
| `main.js` | Menu, formulário → WhatsApp, galeria, métricas |
| `config.js` | **O que você mais vai editar**: número, mensagens, horários, links, métricas |
| `assets/` | Fontes, favicon, `og-image.jpg`, `qr-palacio.svg`, fotos |
| `robots.txt`, `sitemap.xml` | Bloqueados na demo, com instruções de go-live comentadas |
| `CONTEUDO_A_CONFIRMAR.md` | Tudo o que depende do dono |
| `PROPOSTA.md` | Resumo de 1 página para apresentar |

## Ver no computador

Abra a pasta em um servidor local (o mapa e as fontes não funcionam bem com `file://`):

```
npx http-server . -p 8080
```

Depois acesse `http://localhost:8080`.

## Editar o conteúdo

**Número, mensagens e horários:** tudo em `config.js`, com comentários em cada campo.
Quando o dono confirmar o WhatsApp, mude `whatsappConfirmado` para `true` e o aviso some da página.

**Textos pendentes:** procure por `[CONFIRMAR` no `index.html`. Troque o `<span class="confirmar">[CONFIRMAR: ...]</span>` inteiro pelo texto real. A lista completa está em `CONTEUDO_A_CONFIRMAR.md`.

**Nota do Google e seguidores:** bloco `prova` do `config.js`. Atualize também `coletadoEm`.

**Depoimentos:** há um modelo comentado na seção Depoimentos do `index.html`. Só publique com autorização por escrito.

**Cores:** quando o logo oficial chegar, ajuste `--ouro`, `--ouro-meio`, `--ouro-escuro`, `--noite` e `--grafite` em `styles.css`. Mantenha contraste AA (texto escuro sobre o dourado dos botões).

**Logo:** hoje é um logo provisório em SVG. Para usar o oficial, troque o conteúdo de `<a class="logo">` (cabeçalho) e de `<div class="logo logo--rodape">` (rodapé) por:

```html
<img src="assets/logo.png" width="160" height="48" alt="Palácio Sushi Experience">
```

## Trocar as fotos

Use apenas fotos próprias ou autorizadas pela casa. Nada de Instagram de terceiros ou banco de imagens sem licença.

1. Exporte cada foto na proporção 4:5 em dois tamanhos (600 e 1200 px de largura), em AVIF, WebP e JPG. Para ampliar na galeria, exporte também uma versão de 1600 px. O [Squoosh](https://squoosh.app) faz isso de graça.
2. Salve em `assets/fotos/`.
3. Na galeria, troque o `<span class="foto foto--arco">…</span>` por:

```html
<span class="foto foto--arco">
  <picture>
    <source type="image/avif" srcset="assets/fotos/salao-600.avif 600w, assets/fotos/salao-1200.avif 1200w" sizes="(min-width: 600px) 25vw, 50vw">
    <source type="image/webp" srcset="assets/fotos/salao-600.webp 600w, assets/fotos/salao-1200.webp 1200w" sizes="(min-width: 600px) 25vw, 50vw">
    <img src="assets/fotos/salao-600.jpg" width="600" height="750" loading="lazy" decoding="async" alt="Salão principal com mesas postas e luz baixa">
  </picture>
</span>
```

4. No `<button class="galeria__item">` correspondente, acrescente `data-full="assets/fotos/salao-1600.jpg"` para a ampliação.
5. No hero, faça o mesmo dentro de `<div class="hero__foto">`, mas **sem** `loading="lazy"` e com `fetchpriority="high"`, trocando `sizes` por `(min-width: 960px) 400px, 340px`. Remova o `role="img"` e o `aria-label` do bloco.
6. Troque `assets/og-image.jpg` por uma foto real de 1200 × 630.

Escreva o `alt` descrevendo o que aparece na foto.

## QR Code

`assets/qr-palacio.svg` aponta hoje para `https://SEU-DOMINIO.com.br/?utm_source=qrcode&utm_medium=mesa`, que é um endereço provisório. **Gere de novo com o domínio final antes de imprimir:**

```
npx qrcode -t svg -o assets/qr-palacio.svg "https://DOMINIO-FINAL/?utm_source=qrcode&utm_medium=mesa"
```

Teste com a câmera do celular antes de mandar para a gráfica.

## Links de divulgação com UTM

Use estes endereços para saber de onde vêm as visitas:

- Bio do Instagram: `https://DOMINIO-FINAL/?utm_source=instagram&utm_medium=bio`
- Stories: `https://DOMINIO-FINAL/?utm_source=instagram&utm_medium=stories`
- Perfil do Google: `https://DOMINIO-FINAL/?utm_source=google&utm_medium=perfil`
- QR Code nas mesas: `https://DOMINIO-FINAL/?utm_source=qrcode&utm_medium=mesa`

## Ativar métricas

Em `config.js`, preencha `ga4Id` (Google Analytics 4) e/ou `metaPixelId` (Meta Pixel). Com os campos vazios, nenhum script externo é carregado.

Eventos enviados:

| Evento | Quando dispara |
|---|---|
| `click_whatsapp` | Toque em qualquer botão de reserva ou link de WhatsApp (o parâmetro `local` diz qual) |
| `submit_reserva` | Formulário válido enviado, WhatsApp aberto |
| `click_como_chegar` | Toque em "Como chegar" |
| `click_cardapio` | Toque em "Cardápio delivery" |

Cada evento leva junto `utm_source`, `utm_medium` e `utm_campaign` da visita, quando existirem.

**Atenção (LGPD):** GA4 e Meta Pixel usam cookies. Ao ativar, inclua um aviso de cookies com opção de recusa e uma política de privacidade. A página não traz isso hoje porque, sem os IDs, não coleta nada.

## Publicar de graça

Qualquer uma das três opções serve. Todas dão HTTPS e aceitam domínio próprio.

**Cloudflare Pages**
1. Crie uma conta em pages.cloudflare.com.
2. "Create a project" → "Direct Upload" → arraste a pasta inteira.
3. Sem comando de build. Diretório de saída: a raiz.

**Netlify**
1. Entre em app.netlify.com/drop.
2. Arraste a pasta. O site sobe na hora.

**Vercel**
1. Rode `npx vercel` dentro da pasta e siga as perguntas (framework: "Other").

Para a demonstração, o endereço gratuito gerado (`*.pages.dev`, `*.netlify.app`, `*.vercel.app`) basta. O `noindex` impede que ele apareça no Google.

## Checklist de go-live

- [ ] Dono aprovou textos, fotos e valores.
- [ ] Nenhum `[CONFIRMAR` restante: busque no `index.html` e no `config.js`.
- [ ] `whatsapp` confirmado e `whatsappConfirmado: true` em `config.js`.
- [ ] Logo oficial, fotos reais e `og-image.jpg` real no lugar.
- [ ] `SEU-DOMINIO.com.br` trocado em `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD), `config.js`, `sitemap.xml` e `robots.txt`.
- [ ] **Removida** a linha `<meta name="robots" content="noindex, nofollow">` e o comentário acima dela.
- [ ] `robots.txt` trocado pelo bloco de go-live.
- [ ] Removido o aviso "Versão de demonstração" do rodapé.
- [ ] QR Code gerado de novo com o domínio final e testado.
- [ ] Reserva de teste feita no celular (Android e iPhone), chegando no WhatsApp certo.
- [ ] Site cadastrado no perfil do Google (Google Meu Negócio), com o link de UTM do Google.
- [ ] Link da bio do Instagram trocado pelo link de UTM do Instagram.
- [ ] Nota do Google e seguidores atualizados em `config.js`.
- [ ] Se for ativar métricas: IDs preenchidos, aviso de cookies e política de privacidade publicados.

## Créditos

Fontes Cormorant Garamond e Manrope, licença SIL Open Font License 1.1, hospedadas em `assets/fonts/`.
