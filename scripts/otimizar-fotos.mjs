/*
 * Otimiza as fotos antes de subir pro site.
 *
 * Uso:
 *   1. Coloque as fotos originais (jpg, png, heic do iPhone não) em  fotos-originais/
 *   2. Rode:  npm run fotos
 *   3. As versões leves (.webp, até 1600px) aparecem em  img/trabalhos/
 *
 * Por quê: foto de celular tem 4–8 MB. Em WebP com 1600px fica em ~200 KB,
 * e o site abre rápido até no 4G.
 */
import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const ENTRADA = "fotos-originais";
const SAIDA = "img/trabalhos";
const LARGURA_MAX = 1600;
const QUALIDADE = 78;
const EXTENSOES = new Set([".jpg", ".jpeg", ".png", ".webp"]);

await mkdir(SAIDA, { recursive: true });

let arquivos;
try {
  arquivos = await readdir(ENTRADA);
} catch {
  console.error(`Crie a pasta "${ENTRADA}" e coloque as fotos lá dentro.`);
  process.exit(1);
}

const fotos = arquivos.filter((a) => EXTENSOES.has(parse(a).ext.toLowerCase()));
if (fotos.length === 0) {
  console.log(`Nenhuma foto em "${ENTRADA}".`);
  process.exit(0);
}

for (const arquivo of fotos) {
  // Nome sem espaço nem acento, pra não quebrar o link no site
  const nome = parse(arquivo).name
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const destino = join(SAIDA, `${nome}.webp`);

  const info = await sharp(join(ENTRADA, arquivo))
    .rotate() // respeita a orientação da câmera (foto deitada/em pé)
    .resize({ width: LARGURA_MAX, withoutEnlargement: true })
    .webp({ quality: QUALIDADE })
    .toFile(destino);

  console.log(`✓ ${destino}  (${Math.round(info.size / 1024)} KB)`);
}

console.log(`\nPronto. Agora adicione cada foto no fotos.json.`);
