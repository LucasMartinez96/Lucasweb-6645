/**
 * Exporta apenas o frontend estático para um GitHub Pages de projeto.
 * Execução: bun run build:pages (o build:web acontece antes deste script).
 * Não transfere servidor, variáveis de ambiente nem analytics do template.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dir, "..");
const source = join(root, "packages", "web", "dist");
const target = join(root, "github-pages");

if (!existsSync(join(source, "index.html"))) {
  throw new Error("Build web não encontrado: execute bun run build:web antes de exportar.");
}
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });

const indexPath = join(target, "index.html");
let html = readFileSync(indexPath, "utf8");
// A versão pública de demonstração não utiliza tracking da plataforma Runable.
html = html.replace(/<script\b[^>]*\bsrc=["'][^"']*runable\.js(?:\?[^"']*)?["'][^>]*>\s*<\/script>/gi, "");
html = html.replace(/(href|content)=(["'])\/(favicon\.(?:svg|ico)|og-image\.png)\2/g, '$1=$2./$3$2');
if (!/name=["']robots["']/.test(html)) {
  html = html.replace(/<head>/i, '<head>\n<meta name="robots" content="noindex,nofollow">');
}
writeFileSync(indexPath, html);
rmSync(join(target, "runable.js"), { force: true });

// Fonts em CSS do template têm caminhos absolutos na origem (/fonts/...).
// Em Pages de projeto, os caminhos precisam ser relativos a /assets/*.css.
const assetPath = join(target, "assets");
if (existsSync(assetPath)) {
  for (const name of readdirSync(assetPath).filter(file => file.endsWith(".css"))) {
    const file = join(assetPath, name);
    let css = readFileSync(file, "utf8");
    css = css.replace(/url\((["']?)\/fonts\/([^)"']+)\1\)/g, "url(../fonts/$2)");
    writeFileSync(file, css);
  }
}
writeFileSync(join(target, ".nojekyll"), "");
writeFileSync(join(target, "robots.txt"), "User-agent: *\nDisallow: /\n");
if (/runable\.js/i.test(readFileSync(indexPath, "utf8"))) {
  throw new Error("Analytics detectado na página exportada; publicação interrompida.");
}
if (!existsSync(join(target, "assets"))) {
  throw new Error("Arquivos CSS/JS não foram gerados; publicação interrompida.");
}
console.log("Exportação estática sem analytics: github-pages/");
