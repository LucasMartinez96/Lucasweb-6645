/**
 * Smoke test visual no GitHub Actions.
 * Browser disponível no runner + playwright-core em pasta temporária.
 * O servidor reproduz a subpasta pública /Lucasweb-6645/.
 */
import http from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
import { chromium } from 'playwright-core';

const dist = resolve(process.cwd(), 'github-pages');
const out = resolve(process.cwd(), 'preview-tests');
const prefix = '/Lucasweb-6645/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.txt': 'text/plain' };
await mkdir(out,{recursive:true});
const server = http.createServer(async (req,res) => {
  const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  const rel = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : '';
  const file = resolve(dist,rel || 'index.html');
  if(!file.startsWith(dist + sep)){res.writeHead(403);res.end();return}
  try {
    if(!(await stat(file)).isFile())throw Error('Not a file');
    res.writeHead(200, { 'content-type': mime[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {res.writeHead(404);res.end('Not Found')}
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
const url = 'http://127.0.0.1:' + server.address().port + prefix;
const bin = process.env.CHROME_BIN;
if(!bin)throw Error('Chrome/Chromium não encontrado no runner');
const browser=await chromium.launch({executablePath:bin,args:['--no-sandbox']});
const results=[];
try{
  for (const [name,width,height] of [['mobile360',360,780],['mobile390',390,844],['tablet',768,1024],['desktop',1440,900]]) {
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
    const failures=[];
    page.on('pageerror',err=>failures.push('JS: '+err.message));
    page.on('response',res=>{if(res.status()>=400)failures.push('HTTP '+res.status()+': '+res.url())});
    await page.goto(url,{waitUntil:'networkidle',timeout:40000});
    await page.waitForTimeout(300);
    // Imagens fora da tela ficam intencionalmente sem currentSrc enquanto lazy.
    // Percorre cada imagem antes de exigir carregamento completo.
    for (const img of await page.locator('img').all()) {
      await img.scrollIntoViewIfNeeded({timeout:10000});
      await img.evaluate(el => { el.loading = 'eager'; });
      await img.evaluate(el => el.decode().catch(() => {}));
    }
    await page.waitForTimeout(220);
    const data=await page.evaluate(()=>({
      width:document.documentElement.clientWidth,
      scroll:document.documentElement.scrollWidth,
      text:(document.body?.innerText||'').length,
      imageCount:document.images.length,
      missingImages:[...document.images].filter(i=>!i.complete||i.naturalWidth<1).map(i=>i.currentSrc),
      h1:document.querySelector('h1')?.innerText||''
    }));
    await page.screenshot({path:join(out,name+'.png'),fullPage:name==='mobile390',animations:'disabled'});
    if (data.scroll>data.width+1)failures.push('Rolagem horizontal: '+data.scroll+'/'+data.width);
    if (data.text<400)failures.push('Pouco conteúdo renderizado: '+data.text);
    if (data.missingImages.length)failures.push('Imagens não carregadas: '+JSON.stringify(data.missingImages));
    if (!data.h1.includes('LUCAS'))failures.push('Título principal ausente');
    results.push({name,...data,failures});
    await page.close();
  }
}finally{await browser.close();server.close();}
await (await import('node:fs/promises')).writeFile(join(out,'relatorio.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
if(results.some(r=>r.failures.length))process.exitCode=1;
