# Conteúdo a confirmar com o Palácio Sushi Experience

Tudo o que aparece na página como `[CONFIRMAR: ...]` está listado aqui.
Nada desta lista foi inventado: enquanto não houver resposta do dono, o marcador fica visível.

Dados verificados em 12/10/2026 (perfil público do Instagram e do Google Maps): nome, endereço, horário, telefone listado, faixa de preço, nota e número de avaliações, número aproximado de seguidores.

## 1. Bloqueiam a publicação

| # | O que confirmar | Onde entra |
|---|---|---|
| 1 | O número (47) 99220-1210 é o WhatsApp de reservas? | `config.js` → `whatsapp` e `whatsappConfirmado: true` |
| 2 | Aprovação do dono para publicar a página | remover `noindex` e liberar `robots.txt` |
| 3 | Domínio final | `config.js` → `urlFinal`; `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD); `sitemap.xml`; `robots.txt`; regerar o QR Code |
| 4 | Logo oficial (`assets/logo.png` ou SVG) | cabeçalho, rodapé, favicon, imagem de compartilhamento; ajustar a paleta em `styles.css` |
| 5 | Fotos próprias e autorizadas (1 do hero + 8 da galeria) | seções Hero e Galeria |

## 2. Rodízio

| # | O que confirmar | Onde entra |
|---|---|---|
| 6 | Valor do rodízio para adulto | Como funciona → Valores; FAQ |
| 7 | Valor e faixa de idade para criança | Como funciona → Valores; FAQ |
| 8 | Valor em sextas, sábados e datas especiais | Como funciona → Valores |
| 9 | O que é cobrado à parte (bebidas e outros) | Como funciona → Valores; FAQ |
| 10 | Como o rodízio é servido, tempo de mesa e regra de desperdício | Como funciona → passo 3; FAQ |
| 11 | Itens reais de cada categoria: sushis, sashimis, hots, temakis, frutos do mar, pratos quentes, sobremesas | O que você encontra (7 cards) |

## 3. Reservas

| # | O que confirmar | Onde entra |
|---|---|---|
| 12 | Política de reserva e tolerância de atraso | Como funciona → passo 1; FAQ |
| 13 | Último horário em que a casa aceita reserva (hoje a página oferece até 22h30) | `config.js` → `ultimoHorario` |
| 14 | Dias e horários de maior movimento | Como funciona → "Para não esperar" |
| 15 | Tamanho máximo de grupo pelo formulário (hoje: 30) | `config.js` → `maximoDePessoas` |

## 4. Casa e serviços

| # | O que confirmar | Onde entra |
|---|---|---|
| 16 | Estacionamento (próprio, conveniado ou na rua) | Como funciona → passo 2; Localização; FAQ |
| 17 | Acessibilidade (rampa, banheiro adaptado) | Como funciona → passo 2; Localização |
| 18 | Aniversários, grupos e eventos: o que a casa oferece e em que condições | A experiência → bloco 04; FAQ |
| 19 | Opções sem peixe cru, vegetarianas e cuidados com alergias | FAQ |
| 20 | Formas de pagamento | FAQ |
| 21 | História da casa, ano de abertura e nome dos responsáveis | A experiência → Sobre a casa |

## 5. Prova social

| # | O que confirmar | Onde entra |
|---|---|---|
| 22 | 3 depoimentos reais, com autorização por escrito de quem escreveu | Depoimentos (modelo comentado no HTML) |
| 23 | Atualizar nota do Google, número de avaliações e seguidores na data da publicação | `config.js` → `prova` |

## 6. Já conferido, sem pendência

- Link do cardápio delivery: o endereço **com o ponto** (`pedir.delivery/app/palaciosushi./menu`) abre o cardápio da casa. Sem o ponto aparece "Loja não encontrada". Testado em 12/10/2026.

## Textos que escrevi a partir dos temas das avaliações públicas

Vale o dono ler e aprovar, porque falam em nome da casa:

- "Um salão para ficar", "Peças frescas", "Atendimento atento" (seção A experiência).
- "Recomendamos [reservar], principalmente nos horários de pico" (FAQ).
- Título do hero: "Uma noite à altura de um palácio. Em Joinville."
