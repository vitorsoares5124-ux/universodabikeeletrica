/* Motos do carrossel do hero (ordem alfabética do que existe na pasta). */
const MOTOS = [
  { src: "assets/img/motos/bike.png", w: 1448, h: 1086 },
  { src: "assets/img/motos/bike 2.png", w: 1423, h: 1105 },
  { src: "assets/img/motos/bike3.png", w: 1374, h: 1145 },
  { src: "assets/img/motos/scooter 2.png", w: 1122, h: 1402, escala: 0.82 },
  { src: "assets/img/motos/scooter.png", w: 1217, h: 1293, escala: 0.82 }
];

/* Carrossel infinito do hero: primeira imagem aparece instantânea,
   restante carrega em background — sem esperar Promise.all para exibir. */
function initCarrossel() {
  const pista = document.getElementById("pista");
  if (!pista || !MOTOS.length) return;
  const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const validas = [];
  let carrosselIniciado = false;

  function montarImg(m, i, img) {
    img.alt = "";
    img.draggable = false;
    img.width = m.w;
    img.height = m.h;
    if (m.escala) {
      img.style.width  = (m.escala * 100) + "%";
      img.style.height = (m.escala * 100) + "%";
    }
    img.className = "slide";
    return img;
  }

  function iniciarRotacao() {
    if (parado || validas.length < 2 || carrosselIniciado) return;
    carrosselIniciado = true;
    let atual = 0;
    (function troca() {
      setTimeout(function () {
        const prox = (atual + 1) % validas.length;
        validas[atual].classList.remove("ativa");
        validas[atual].classList.add("saindo");
        validas[prox].classList.add("ativa");
        setTimeout(function () {
          validas[atual].classList.remove("saindo");
          atual = prox;
          troca();
        }, 500);
      }, 1500);
    })();
  }

  /* Primeira imagem: prioridade máxima — exibe imediatamente ao carregar */
  const primeiroImg = new Image();
  if ("fetchPriority" in primeiroImg) primeiroImg.fetchPriority = "high";
  primeiroImg.src = MOTOS[0].src;
  primeiroImg.onload = function () {
    montarImg(MOTOS[0], 0, primeiroImg);
    primeiroImg.classList.add("ativa");
    pista.appendChild(primeiroImg);
    validas.push(primeiroImg);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    /* Carrega o resto em background */
    MOTOS.slice(1).forEach(function (m, idx) {
      const img = new Image();
      img.src = m.src;
      img.onload = function () {
        montarImg(m, idx + 1, img);
        pista.appendChild(img);
        validas.push(img);
        iniciarRotacao();
      };
    });
  };
  primeiroImg.onerror = function () {
    /* fallback: comportamento antigo se a primeira falhar */
    MOTOS.slice(1).forEach(function (m, idx) {
      const img = new Image();
      img.src = m.src;
      img.onload = function () {
        montarImg(m, idx + 1, img);
        if (!validas.length) img.classList.add("ativa");
        pista.appendChild(img);
        validas.push(img);
        iniciarRotacao();
      };
    });
  };
}
/* WHATSAPP — NÚMERO OFICIAL ÚNICO DO SITE
   Número oficial: 5527988977716 (Serra & Vila Velha) */
const WHATSAPP_NUMERO = "5527988977716";
const WHATSAPP_MENSAGEM = "Olá! Vim pelo site e quero ver os modelos.";

(function () {
  "use strict";

  function linkWa() {
    const numero = String(WHATSAPP_NUMERO).replace(/\D/g, "");
    return "https://wa.me/" + numero + "?text=" + encodeURIComponent(WHATSAPP_MENSAGEM);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const numeroPadrao = String(WHATSAPP_NUMERO).replace(/\D/g, "");
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      const numEspecifico = a.getAttribute("data-wa-num");
      const numDestino = (numEspecifico && numEspecifico.replace(/\D/g, "")) || numeroPadrao;
      const msg = a.getAttribute("data-wa-msg") || WHATSAPP_MENSAGEM;
      a.setAttribute("href", "https://wa.me/" + numDestino + "?text=" + encodeURIComponent(msg));
    });
    montarJsonLd(numeroPadrao);
    initFormCidade();

    const header = document.querySelector(".header");
    if (header) {
      const onScroll = function () { header.classList.toggle("rolado", window.scrollY > 8); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    /* Configuração central do GSAP e ScrollTrigger */
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      var mm = gsap.matchMedia();
      mm.add({
        desktop: "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 860px) and (prefers-reduced-motion: no-preference)"
      }, function (ctx) {
        var isDesktop = ctx.conditions.desktop;

        initDestaques();
        montarPilha(isDesktop ? 0.94 : 0.96);
        initMarcas();
        initProdutos(isDesktop);
        initVitrineAnim();
        montarPassos(!isDesktop);
        initLocalizacao(isDesktop);
        initCobertura();
        initFaqAnim();
        initCta();

        return function () {
          ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
        };
      });
    }

    initCarrossel();
    initVitrineCarrossel();
    initLightbox();
    setupRefresh();
  });

  /* JSON-LD LocalBusiness montado a partir da constante do WhatsApp */
  function montarJsonLd(numero) {
    const dados = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Universo da Bike Elétrica",
      "url": "./",
      "telephone": "+" + numero,
      "description": "Scooters, bicicletas, patinetes e triciclos elétricos no Espírito Santo e na Bahia, com entrega em casa e aula prática.",
      "areaServed": [
        { "@type": "State", "name": "Espírito Santo" },
        { "@type": "State", "name": "Bahia" }
      ]
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(dados);
    document.head.appendChild(el);
  }

  /* Form de cidade */
  function initFormCidade() {
    const form = document.getElementById("cidade-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const campo = document.getElementById("cidade");
      const cidade = ((campo && campo.value) || "").trim().slice(0, 60);
      const msg = cidade
        ? "Oi! Moro em " + cidade + ". Vocês entregam aí?"
        : "Oi! Quero saber se vocês entregam na minha cidade.";
      const numero = String(WHATSAPP_NUMERO).replace(/\D/g, "");
      window.open("https://wa.me/" + numero + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  }

  /* 1. Destaques (abaixo do hero) */
  function initDestaques() {
    gsap.from(".destaque", {
      opacity: 0,
      y: 35,
      duration: 1.1,
      stagger: 0.14,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".destaques",
        start: "top 90%",
        end: "bottom 10%",
        toggleActions: "play reverse play reverse"
      }
    });
  }

  /* 2. Pilha de diferenciais */
  function montarPilha(escalaFim) {
    const cards = gsap.utils.toArray(".dif");
    if (!cards.length) return;

    // Garante que todos os cards comecem 100% visíveis e claros
    cards.forEach(function (card) {
      gsap.set(card, { scale: 1, opacity: 1, filter: "brightness(1)", "--sombra": 0 });
    });

    cards.forEach(function (card, i) {
      if (i === cards.length - 1) return;
      const nextCard = cards[i + 1];
      const topo = parseFloat(getComputedStyle(nextCard).top) || (96 + (i + 1) * 20);

      // O card atual começa 100% claro e só escurece/diminui conforme o próximo card o sobrepõe
      gsap.fromTo(card,
        { scale: 1, filter: "brightness(1)", "--sombra": 0 },
        {
          scale: escalaFim,
          filter: "brightness(0.65)",
          "--sombra": 0.4,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: nextCard,
            start: "top 70%",
            end: "top " + (topo + 10) + "px",
            scrub: true
          }
        }
      );
    });

    const cont = document.querySelector(".cont21");
    if (cont) {
      const num = { v: 0 };
      ScrollTrigger.create({
        trigger: ".dif--parc",
        start: "top 75%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse",
        onEnter: function () {
          gsap.to(num, {
            v: 21,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: function () { cont.textContent = Math.round(num.v); },
            onComplete: function () { cont.textContent = "21"; }
          });
        },
        onLeaveBack: function () {
          cont.textContent = "0";
        }
      });
    }
  }

  /* 3. Seção Marcas */
  function initMarcas() {
    gsap.from("#marcas-t", {
      opacity: 0,
      y: 35,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#marcas",
        start: "top 88%",
        end: "bottom 12%",
        toggleActions: "play reverse play reverse"
      }
    });

    gsap.from(".parede .linha", {
      opacity: 0,
      y: 35,
      duration: 1.0,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".parede",
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse"
      }
    });

    gsap.from(".creditos li", {
      opacity: 0,
      y: 25,
      duration: 0.9,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".creditos",
        start: "top 88%",
        end: "bottom 12%",
        toggleActions: "play reverse play reverse"
      }
    });

    // Destaque dinâmico das marcas ao passar pelo centro da tela
    const linhas = gsap.utils.toArray(".parede .linha");
    const secao = document.querySelector(".marcas");
    if (secao && linhas.length) {
      function escolherAtiva() {
        const r = secao.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) {
          linhas.forEach(function (li) { li.classList.remove("is-active"); });
          return;
        }
        const meio = window.innerHeight / 2;
        let melhor = null;
        let menor = Infinity;
        linhas.forEach(function (li) {
          const lr = li.getBoundingClientRect();
          const d = Math.abs(lr.top + lr.height / 2 - meio);
          if (d < menor) { menor = d; melhor = li; }
        });
        linhas.forEach(function (li) { li.classList.toggle("is-active", li === melhor); });
      }

      ScrollTrigger.create({
        trigger: ".marcas",
        start: "top bottom",
        end: "bottom top",
        onUpdate: escolherAtiva,
        onLeave: escolherAtiva,
        onLeaveBack: escolherAtiva,
        onRefresh: escolherAtiva
      });
      escolherAtiva();
    }

    const lojaBloco = document.getElementById("loja-bloco");
    if (lojaBloco) {
      gsap.from(lojaBloco, {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: lojaBloco,
          start: "top 88%",
          end: "bottom 12%",
          toggleActions: "play reverse play reverse"
        }
      });
    }
  }

  /* 4. Produtos */
  function initProdutos(isDesktop) {
    gsap.from("#produtos-t", {
      opacity: 0,
      y: 35,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#produtos",
        start: "top 88%",
        end: "bottom 12%",
        toggleActions: "play reverse play reverse"
      }
    });

    const cards = gsap.utils.toArray(".grid-prod .card");
    if (!cards.length) return;

    if (isDesktop) {
      cards.forEach(function (card, i) {
        const direcaoX = (i % 2 === 0) ? -40 : 40;
        gsap.from(card, {
          opacity: 0,
          y: 45,
          x: direcaoX,
          duration: 1.25,
          delay: (i % 2) * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse"
          }
        });
      });
    } else {
      cards.forEach(function (card, i) {
        gsap.from(card, {
          opacity: 0,
          y: 35,
          duration: 1.05,
          delay: i * 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse"
          }
        });
      });
    }
  }

  /* 5. Vitrine — Revelação de Título e Rodapé */
  function initVitrineAnim() {
    gsap.from(".vitrine-head > *", {
      opacity: 0,
      y: 35,
      duration: 1.1,
      stagger: 0.14,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".vitrine",
        start: "top 88%",
        end: "bottom 12%",
        toggleActions: "play reverse play reverse"
      }
    });

    gsap.from(".vitrine-rodape > *", {
      opacity: 0,
      y: 25,
      duration: 0.9,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".vitrine-rodape",
        start: "top 92%",
        end: "bottom 8%",
        toggleActions: "play reverse play reverse"
      }
    });
  }

  /* Vitrine — Carrossel Infinito Suave com Arraste, Inércia e Retomada Automática */
  let vitrinePausado = false;
  let vitrinePos = 0;
  let vitrineHalfWidth = 0;
  let vitrineRafId = null;

  function initVitrineCarrossel() {
    const container = document.getElementById("vitrine-carrossel");
    const pista = document.getElementById("vitrine-pista");
    if (!container || !pista) return;

    // Clona os itens uma vez para criar a esteira contínua infinita
    const itensOriginais = Array.from(pista.children);
    if (!itensOriginais.length) return;

    itensOriginais.forEach(function (item) {
      const clone = item.cloneNode(true);
      pista.appendChild(clone);
    });

    function calcularLargura() {
      let w = 0;
      for (let i = 0; i < itensOriginais.length; i++) {
        w += itensOriginais[i].offsetWidth + 20; // 20px gap
      }
      vitrineHalfWidth = w;
    }

    calcularLargura();
    window.addEventListener("resize", calcularLargura, { passive: true });

    const velocidadePadrao = 0.95; // pixels por frame
    let velocidadeAtual = velocidadePadrao;
    let isArrastando = false;
    let startX = 0;
    let startPos = 0;
    let lastX = 0;
    let lastTime = 0;
    let velInercia = 0;
    let distanciaTotalArrasto = 0;

    // Loop contínuo de animação suave
    function loop() {
      if (!vitrinePausado) {
        if (!isArrastando) {
          if (Math.abs(velInercia) > 0.05) {
            vitrinePos += velInercia;
            velInercia *= 0.93; // atrito suave de inércia
          } else {
            vitrinePos -= velocidadeAtual;
          }

          if (vitrineHalfWidth > 0) {
            if (vitrinePos <= -vitrineHalfWidth) {
              vitrinePos += vitrineHalfWidth;
            } else if (vitrinePos > 0) {
              vitrinePos -= vitrineHalfWidth;
            }
          }

          pista.style.transform = "translate3d(" + vitrinePos + "px, 0, 0)";
        }
      }
      vitrineRafId = requestAnimationFrame(loop);
    }

    vitrineRafId = requestAnimationFrame(loop);

    // Controles de Arraste (Mouse e Touch)
    function iniciarArrasto(clientX) {
      isArrastando = true;
      startX = clientX;
      startPos = vitrinePos;
      lastX = clientX;
      lastTime = performance.now();
      velInercia = 0;
      distanciaTotalArrasto = 0;
    }

    function moverArrasto(clientX) {
      if (!isArrastando) return;
      const deltaX = clientX - startX;
      distanciaTotalArrasto += Math.abs(clientX - lastX);

      const agora = performance.now();
      const dt = agora - lastTime;
      if (dt > 8) {
        velInercia = (clientX - lastX) * (16 / Math.max(dt, 16));
        lastX = clientX;
        lastTime = agora;
      }

      vitrinePos = startPos + deltaX;
      if (vitrineHalfWidth > 0) {
        if (vitrinePos <= -vitrineHalfWidth) vitrinePos += vitrineHalfWidth;
        else if (vitrinePos > 0) vitrinePos -= vitrineHalfWidth;
      }
      pista.style.transform = "translate3d(" + vitrinePos + "px, 0, 0)";
    }

    function finalizarArrasto() {
      if (!isArrastando) return;
      isArrastando = false;
      // Retomada automática instantânea
    }

    // Mouse
    container.addEventListener("mousedown", function (e) {
      iniciarArrasto(e.clientX);
    });
    window.addEventListener("mousemove", function (e) {
      if (isArrastando) {
        e.preventDefault();
        moverArrasto(e.clientX);
      }
    });
    window.addEventListener("mouseup", function () {
      finalizarArrasto();
    });

    // Touch
    container.addEventListener("touchstart", function (e) {
      if (e.touches && e.touches.length) {
        iniciarArrasto(e.touches[0].clientX);
      }
    }, { passive: true });
    window.addEventListener("touchmove", function (e) {
      if (isArrastando && e.touches && e.touches.length) {
        moverArrasto(e.touches[0].clientX);
      }
    }, { passive: true });
    window.addEventListener("touchend", function () {
      finalizarArrasto();
    });

    // Hover no Desktop: desacelera suavemente para permitir visualização e clique
    container.addEventListener("mouseenter", function () {
      velocidadeAtual = 0.25;
    });
    container.addEventListener("mouseleave", function () {
      velocidadeAtual = velocidadePadrao;
    });

    // Clique na foto para abrir o Lightbox
    pista.addEventListener("click", function (e) {
      if (distanciaTotalArrasto > 8) return;
      const item = e.target.closest(".vitrine-item");
      if (!item) return;
      const idx = parseInt(item.dataset.index, 10);
      if (!isNaN(idx)) {
        abrirLightbox(idx);
      }
    });
  }

  /* Lightbox Modal de Ampliação */
  const TOTAL_FOTOS_VITRINE = 13;
  let fotoAtualVitrine = 0;

  function abrirLightbox(index) {
    fotoAtualVitrine = index;
    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const contador = document.getElementById("lightbox-contador");
    const linkWa = document.getElementById("lightbox-wa");
    if (!lightbox || !img) return;

    img.src = "assets/img/carrossel/" + (fotoAtualVitrine + 1) + ".jpg";
    if (contador) contador.textContent = (fotoAtualVitrine + 1) + " / " + TOTAL_FOTOS_VITRINE;
    if (linkWa) {
      const numero = String(WHATSAPP_NUMERO).replace(/\D/g, "");
      const msg = "Olá! Gostei da foto " + (fotoAtualVitrine + 1) + " da galeria de modelos e quero saber mais.";
      linkWa.href = "https://wa.me/" + numero + "?text=" + encodeURIComponent(msg);
    }

    lightbox.classList.add("ativa");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    vitrinePausado = true;
  }

  function fecharLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("ativa");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    vitrinePausado = false; // Retoma imediatamente
  }

  function navegarLightbox(direcao) {
    fotoAtualVitrine = (fotoAtualVitrine + direcao + TOTAL_FOTOS_VITRINE) % TOTAL_FOTOS_VITRINE;
    const img = document.getElementById("lightbox-img");
    const contador = document.getElementById("lightbox-contador");
    const linkWa = document.getElementById("lightbox-wa");
    if (img) {
      img.style.opacity = "0.4";
      img.src = "assets/img/carrossel/" + (fotoAtualVitrine + 1) + ".jpg";
      img.onload = function () { img.style.opacity = "1"; };
    }
    if (contador) contador.textContent = (fotoAtualVitrine + 1) + " / " + TOTAL_FOTOS_VITRINE;
    if (linkWa) {
      const numero = String(WHATSAPP_NUMERO).replace(/\D/g, "");
      const msg = "Olá! Gostei da foto " + (fotoAtualVitrine + 1) + " da galeria de modelos e quero saber mais.";
      linkWa.href = "https://wa.me/" + numero + "?text=" + encodeURIComponent(msg);
    }
  }

  function initLightbox() {
    const btnFechar = document.getElementById("lightbox-fechar");
    const overlay = document.getElementById("lightbox-overlay");
    const btnPrev = document.getElementById("lightbox-prev");
    const btnNext = document.getElementById("lightbox-next");

    if (btnFechar) btnFechar.addEventListener("click", fecharLightbox);
    if (overlay) overlay.addEventListener("click", fecharLightbox);
    if (btnPrev) btnPrev.addEventListener("click", function (e) { e.stopPropagation(); navegarLightbox(-1); });
    if (btnNext) btnNext.addEventListener("click", function (e) { e.stopPropagation(); navegarLightbox(1); });

    window.addEventListener("keydown", function (e) {
      const lightbox = document.getElementById("lightbox");
      if (!lightbox || !lightbox.classList.contains("ativa")) return;
      if (e.key === "Escape") fecharLightbox();
      if (e.key === "ArrowLeft") navegarLightbox(-1);
      if (e.key === "ArrowRight") navegarLightbox(1);
    });
  }

  /* 6. Como Funciona (Passos) */
  function montarPassos(vertical) {
    gsap.from("#passos-t", {
      opacity: 0,
      y: 35,
      duration: 1.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".passos",
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse"
      }
    });

    const passos = gsap.utils.toArray(".step");
    if (!passos.length) return;

    passos.forEach(function (li) {
      gsap.set(li, { opacity: 0.35 });
      const num = li.querySelector(".num");
      if (num) gsap.set(num, { color: "rgba(255,255,255,0.18)" });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".passos",
        start: vertical ? "top 82%" : "top 80%",
        end: vertical ? "center 45%" : "center 62%",
        scrub: 1.0
      }
    });

    if (vertical) {
      tl.fromTo(".preench", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 1 }, 0);
      tl.fromTo(".ponto", { top: "0%" }, { top: "100%", ease: "none", duration: 1 }, 0);
    } else {
      tl.fromTo(".preench", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
      tl.fromTo(".ponto", { left: "0%" }, { left: "100%", ease: "none", duration: 1 }, 0);
    }

    passos.forEach(function (li, i) {
      const pos = i * 0.20;
      const num = li.querySelector(".num");
      const h3 = li.querySelector("h3");
      const alvo = parseInt(num ? num.dataset.n : (i + 1), 10) || (i + 1);
      const cont = { v: 1 };

      tl.to(li, { opacity: 1, ease: "none", duration: 0.16 }, pos);
      if (num) {
        tl.to(num, { color: "#FF5B14", ease: "none", duration: 0.16 }, pos);
        tl.to(cont, {
          v: alvo,
          ease: "none",
          duration: 0.12,
          onUpdate: function () { num.textContent = Math.round(cont.v); }
        }, pos);
      }
      if (h3) {
        tl.fromTo(h3, { y: 8 }, { y: 0, ease: "none", duration: 0.16 }, pos);
      }
    });

    tl.fromTo(".passos-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, ease: "none", duration: 0.12 }, 0.80);
  }

  /* 6. Localização (Onde Estamos) */
  function initLocalizacao(isDesktop) {
    // Cabeçalho da seção
    gsap.from(".loc-head > *", {
      opacity: 0,
      y: 35,
      duration: 1.1,
      stagger: 0.14,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".localizacao",
        start: "top 88%",
        end: "bottom 12%",
        toggleActions: "play reverse play reverse"
      }
    });

    // Cards das duas lojas
    const cards = gsap.utils.toArray(".loc-card");
    cards.forEach(function (card, i) {
      const offsetX = isDesktop ? (i === 0 ? -40 : 40) : 0;
      gsap.from(card, {
        opacity: 0,
        y: 40,
        x: offsetX,
        duration: 1.25,
        delay: i * 0.16,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "bottom 10%",
          toggleActions: "play reverse play reverse"
        }
      });
    });
  }

  /* 7. Cobertura */
  function initCobertura() {
    gsap.from("#cobertura-t, .cob-abre", {
      opacity: 0,
      y: 35,
      duration: 1.1,
      stagger: 0.16,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#cobertura",
        start: "top 88%",
        end: "bottom 12%",
        toggleActions: "play reverse play reverse"
      }
    });

    document.querySelectorAll(".cob-bloco").forEach(function (bloco, i) {
      gsap.from(bloco, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        delay: i * 0.16,
        ease: "power2.out",
        scrollTrigger: {
          trigger: bloco,
          start: "top 90%",
          end: "bottom 10%",
          toggleActions: "play reverse play reverse"
        }
      });

      const chips = bloco.querySelectorAll(".cob-chips a");
      if (chips.length) {
        gsap.from(chips, {
          opacity: 0,
          scale: 0.88,
          y: 16,
          duration: 0.7,
          stagger: 0.05,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: bloco,
            start: "top 82%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse"
          }
        });
      }
    });

    gsap.from(".cob-acao", {
      opacity: 0,
      y: 30,
      duration: 1.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".cob-acao",
        start: "top 92%",
        end: "bottom 8%",
        toggleActions: "play reverse play reverse"
      }
    });
  }

  /* 7. FAQ */
  function initFaqAnim() {
    gsap.from(".faq-lado > *", {
      opacity: 0,
      y: 30,
      duration: 1.1,
      stagger: 0.14,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".faq",
        start: "top 88%",
        end: "bottom 12%",
        toggleActions: "play reverse play reverse"
      }
    });

    gsap.from(".faq-item", {
      opacity: 0,
      y: 30,
      duration: 0.95,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".faq-lista",
        start: "top 88%",
        end: "bottom 12%",
        toggleActions: "play reverse play reverse"
      }
    });
  }

  /* 8. CTA Final */
  function initCta() {
    const ctaBox = document.querySelector(".cta-box");
    if (!ctaBox) return;
    gsap.from(ctaBox, {
      opacity: 0,
      y: 45,
      scale: 0.95,
      duration: 1.3,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".cta",
        start: "top 88%",
        end: "bottom 12%",
        toggleActions: "play reverse play reverse"
      }
    });
  }

  /* Revalidação de dimensões */
  function setupRefresh() {
    if (!window.gsap || !window.ScrollTrigger) return;
    ScrollTrigger.refresh();
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
    if ("ResizeObserver" in window) {
      let esperaRo = null;
      let alturaRo = document.documentElement.scrollHeight;
      new ResizeObserver(function () {
        clearTimeout(esperaRo);
        esperaRo = setTimeout(function () {
          const agora = document.documentElement.scrollHeight;
          if (Math.abs(agora - alturaRo) > 2) {
            alturaRo = agora;
            ScrollTrigger.refresh();
          }
        }, 200);
      }).observe(document.body);
    }
  }
})();
