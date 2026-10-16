/*
  Configuração do site — edite aqui sem mexer no resto do código.
  - whatsapp: só números, com 55 + DDD
  - produtos: cada item vira um card na seção "Coleção" e abre o WhatsApp com a mensagem pronta
    categoria: "metal" | "acetato"
*/
window.PRIVILEGIO = {
  whatsapp: "5554999966842",
  mensagemPadrao: "Olá! Vim pelo site da Ótica Privilégio e gostaria de falar com um consultor.",
  instagram: "https://www.instagram.com/oticaprivilegio_caxiasdosul/",

  /*
    Unidades: horários por dia da semana (0 = domingo … 6 = sábado), formato "HH:MM-HH:MM" ou null (fechado).
    whatsapp/telefone: deixe "" quando não tiver.
  */
  unidades: [
    {
      id: "caxias",
      cidade: "Caxias do Sul",
      endereco: "Rua Sinimbu, 1670, loja 103, Centro",
      referencia: "No Pátio Eberle, ao lado da Estação dos Brinquedos.",
      whatsapp: "5554999966842",
      telefone: "(54) 99996-6842",
      instagram: "https://www.instagram.com/oticaprivilegio_caxiasdosul/",
      mapa: "Ótica Privilégio, Rua Sinimbu 1670, Caxias do Sul, RS",
      horarios: [null, "08:30-18:00", "08:30-18:00", "08:30-18:00", "08:30-18:00", "08:30-18:00", "09:00-14:00"]
    },
    {
      id: "farroupilha",
      cidade: "Farroupilha",
      endereco: "Av. Júlio de Castilhos, Centro",
      referencia: "",
      whatsapp: "5554996171763",
      telefone: "(54) 99617-1763",
      instagram: "https://www.instagram.com/oticaprivilegio_farroupilha/",
      mapa: "Ótica Privilégio, Av. Júlio de Castilhos, Farroupilha, RS",
      horarios: [null, "09:00-18:30", "09:00-18:30", "09:00-18:30", "09:00-18:30", "09:00-18:30", "08:30-16:00"]
    },
    {
      id: "carlos-barbosa",
      cidade: "Carlos Barbosa",
      endereco: "Rua Rio Branco, 51, Centro",
      referencia: "",
      whatsapp: "5554996011258",
      telefone: "(54) 99601-1258",
      instagram: "https://www.instagram.com/oticaprivilegiocarlosbarbosa/",
      mapa: "Ótica Privilégio, Rua Rio Branco 51, Carlos Barbosa, RS",
      horarios: [null, "09:00-18:30", "09:00-18:30", "09:00-18:30", "09:00-18:30", "09:00-18:30", "09:00-12:00"]
    }
  ],

  produtos: [
    { nome: "Modelo Amélia", detalhe: "Metal preto, aro arredondado", categoria: "metal", imagem: "assets/img/arm-amelia.webp" },
    { nome: "Gatinho Carmim", detalhe: "Acetato preto com hastes douradas", categoria: "acetato", imagem: "assets/img/marca-carmim.webp" },
    { nome: "Titanium", detalhe: "Leve, flexível e resistente à oxidação", categoria: "metal", imagem: "assets/img/arm-titanium.webp" },
    { nome: "Rosé trabalhado", detalhe: "Metal rosé com hastes texturizadas", categoria: "metal", imagem: "assets/img/arm-rose-detalhe.webp" },
    { nome: "Dourado e azul", detalhe: "Metal dourado com hastes em acetato azul", categoria: "metal", imagem: "assets/img/arm-dourada-azul.webp" },
    { nome: "Redondo com vinho", detalhe: "Metal claro, hastes vinho, lentes Poli Blue", categoria: "metal", imagem: "assets/img/arm-sacola.webp" }
  ]
};
