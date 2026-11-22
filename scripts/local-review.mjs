// Generates a self-contained review copy from the real editor source.
// It is a browser QA fallback only; production PWA behavior uses Vite's build.
import {build} from 'esbuild';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),assets={};
for(const theme of ['light','dark'])for(const f of await readdir(`public/assets/ui/${theme}`))assets[`ui/${theme}/${path.basename(f,'.png')}`]='data:image/png;base64,'+(await readFile(`public/assets/ui/${theme}/${f}`)).toString('base64');
assets.texture='data:image/png;base64,'+(await readFile('public/assets/paper-texture.png')).toString('base64');
const result=await build({stdin:{contents:"import React from 'react';import{createRoot}from'react-dom/client';import{App}from'./src/App.jsx';createRoot(document.getElementById('root')).render(React.createElement(App));",resolveDir:root,loader:'jsx'},bundle:true,write:false,format:'iife',minify:true,define:{'import.meta.env.PROD':'false','import.meta.env.BASE_URL':'"./"'},plugins:[{name:'review-assets',setup(b){b.onLoad({filter:/src\/App\.jsx$/},async a=>({contents:(await readFile(a.path,'utf8')).replace('src={`${import.meta.env.BASE_URL}assets/ui/${theme}/${name}.png`}','src={window.__OFFCUT_ASSETS__[`ui/${theme}/${name}`]}'),loader:'jsx'}));b.onLoad({filter:/src\/render\.js$/},async a=>({contents:(await readFile(a.path,'utf8')).replace("loadImage(`${import.meta.env?.BASE_URL||'/'}assets/paper-texture.png`)","loadImage(window.__OFFCUT_ASSETS__.texture)"),loader:'js'}));b.onResolve({filter:/^virtual:pwa-register$/},()=>({path:'pwa',namespace:'review'}));b.onLoad({filter:/.*/,namespace:'review'},()=>({contents:'export function registerSW(){return ()=>Promise.resolve()}',loader:'js'}))}}]});
const css=await readFile('src/styles.css','utf8');
const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f8f7f5"><title>Offcut — Local review</title><style>${css}</style></head><body><div id="root"></div><script>window.__OFFCUT_ASSETS__=${JSON.stringify(assets)};</script><script>${result.outputFiles[0].text.replaceAll('</script','<\\/script')}</script></body></html>`;
await writeFile('../Offcut-Local-Review.html',html);
console.log('Generated local review copy');
