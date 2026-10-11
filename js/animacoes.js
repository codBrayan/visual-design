/*
 * Animações do site
 * -----------------
 * Céu estrelado, elementos aparecendo ao rolar, topo com vidro
 * e luz seguindo o mouse nos cards. Nada aqui é obrigatório:
 * se este arquivo falhar, o site continua funcionando.
 */

document.documentElement.classList.add("js");

// Elementos com .revelar aparecem suavemente quando entram na tela
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visivel");
    observador.unobserve(e.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".revelar").forEach((el, i) => {
  // pequeno atraso em cascata entre irmãos (ex.: cards lado a lado)
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  observador.observe(el);
});

// Topo ganha fundo de vidro depois de rolar um pouco
const topo = document.querySelector(".topo");
const atualizarTopo = () => topo.classList.toggle("rolou", window.scrollY > 20);
window.addEventListener("scroll", atualizarTopo, { passive: true });
atualizarTopo();

// Luz que segue o mouse dentro dos cards
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - r.left}px`);
    card.style.setProperty("--y", `${e.clientY - r.top}px`);
  });
});

// Céu estrelado, como o fundo do logo
const canvas = document.querySelector(".estrelas");
const ctx = canvas.getContext("2d");
let estrelas = [];

function criarEstrelas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const total = Math.round((innerWidth * innerHeight) / 7000);
  estrelas = Array.from({ length: total }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.3 + 0.2,
    fase: Math.random() * Math.PI * 2,
    vel: Math.random() * 0.02 + 0.005,
  }));
}

function desenhar() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  estrelas.forEach((s) => {
    s.fase += s.vel;
    ctx.globalAlpha = 0.35 + Math.sin(s.fase) * 0.35;
    ctx.fillStyle = s.r > 1.2 ? "#9BE9F6" : "#FFFFFF";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(desenhar);
}

criarEstrelas();
desenhar();
window.addEventListener("resize", criarEstrelas);
