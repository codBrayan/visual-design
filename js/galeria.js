/*
 * Galeria de trabalhos
 * --------------------
 * Lê o arquivo fotos.json e monta a galeria, os filtros e o lightbox.
 * Pra adicionar ou remover fotos você NÃO precisa mexer neste arquivo,
 * só no fotos.json (veja COMO-EDITAR.md).
 */

const MENSAGEM_WHATS = "Olá! Vi o site da Visual Design e quero um orçamento.";

const galeria = document.querySelector(".galeria");
const filtros = document.querySelector(".filtros");
const vazio = document.querySelector(".galeria-vazia");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxLegenda = lightbox.querySelector(".lightbox-legenda");

// Todos os links de WhatsApp já abrem com uma mensagem pronta.
// Fica aqui (e não no HTML) pra mensagem ser trocada num lugar só.
document.querySelectorAll("[data-whats]").forEach((link) => {
  link.href += "?text=" + encodeURIComponent(MENSAGEM_WHATS);
});

document.getElementById("ano").textContent = new Date().getFullYear();

carregar();

async function carregar() {
  try {
    const resposta = await fetch("fotos.json", { cache: "no-cache" });
    if (!resposta.ok) throw new Error(`fotos.json respondeu ${resposta.status}`);
    const dados = await resposta.json();

    // Ignora itens incompletos em vez de quebrar a página inteira
    const fotos = (dados.fotos || []).filter((f) => f && f.arquivo);
    const categorias = dados.categorias || {};

    if (fotos.length === 0) {
      vazio.hidden = false;
      return;
    }

    montarFiltros(fotos, categorias);
    montarGaleria(fotos);
  } catch (erro) {
    // Se o JSON tiver erro de digitação, o site continua funcionando
    // e o motivo aparece no console do navegador (F12).
    console.error("Galeria não carregou:", erro);
    vazio.hidden = false;
  }
}

function montarGaleria(fotos) {
  const fragmento = document.createDocumentFragment();

  fotos.forEach((foto) => {
    const item = document.createElement("li");
    item.dataset.categoria = foto.categoria || "";

    const botao = document.createElement("button");
    botao.type = "button";
    botao.setAttribute("aria-label", `Ampliar: ${foto.legenda || "foto do trabalho"}`);

    const img = document.createElement("img");
    img.src = foto.arquivo;
    img.alt = foto.legenda || "";
    img.loading = "lazy";      // só baixa a foto quando ela chega perto da tela
    img.decoding = "async";

    // textContent (e não innerHTML) pra nenhum texto do JSON virar código na página
    const legenda = document.createElement("span");
    legenda.className = "legenda";
    legenda.textContent = foto.legenda || "";

    botao.append(img, legenda);
    botao.addEventListener("click", () => abrir(foto));
    item.append(botao);
    fragmento.append(item);
  });

  galeria.append(fragmento);
}

function montarFiltros(fotos, categorias) {
  // Só mostra botão das categorias que têm pelo menos uma foto
  const usadas = [...new Set(fotos.map((f) => f.categoria).filter(Boolean))];
  if (usadas.length < 2) return; // com uma categoria só, filtro não serve pra nada

  const opcoes = [["", "Todos"], ...usadas.map((c) => [c, categorias[c] || c])];

  opcoes.forEach(([valor, nome], i) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = nome;
    botao.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    botao.addEventListener("click", () => filtrar(valor, botao));
    filtros.append(botao);
  });
}

function filtrar(categoria, botaoAtivo) {
  filtros.querySelectorAll("button").forEach((b) => {
    b.setAttribute("aria-pressed", b === botaoAtivo ? "true" : "false");
  });
  galeria.querySelectorAll("li").forEach((li) => {
    li.hidden = categoria !== "" && li.dataset.categoria !== categoria;
  });
}

function abrir(foto) {
  lightboxImg.src = foto.arquivo;
  lightboxImg.alt = foto.legenda || "";
  lightboxLegenda.textContent = foto.legenda || "";
  lightbox.showModal(); // <dialog> nativo: já prende o foco e fecha com Esc
}

lightbox.querySelector(".lightbox-fechar").addEventListener("click", () => lightbox.close());
// Clicar fora da foto também fecha
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});
