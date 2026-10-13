/*
 * Palácio Sushi Experience — configuração da página
 * Edite só este arquivo para trocar número, textos da mensagem, métricas e links.
 * Nada aqui é enviado a servidores: a página só monta um link do WhatsApp.
 */
window.PALACIO_CONFIG = {
  // ---------------------------------------------------------------- WhatsApp
  // Só dígitos, com 55 + DDD. Número listado no Google em 12/10/2026.
  // [CONFIRMAR] este é mesmo o WhatsApp de reservas?
  whatsapp: "5547992201210",
  // Mude para true quando o dono confirmar o número: o aviso some da página.
  whatsappConfirmado: false,

  // Mensagem enviada pelo formulário. Campos: {nome} {data} {horario} {pessoas} {observacoes}
  mensagemReserva: [
    "Olá! Gostaria de reservar uma mesa no Palácio Sushi Experience.",
    "",
    "Nome: {nome}",
    "Data: {data}",
    "Horário: {horario}",
    "Pessoas: {pessoas}",
    "Observações: {observacoes}",
    "",
    "Pedido enviado pelo site."
  ].join("\n"),

  // Mensagem dos links diretos ("Falar no WhatsApp"), sem formulário.
  mensagemDireta: "Olá! Vim pelo site e gostaria de reservar uma mesa no Palácio Sushi Experience.",

  // ---------------------------------------------------------------- Reservas
  // 0 = domingo ... 6 = sábado. Verificado no Google: segunda a sábado.
  diasAbertos: [1, 2, 3, 4, 5, 6],
  // Horário da casa (Google, 12/10/2026). Alimenta o aviso "Aberto agora / Abre hoje às 18h" do topo.
  abre: "18:00",
  fecha: "23:00",
  primeiroHorario: "18:00",
  // [CONFIRMAR] último horário em que a casa aceita reserva (a casa fecha às 23h).
  ultimoHorario: "22:30",
  intervaloMinutos: 30,
  // Quantos dias à frente aparecem no seletor de data.
  diasDeAntecedencia: 45,
  maximoDePessoas: 30,

  // ---------------------------------------------------------------- Prova rápida
  // Atualize quando os números mudarem. Data no formato AAAA-MM-DD.
  prova: {
    notaGoogle: "4,3",
    avaliacoesGoogle: "101",
    coletadoEm: "2026-10-12",
    seguidoresInstagram: "9 mil"
  },

  // ---------------------------------------------------------------- Links
  // [CONFIRMAR] domínio final. Usado no QR Code e nos links de divulgação.
  urlFinal: "https://SEU-DOMINIO.com.br/",
  instagram: "https://www.instagram.com/palacio_sushi_experience/",
  // Testado em 12/10/2026: o endereço COM o ponto abre o cardápio; sem o ponto dá "Loja não encontrada".
  cardapioDelivery: "https://pedir.delivery/app/palaciosushi./menu",
  comoChegar: "https://www.google.com/maps/dir/?api=1&destination=R.+Visconde+de+Taunay%2C+1174+-+Atiradores%2C+Joinville+-+SC%2C+89203-062",

  // UTM acrescentada aos links que saem da página para o cardápio delivery.
  utmPadrao: { utm_source: "site", utm_medium: "referral", utm_campaign: "landing" },

  // ---------------------------------------------------------------- Métricas
  // Deixe vazio para não carregar nada. Preencha para ativar.
  ga4Id: "",        // ex.: "G-XXXXXXXXXX"
  metaPixelId: "",  // ex.: "123456789012345"

  // ---------------------------------------------------------------- Rodapé
  creditoDesenvolvedor: "Vinicius Werner"
};
