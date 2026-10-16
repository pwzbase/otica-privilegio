# Ótica Privilégio — site

Site da Ótica Privilégio (Caxias do Sul, RS). HTML, CSS e JavaScript puros, sem build: é só abrir o `index.html` ou publicar a pasta em qualquer hospedagem estática (GitHub Pages, Vercel, Netlify).

## Rodar localmente

```bash
python3 -m http.server 5173
# abra http://localhost:5173
```

## Onde editar

| O que | Arquivo |
| --- | --- |
| Número do WhatsApp, mensagem padrão, Instagram | `js/config.js` |
| Produtos da seção "Coleção" (nome, detalhe, categoria, foto) | `js/config.js` → `produtos` |
| Textos, seções, endereço, FAQ | `index.html` |
| Cores e fontes da marca | `css/style.css` → `:root` |
| Fotos | `assets/img/` (WebP, até ~1600px de largura) |

Todo link com o atributo `data-wa="mensagem"` abre o WhatsApp da loja já com a mensagem escrita. Cada produto gera a mensagem com o nome do modelo.

## Identidade

- Laranja Privilégio `#F5821F` e índigo `#2B2862` (cores do logo)
- Lobster Two Bold Italic para a marca "Privilégio"; Bricolage Grotesque para títulos e textos

## Fotos

As fotos em `assets/img/` são da própria loja, recortadas dos posts e stories do Instagram e tratadas (cor, contraste e nitidez). Prefixos:

- `loja-*`: fachada, vitrines e interior
- `arm-*`: armações (usadas na Coleção)
- `marca-*`: grifes (Carmim, Guess)
- `masc-*`: fotos masculinas

Para trocar uma foto, substitua o arquivo mantendo o mesmo nome. Fotos originais em alta resolução deixam o site mais nítido do que os prints.
