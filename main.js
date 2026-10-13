/*
 * Palácio Sushi Experience — comportamento da página
 * Sem backend: o formulário só monta um link do WhatsApp. Nada é salvo nem enviado.
 */
(function () {
  "use strict";

  var cfg = window.PALACIO_CONFIG || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- Links */
  function linkWhatsApp(texto) {
    return "https://wa.me/" + String(cfg.whatsapp || "").replace(/\D/g, "") +
      "?text=" + encodeURIComponent(texto);
  }

  function comUtm(url) {
    var utm = cfg.utmPadrao || {};
    try {
      var u = new URL(url);
      Object.keys(utm).forEach(function (k) { if (utm[k]) u.searchParams.set(k, utm[k]); });
      return u.toString();
    } catch (e) { return url; }
  }

  function formatarData(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function aplicarConfig() {
    var prova = cfg.prova || {};

    $$("[data-cfg]").forEach(function (el) {
      var chave = el.getAttribute("data-cfg");
      var valor = prova[chave] !== undefined ? prova[chave] : cfg[chave];
      if (!valor) return;
      if (chave === "coletadoEm") {
        el.setAttribute("datetime", valor);
        el.textContent = formatarData(valor);
      } else {
        el.textContent = valor;
      }
    });
    if (prova.coletadoEm) {
      $$("[data-coletado-em]").forEach(function (el) { el.setAttribute("data-coletado-em", prova.coletadoEm); });
    }

    $$("[data-cfg-href]").forEach(function (a) {
      var url = cfg[a.getAttribute("data-cfg-href")];
      if (url) a.href = a.hasAttribute("data-utm") ? comUtm(url) : url;
    });

    $$("[data-wa]").forEach(function (a) { a.href = linkWhatsApp(cfg.mensagemDireta || "Olá!"); });

    if (cfg.whatsappConfirmado) {
      $$("[data-aviso-whatsapp]").forEach(function (el) { el.hidden = true; });
    }
  }

  /* ---------------------------------------------------------------- Métricas
     Só carrega se houver ID em config.js. Sem ID, registrar() não faz nada. */
  function origemDaVisita() {
    var q = new URLSearchParams(location.search);
    var o = {};
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) { if (q.get(k)) o[k] = q.get(k); });
    return o;
  }

  function carregarMetricas() {
    if (cfg.ga4Id) {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(cfg.ga4Id);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", cfg.ga4Id);
    }
    if (cfg.metaPixelId && !window.fbq) {
      var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      var p = document.createElement("script");
      p.async = true;
      p.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(p);
      window.fbq("init", cfg.metaPixelId);
      window.fbq("track", "PageView");
    }
  }

  function registrar(evento, dados) {
    var params = Object.assign({}, origemDaVisita(), dados || {});
    if (typeof window.gtag === "function") window.gtag("event", evento, params);
    if (typeof window.fbq === "function") window.fbq("trackCustom", evento, params);
  }
  // Exposto para testes e para depuração no console.
  window.palacioRegistrar = registrar;

  function ligarRastreamento() {
    document.addEventListener("click", function (ev) {
      var el = ev.target.closest && ev.target.closest("[data-track]");
      if (!el) return;
      registrar(el.getAttribute("data-track"), { local: el.getAttribute("data-local") || "" });
    });
  }

  /* ---------------------------------------------------------------- Menu */
  function ligarMenu() {
    var botao = $(".menu__abrir");
    var menu = $("#menu");
    if (!botao || !menu) return;

    function definir(aberto) {
      menu.classList.toggle("aberto", aberto);
      botao.setAttribute("aria-expanded", String(aberto));
      $(".so-leitor", botao).textContent = aberto ? "Fechar menu" : "Abrir menu";
    }
    botao.addEventListener("click", function () { definir(botao.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (ev) { if (ev.target.closest("a")) definir(false); });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && botao.getAttribute("aria-expanded") === "true") { definir(false); botao.focus(); }
    });
  }

  /* ---------------------------------------------------------------- Reveal e barra fixa */
  function ligarObservadores() {
    var itens = $$("[data-revelar]");
    if (!("IntersectionObserver" in window)) {
      itens.forEach(function (el) { el.classList.add("visivel"); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visivel"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    itens.forEach(function (el) { obs.observe(el); });

    // A barra do celular some enquanto o formulário ou o rodapé estão na tela.
    var barra = $("#barra");
    var alvos = [$("#form-reserva"), $(".rodape")].filter(Boolean);
    if (barra && alvos.length) {
      var visiveis = new Set();
      var obsBarra = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target); });
        barra.classList.toggle("oculta", visiveis.size > 0);
      }, { threshold: 0.15 });
      alvos.forEach(function (el) { obsBarra.observe(el); });
    }
  }

  /* ---------------------------------------------------------------- Formulário de reserva */
  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  var MESES = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

  function dois(n) { return (n < 10 ? "0" : "") + n; }
  function isoLocal(d) { return d.getFullYear() + "-" + dois(d.getMonth() + 1) + "-" + dois(d.getDate()); }
  function minutos(hhmm) { var p = hhmm.split(":"); return Number(p[0]) * 60 + Number(p[1]); }

  function horariosDoDia(iso) {
    var ini = minutos(cfg.primeiroHorario || "18:00");
    var fim = minutos(cfg.ultimoHorario || "22:30");
    var passo = cfg.intervaloMinutos || 30;
    var agora = new Date();
    var corte = iso === isoLocal(agora) ? agora.getHours() * 60 + agora.getMinutes() : -1;
    var lista = [];
    for (var m = ini; m <= fim; m += passo) {
      if (m > corte) lista.push(dois(Math.floor(m / 60)) + ":" + dois(m % 60));
    }
    return lista;
  }

  // Só entram no seletor os dias em que a casa abre: o domingo nem aparece.
  function preencherDatas(select) {
    var abertos = cfg.diasAbertos || [1, 2, 3, 4, 5, 6];
    var total = cfg.diasDeAntecedencia || 45;
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    for (var i = 0; i < total; i++, d.setDate(d.getDate() + 1)) {
      if (abertos.indexOf(d.getDay()) === -1) continue;
      var iso = isoLocal(d);
      if (i === 0 && !horariosDoDia(iso).length) continue;
      var op = document.createElement("option");
      op.value = iso;
      op.textContent = (i === 0 ? "Hoje, " : i === 1 ? "Amanhã, " : "") +
        DIAS[d.getDay()] + ", " + d.getDate() + " de " + MESES[d.getMonth()];
      select.appendChild(op);
    }
  }

  function preencherHorarios(select, iso) {
    var atual = select.value;
    while (select.options.length > 1) select.remove(1);
    (iso ? horariosDoDia(iso) : horariosDoDia("")).forEach(function (h) {
      var op = document.createElement("option");
      op.value = h;
      op.textContent = h.replace(":00", "h").replace(":", "h");
      select.appendChild(op);
    });
    select.value = atual;
    if (select.selectedIndex < 0) select.value = "";
  }

  function dataPorExtenso(iso) {
    var p = iso.split("-").map(Number);
    var d = new Date(p[0], p[1] - 1, p[2], 12);
    return DIAS[d.getDay()] + ", " + dois(p[2]) + "/" + dois(p[1]) + "/" + p[0];
  }

  function montarMensagem(dados) {
    var texto = cfg.mensagemReserva ||
      "Reserva\nNome: {nome}\nData: {data}\nHorário: {horario}\nPessoas: {pessoas}\nObservações: {observacoes}";
    if (!dados.observacoes) {
      texto = texto.split("\n").filter(function (l) { return l.indexOf("{observacoes}") === -1; }).join("\n");
    }
    return texto
      .replace("{nome}", dados.nome)
      .replace("{data}", dataPorExtenso(dados.data))
      .replace("{horario}", dados.horario.replace(":00", "h").replace(":", "h"))
      .replace("{pessoas}", dados.pessoas)
      .replace("{observacoes}", dados.observacoes);
  }

  function ligarFormulario() {
    var form = $("#form-reserva");
    if (!form) return;
    var campos = {
      nome: $("#f-nome"), data: $("#f-data"), horario: $("#f-horario"),
      pessoas: $("#f-pessoas"), observacoes: $("#f-obs")
    };
    var status = $("#reserva-status");
    var maximo = cfg.maximoDePessoas || 30;

    campos.pessoas.max = maximo;
    preencherDatas(campos.data);
    preencherHorarios(campos.horario, "");
    campos.data.addEventListener("change", function () { preencherHorarios(campos.horario, campos.data.value); });

    function erro(nome, mensagem) {
      var campo = campos[nome];
      var p = $("#e-" + nome);
      if (mensagem) {
        campo.setAttribute("aria-invalid", "true");
        p.textContent = mensagem;
        p.hidden = false;
      } else {
        campo.removeAttribute("aria-invalid");
        p.textContent = "";
        p.hidden = true;
      }
      return !mensagem;
    }

    var regras = {
      nome: function (v) { return v.trim().length >= 2 ? "" : "Informe seu nome."; },
      data: function (v) {
        if (!v) return "Escolha o dia da reserva.";
        var p = v.split("-").map(Number);
        var dia = new Date(p[0], p[1] - 1, p[2], 12).getDay();
        return (cfg.diasAbertos || [1, 2, 3, 4, 5, 6]).indexOf(dia) === -1 ? "A casa não abre nesse dia." : "";
      },
      horario: function (v) { return v ? "" : "Escolha o horário."; },
      pessoas: function (v) {
        var n = Number(v);
        if (!v || !Number.isInteger(n) || n < 1) return "Informe quantas pessoas vão.";
        return n > maximo ? "Para mais de " + maximo + " pessoas, fale direto pelo WhatsApp." : "";
      }
    };

    Object.keys(regras).forEach(function (nome) {
      campos[nome].addEventListener("blur", function () {
        if (campos[nome].hasAttribute("aria-invalid")) erro(nome, regras[nome](campos[nome].value));
      });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var primeiro = null;
      Object.keys(regras).forEach(function (nome) {
        if (!erro(nome, regras[nome](campos[nome].value)) && !primeiro) primeiro = campos[nome];
      });
      if (primeiro) {
        status.className = "form__status form__status--erro";
        status.textContent = "Confira os campos destacados antes de enviar.";
        primeiro.focus();
        return;
      }

      var dados = {
        nome: campos.nome.value.trim(),
        data: campos.data.value,
        horario: campos.horario.value,
        pessoas: String(Number(campos.pessoas.value)),
        observacoes: campos.observacoes.value.trim()
      };
      var url = linkWhatsApp(montarMensagem(dados));

      registrar("submit_reserva", { pessoas: Number(dados.pessoas), dia_semana: DIAS[new Date(dados.data + "T12:00").getDay()] });
      window.open(url, "_blank", "noopener");

      status.className = "form__status";
      status.innerHTML = "";
      var titulo = document.createElement("strong");
      titulo.textContent = "Quase lá: falta enviar a mensagem.";
      var texto = document.createElement("span");
      texto.textContent = "Abrimos o WhatsApp com o pedido de " + dataPorExtenso(dados.data) + ", às " +
        dados.horario.replace(":00", "h").replace(":", "h") + ", para " + dados.pessoas +
        (dados.pessoas === "1" ? " pessoa" : " pessoas") +
        ". Toque em enviar por lá. A reserva só vale depois que a casa responder confirmando. ";
      var link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "O WhatsApp não abriu? Toque aqui.";
      status.appendChild(titulo);
      status.appendChild(texto);
      status.appendChild(link);
    });
  }

  /* ---------------------------------------------------------------- Galeria
     Uma moldura, o conteúdo troca sozinho. Tocar passa para a próxima imagem. */
  function ligarGaleria() {
    var moldura = $("[data-galeria]");
    if (!moldura) return;
    var imagens = $$("img", moldura);
    var legenda = $("[data-galeria-legenda]");
    if (imagens.length < 2) return;

    var atual = 0;
    var relogio = null;
    var naTela = false;
    var calmo = window.matchMedia("(prefers-reduced-motion: reduce)");

    function mostrar(i) {
      imagens[atual].classList.remove("ativa");
      atual = (i + imagens.length) % imagens.length;
      imagens[atual].classList.add("ativa");
      if (legenda) legenda.textContent = imagens[atual].getAttribute("data-legenda") || "";
    }
    function parar() { clearInterval(relogio); relogio = null; }
    function andar() {
      parar();
      if (naTela && !document.hidden && !calmo.matches) {
        relogio = setInterval(function () { mostrar(atual + 1); }, (cfg.galeriaSegundos || 3.2) * 1000);
      }
    }

    moldura.addEventListener("click", function () { mostrar(atual + 1); andar(); });
    document.addEventListener("visibilitychange", andar);
    if (calmo.addEventListener) calmo.addEventListener("change", andar);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entradas) {
        naTela = entradas[0].isIntersecting;
        andar();
      }, { threshold: 0.3 }).observe(moldura);
    } else {
      naTela = true;
      andar();
    }
  }

  /* ---------------------------------------------------------------- A casa está aberta agora?
     Conta pelo horário de Brasília, onde quer que a pessoa esteja. */
  function hora(hhmm) { return hhmm.replace(":00", "h").replace(":", "h"); }

  function agoraEmJoinville() {
    try {
      var partes = new Intl.DateTimeFormat("en-GB", {
        timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var v = {};
      partes.forEach(function (p) { v[p.type] = p.value; });
      return {
        dia: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(v.weekday),
        minuto: (Number(v.hour) % 24) * 60 + Number(v.minute)
      };
    } catch (e) {
      var d = new Date();
      return { dia: d.getDay(), minuto: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function textoDeAgora(a) {
    var abertos = cfg.diasAbertos || [1, 2, 3, 4, 5, 6];
    var abre = cfg.abre || "18:00";
    var fecha = cfg.fecha || "23:00";
    var hoje = abertos.indexOf(a.dia) !== -1;

    if (hoje && a.minuto >= minutos(abre) && a.minuto < minutos(fecha)) {
      return "Aberto agora, até as " + hora(fecha) + ".";
    }
    if (hoje && a.minuto < minutos(abre)) {
      var falta = minutos(abre) - a.minuto;
      var h = Math.floor(falta / 60), m = falta % 60;
      return "Abre hoje às " + hora(abre) + ". Faltam " + [h ? h + " h" : "", m ? m + " min" : ""].filter(Boolean).join(" ") + ".";
    }
    for (var i = 1; i <= 7; i++) {
      var dia = (a.dia + i) % 7;
      if (abertos.indexOf(dia) !== -1) {
        return "Fechado agora. Abre " + (i === 1 ? "amanhã" : (dia === 6 || dia === 0 ? "no " : "na ") + DIAS[dia]) + ", às " + hora(abre) + ".";
      }
    }
    return "";
  }
  // Exposto para testes e para depuração no console.
  window.palacioTextoDeAgora = textoDeAgora;

  function ligarAgora() {
    var alvos = $$("[data-agora]");
    if (!alvos.length) return;
    function atualizar() {
      var texto = textoDeAgora(agoraEmJoinville());
      if (texto) alvos.forEach(function (el) { if (el.textContent !== texto) el.textContent = texto; });
    }
    atualizar();
    setInterval(atualizar, 30000);
  }

  /* ---------------------------------------------------------------- Bilhete da reserva
     O canhoto do cupom mostra a mesa que a pessoa está montando no formulário. */
  function ligarBilhete() {
    var bilhete = $("[data-bilhete]");
    var form = $("#form-reserva");
    if (!bilhete || !form) return;
    var linhas = {
      pessoas: $('[data-b="pessoas"]', bilhete),
      data: $('[data-b="data"]', bilhete),
      horario: $('[data-b="horario"]', bilhete)
    };
    var padrao = {
      pessoas: linhas.pessoas.textContent, data: linhas.data.textContent, horario: linhas.horario.textContent
    };

    function escrever(chave, texto) {
      var el = linhas[chave];
      if (el.textContent === texto) return;
      el.textContent = texto;
      el.classList.remove("mudou");
      void el.offsetWidth;
      el.classList.add("mudou");
    }

    function atualizar() {
      var n = Number($("#f-pessoas").value);
      var data = $("#f-data").value;
      var horario = $("#f-horario").value;
      escrever("pessoas", Number.isInteger(n) && n >= 1 ? "Mesa para " + n : padrao.pessoas);
      if (data) {
        var p = data.split("-").map(Number);
        var d = new Date(p[0], p[1] - 1, p[2], 12);
        escrever("data", DIAS[d.getDay()] + ", " + p[2] + " de " + MESES[p[1] - 1]);
      } else {
        escrever("data", padrao.data);
      }
      escrever("horario", horario ? "às " + hora(horario) : padrao.horario);
    }

    form.addEventListener("input", atualizar);
    form.addEventListener("change", atualizar);
  }

  /* ---------------------------------------------------------------- Início */
  aplicarConfig();
  carregarMetricas();
  ligarRastreamento();
  ligarMenu();
  ligarObservadores();
  ligarFormulario();
  ligarGaleria();
  ligarAgora();
  ligarBilhete();
})();
