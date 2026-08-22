/* =============================================================
   CATAVENTOS — script.js
   JavaScript vanilla, sem dependências.
   ============================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1) Injetar o cata-vento (SVG) em todos os [data-pinwheel]
        a partir do <template> em index.html.
     --------------------------------------------------------- */
  const tpl = document.getElementById("pinwheel-template");
  if (tpl) {
    document.querySelectorAll("[data-pinwheel]").forEach(function (slot, i) {
      const svg = tpl.content.firstElementChild.cloneNode(true);
      // Escalonar o ritmo de rotação para não ficarem todos sincronizados
      svg.style.animationDuration = (10 + (i % 6) * 1.6) + "s";
      slot.appendChild(svg);
    });
  }

  /* ---------------------------------------------------------
     2) Estado da navegação ao fazer scroll
     --------------------------------------------------------- */
  const nav = document.getElementById("nav");
  const onScroll = function () {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------
     3) Menu móvel (abrir/fechar)
     --------------------------------------------------------- */
  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("navMobile");
  if (toggle && mobile) {
    const setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      mobile.hidden = !open;
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    // Fechar ao clicar num link
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
  }

  /* ---------------------------------------------------------
     4) Fade-in ao scroll (IntersectionObserver)
     --------------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------
     5) Scroll suave com compensação da barra fixa
     --------------------------------------------------------- */
  const navHeight = 74;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---------------------------------------------------------
     6) Formulário de reserva (demonstração — não envia dados)
     --------------------------------------------------------- */
  const form = document.getElementById("reservaForm");
  const note = document.getElementById("formNote");
  if (form && note) {
    // Impedir datas no passado
    const dataInput = form.querySelector("#data");
    if (dataInput) dataInput.min = new Date().toISOString().split("T")[0];

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const nome = (form.querySelector("#nome").value || "").trim().split(" ")[0];
      note.textContent = "Obrigado" + (nome ? ", " + nome : "") +
        "! Pedido recebido — entraremos em contacto para confirmar a mesa. 🍷";
      note.classList.add("is-success");
      form.reset();
    });
  }

  /* ---------------------------------------------------------
     7) Ano no rodapé
     --------------------------------------------------------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
