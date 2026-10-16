(() => {
  const cfg = window.PRIVILEGIO;
  const waLink = (msg) =>
    `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg || cfg.mensagemPadrao)}`;

  // Todo elemento com data-wa vira link do WhatsApp com mensagem pronta
  const ligarWhats = (raiz = document) => {
    raiz.querySelectorAll("[data-wa]").forEach((el) => {
      el.href = waLink(el.dataset.wa);
    });
  };

  // ---------- Coleção ----------
  const lista = document.querySelector("[data-produtos]");
  const nomesCategoria = { metal: "Metal", acetato: "Acetato" };

  lista.innerHTML = cfg.produtos
    .map((p) => `
      <li class="produto" data-categoria="${p.categoria}">
        <a data-wa="Olá! Vi no site o modelo ${p.nome} (${p.detalhe}). Ainda tem disponível?" target="_blank" rel="noopener">
          <div class="produto__img"><img src="${p.imagem}" alt="Armação ${p.nome}: ${p.detalhe}" loading="lazy" width="882" height="1200"></div>
          <div class="produto__info">
            <h3 class="produto__nome">${p.nome}</h3>
            <span class="produto__tipo">${nomesCategoria[p.categoria] || p.categoria}</span>
            <p class="produto__detalhe">${p.detalhe}</p>
          </div>
          <span class="produto__cta"><svg aria-hidden="true"><use href="#i-whats"/></svg>Quero este modelo</span>
        </a>
      </li>`)
    .join("");

  const filtros = document.querySelector("[data-filtros]");
  filtros.addEventListener("click", (e) => {
    const botao = e.target.closest("[data-filtro]");
    if (!botao) return;
    filtros.querySelectorAll("[data-filtro]").forEach((b) =>
      b.setAttribute("aria-selected", String(b === botao))
    );
    const f = botao.dataset.filtro;
    lista.querySelectorAll(".produto").forEach((li) => {
      li.hidden = f !== "todos" && li.dataset.categoria !== f;
    });
  });

  ligarWhats();

  // ---------- Lentes ----------
  const visor = document.querySelector("[data-visor]");
  const legenda = document.querySelector("[data-legenda]");
  const ctaLente = document.querySelector("[data-wa-lente]");
  const ctaTexto = document.querySelector("[data-lente-cta]");
  const lentes = {
    simples: { nome: "visão simples", legenda: "Nítido dentro da lente" },
    multifocal: { nome: "lente multifocal", legenda: "Longe e perto sem trocar de óculos" },
    azul: { nome: "filtro de luz azul", legenda: "Tom mais quente e confortável" },
    foto: { nome: "lente fotossensível", legenda: "Escureceu no sol" },
    polarizada: { nome: "lente polarizada", legenda: "Sem reflexo, cores mais vivas" }
  };
  const escolherLente = (chave) => {
    const l = lentes[chave];
    visor.dataset.efeito = chave;
    legenda.textContent = l.legenda;
    ctaTexto.textContent = `Perguntar sobre ${l.nome}`;
    ctaLente.href = waLink(`Olá! Quero saber mais sobre ${l.nome}.`);
  };
  const grupo = document.querySelector("[data-lentes]");
  const opcoes = [...grupo.querySelectorAll("[data-lente]")];
  const marcar = (botao, foco) => {
    opcoes.forEach((b) => {
      const ativo = b === botao;
      b.setAttribute("aria-checked", String(ativo));
      b.tabIndex = ativo ? 0 : -1;
    });
    if (foco) botao.focus();
    escolherLente(botao.dataset.lente);
  };
  opcoes.forEach((b, i) => {
    b.tabIndex = i === 0 ? 0 : -1;
    b.addEventListener("click", () => marcar(b));
    b.addEventListener("keydown", (e) => {
      const passo = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!passo) return;
      e.preventDefault();
      marcar(opcoes[(i + passo + opcoes.length) % opcoes.length], true);
    });
  });
  escolherLente("simples");

  // A lente acompanha o dedo / mouse dentro do visor
  const mover = (e) => {
    const r = visor.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - r.left) / r.width, 0.28), 0.72);
    const y = Math.min(Math.max((e.clientY - r.top) / r.height, 0.28), 0.72);
    visor.style.setProperty("--cx", `${x * 100}%`);
    visor.style.setProperty("--cy", `${y * 100}%`);
  };
  visor.addEventListener("pointermove", mover);
  visor.addEventListener("pointerdown", mover);
  visor.addEventListener("pointerleave", () => {
    visor.style.setProperty("--cx", "50%");
    visor.style.setProperty("--cy", "50%");
  });

  // ---------- Galeria da loja ----------
  const trilho = document.querySelector("[data-trilho]");
  document.querySelectorAll("[data-galeria]").forEach((b) =>
    b.addEventListener("click", () => {
      const foto = trilho.querySelector(".loja__foto");
      trilho.scrollBy({ left: Number(b.dataset.galeria) * (foto.offsetWidth + 24), behavior: "smooth" });
    })
  );

  // ---------- Menu móvel ----------
  const menuBotao = document.querySelector("[data-menu-botao]");
  const menuMovel = document.querySelector("[data-menu-movel]");
  const fecharMenu = () => {
    menuMovel.hidden = true;
    menuBotao.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  menuBotao.addEventListener("click", () => {
    const abrir = menuMovel.hidden;
    menuMovel.hidden = !abrir;
    menuBotao.setAttribute("aria-expanded", String(abrir));
    menuBotao.querySelector(".sr").textContent = abrir ? "Fechar menu" : "Abrir menu";
    document.body.style.overflow = abrir ? "hidden" : "";
  });
  menuMovel.addEventListener("click", (e) => { if (e.target.closest("a")) fecharMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menuMovel.hidden) { fecharMenu(); menuBotao.focus(); } });

  // ---------- Link ativo no menu + botão flutuante ----------
  const flutuante = document.querySelector(".whats-flutuante");
  const hero = document.querySelector(".hero");
  new IntersectionObserver(([entrada]) => {
    flutuante.classList.toggle("visivel", !entrada.isIntersecting);
  }, { threshold: 0.15 }).observe(hero);

  const links = [...document.querySelectorAll(".nav__links a")];
  const secoes = links.map((a) => document.querySelector(a.getAttribute("href")));
  const observaSecao = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => {
        if (a.getAttribute("href") === `#${en.target.id}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  secoes.forEach((s) => s && observaSecao.observe(s));

  document.querySelector("[data-ano]").textContent = new Date().getFullYear();
})();
