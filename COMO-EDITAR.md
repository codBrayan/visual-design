# Como editar o site da Visual Design

Site estático: HTML, CSS e JS puro. Não tem build. O que está no repositório é o que vai pro ar.

```
index.html            textos, seções, contato
css/style.css         visual (cores no topo, em :root)
js/galeria.js         monta a galeria a partir do fotos.json
fotos.json            ← LISTA DE FOTOS (é aqui que você mexe no dia a dia)
img/logo-macaco.png   logo
img/trabalhos/        fotos dos trabalhos (.webp)
scripts/              script que deixa as fotos leves
```

## Ver o site no seu computador

O `fetch` do `fotos.json` não funciona abrindo o `index.html` com dois cliques (o navegador bloqueia `file://`). Rode um servidor local:

```bash
npm run dev
```

e abra o endereço que aparecer.

## Adicionar fotos

1. Na primeira vez: `npm install`
2. Coloque as fotos originais do celular em `fotos-originais/` (essa pasta não vai pro GitHub)
3. Rode `npm run fotos` e as versões leves aparecem em `img/trabalhos/`
4. Adicione cada uma no `fotos.json`:

```json
{
  "categorias": { ... },
  "fotos": [
    {
      "arquivo": "img/trabalhos/geladeira-preta.webp",
      "legenda": "Geladeira envelopada em preto fosco",
      "categoria": "decorativo"
    },
    {
      "arquivo": "img/trabalhos/vitrine-loja.webp",
      "legenda": "Adesivo de vitrine",
      "categoria": "vitrines"
    }
  ]
}
```

- A ordem no JSON é a ordem no site. Coloque as melhores primeiro.
- `categoria` precisa ser uma das chaves de `categorias`: `decorativo`, `automotivo`, `vitrines`, `pelicula`, `fachadas`.
- A `legenda` também vira o texto alternativo da imagem (acessibilidade e Google). Descreva o que aparece.
- Os filtros aparecem sozinhos quando existem fotos de pelo menos 2 categorias.
- Se o JSON tiver um erro (vírgula sobrando é o clássico), a galeria mostra o aviso do Instagram e o erro aparece no console (F12). Dá pra validar em jsonlint.com.

## Remover ou trocar foto

Apague a linha no `fotos.json` e o arquivo em `img/trabalhos/`. Commit e push.

## Publicar (GitHub Pages + domínio)

1. Suba o repositório no GitHub.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `root`.
3. Domínio próprio (ex.: `visualdesignpf.com.br`, compra no registro.br):
   - No Pages, em *Custom domain*, coloque o domínio. O GitHub cria um arquivo `CNAME` no repo.
   - No registro.br, no DNS do domínio, crie registros **A** apontando pra
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     e um **CNAME** `www` → `seu-usuario.github.io`.
   - Espere o DNS propagar (de minutos a algumas horas) e marque *Enforce HTTPS*.
4. Toda alteração depois disso é: editar → commit → push. Em ~1 minuto está no ar.

## Trocar textos, telefone ou cores

- Textos e telefone: `index.html`. O número aparece em `wa.me/5554992715783`, no `tel:` e no bloco `ld+json` do topo.
- Mensagem automática do WhatsApp: constante `MENSAGEM_WHATS` no topo do `js/galeria.js`.
- Cores: variáveis em `:root` no `css/style.css`.
