(() => {
  const cfg = window.PRIVILEGIO;
  const waLink = (msg, numero = cfg.whatsapp) =>
    `https://wa.me/${numero}?text=${encodeURIComponent(msg || cfg.mensagemPadrao)}`;

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
    ctaLente.dataset.wa = `Olá! Quero saber mais sobre ${l.nome}.`;
    ctaLente.href = waLink(ctaLente.dataset.wa);
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

  // ---------- Unidades ----------
  const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const hm = (t) => t.replace(":00", "h").replace(":", "h");
  const agoraBR = () => {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).map((x) => [x.type, x.value])
    );
    return { dia: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), min: Number(p.hour) * 60 + Number(p.minute) };
  };
  const minutos = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const status = (u) => {
    const { dia, min } = agoraBR();
    const hoje = u.horarios[dia];
    if (hoje) {
      const [ab, fe] = hoje.split("-");
      if (min >= minutos(ab) && min < minutos(fe)) return { aberto: true, texto: `Aberto agora · fecha às ${hm(fe)}` };
      if (min < minutos(ab)) return { aberto: false, texto: `Fechado agora · abre hoje às ${hm(ab)}` };
    }
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (u.horarios[d]) {
        const quando = i === 1 ? "amanhã" : dias[d].toLowerCase();
        return { aberto: false, texto: `Fechado agora · abre ${quando} às ${hm(u.horarios[d].split("-")[0])}` };
      }
    }
    return { aberto: false, texto: "Fechado" };
  };

  const abas = document.querySelector("[data-unidades-abas]");
  const painel = document.querySelector("[data-unidade]");
  const mapa = document.querySelector("[data-mapa]");
  const mostrarUnidade = (u) => {
    const s = status(u);
    const el = painel.querySelector("[data-status]");
    el.textContent = s.texto;
    el.classList.toggle("aberto", s.aberto);
    painel.querySelector("[data-endereco]").innerHTML = `${u.endereco}<br>${u.cidade}, RS`;
    const ref = painel.querySelector("[data-referencia]");
    ref.textContent = u.referencia;
    ref.hidden = !u.referencia;
    const hoje = agoraBR().dia;
    painel.querySelector("[data-horarios]").innerHTML = [1, 2, 3, 4, 5, 6, 0]
      .map((d) => {
        const h = u.horarios[d];
        return `<tr${d === hoje ? ' class="hoje"' : ""}><th scope="row">${dias[d]}</th><td>${h ? h.split("-").map(hm).join(" às ") : "Fechado"}</td></tr>`;
      })
      .join("");
    const rota = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(u.mapa)}`;
    const wa = u.whatsapp
      ? `<a class="botao botao--linha" href="https://wa.me/${u.whatsapp}?text=${encodeURIComponent(`Olá! Quero agendar uma visita na unidade ${u.cidade}.`)}" target="_blank" rel="noopener">Agendar visita</a>`
      : "";
    const tel = u.telefone && !u.whatsapp
      ? `<a class="botao botao--linha" href="tel:+55${u.telefone.replace(/\D/g, "")}">Ligar ${u.telefone}</a>`
      : "";
    const insta = u.instagram
      ? `<a class="botao botao--linha" href="${u.instagram}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-insta"/></svg><span>Instagram</span></a>`
      : "";
    painel.querySelector("[data-acoes]").innerHTML =
      `<a class="botao botao--escuro" href="${rota}" target="_blank" rel="noopener">Como chegar</a>${wa}${tel}${insta}`;
    mapa.src = `https://www.google.com/maps?q=${encodeURIComponent(u.mapa)}&output=embed`;
    mapa.title = `Mapa da unidade ${u.cidade}`;
  };
  abas.innerHTML = cfg.unidades
    .map((u, i) => `<button type="button" role="tab" id="aba-${u.id}" aria-selected="${i === 0}" data-id="${u.id}"><span class="ponto-status" aria-hidden="true"></span>${u.cidade}</button>`)
    .join("");
  const botoesAba = [...abas.querySelectorAll("[data-id]")];
  botoesAba.forEach((b) => {
    const u = cfg.unidades.find((x) => x.id === b.dataset.id);
    b.classList.toggle("aberto", status(u).aberto);
    b.addEventListener("click", () => {
      botoesAba.forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      painel.setAttribute("aria-labelledby", b.id);
      mostrarUnidade(u);
    });
  });
  painel.setAttribute("aria-labelledby", botoesAba[0].id);
  mostrarUnidade(cfg.unidades[0]);

  // ---------- Escolha da unidade antes do WhatsApp ----------
  const escolha = document.querySelector("[data-escolha]");
  const opcoesEscolha = escolha.querySelector("[data-escolha-opcoes]");
  const lerUltima = () => { try { return localStorage.getItem("privilegio-unidade"); } catch { return null; } };
  const salvarUltima = (id) => { try { localStorage.setItem("privilegio-unidade", id); } catch {} };

  const abrirEscolha = (msg) => {
    const ultima = lerUltima();
    opcoesEscolha.innerHTML = cfg.unidades
      .filter((u) => u.whatsapp)
      .map((u) => {
        const s = status(u);
        return `<li><a class="escolha__opcao${u.id === ultima ? " ultima" : ""}" data-unidade-id="${u.id}" href="${waLink(msg, u.whatsapp)}" target="_blank" rel="noopener">
          <span class="escolha__cidade">${u.cidade}</span>
          <span class="escolha__status${s.aberto ? " aberto" : ""}">${s.texto}</span>
          <svg aria-hidden="true"><use href="#i-whats"/></svg>
        </a></li>`;
      })
      .join("");
    escolha.showModal();
    (opcoesEscolha.querySelector(".ultima") || opcoesEscolha.querySelector("a")).focus();
  };

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-wa]");
    if (!link || typeof escolha.showModal !== "function") return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    abrirEscolha(link.dataset.wa);
  });
  opcoesEscolha.addEventListener("click", (e) => {
    const a = e.target.closest("[data-unidade-id]");
    if (!a) return;
    salvarUltima(a.dataset.unidadeId);
    escolha.close();
  });
  escolha.addEventListener("click", (e) => { if (e.target === escolha) escolha.close(); });
  escolha.querySelector("[data-escolha-fechar]").addEventListener("click", () => escolha.close());

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
