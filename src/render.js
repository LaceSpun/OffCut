const loaded=new Map();
export function loadImage(src){if(!loaded.has(src))loaded.set(src,new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>{loaded.delete(src);rej(Error('Could not load image'))};i.src=src}));return loaded.get(src);}
export function surface(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));return c;}
const noise=(n)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
function shapePath(ctx,l){
 const {w,h}=l,t=(l.effects?.enabled?l.effects.torn:0)||0;
 ctx.beginPath();
 if(l.type==='ring'){ctx.ellipse(w/2,h/2,w*.48,h*.48,0,0,Math.PI*2);ctx.ellipse(w/2,h/2,w*.31,h*.31,0,0,Math.PI*2,true);return;}
 if(l.type==='frame'){ctx.rect(0,0,w,h);ctx.moveTo(w*.14,h*.14);ctx.lineTo(w*.14,h*.86);ctx.lineTo(w*.86,h*.86);ctx.lineTo(w*.86,h*.14);ctx.closePath();return;}
 if(l.type==='triangle'){ctx.moveTo(w/2,0);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.moveTo(w/2,h*.29);ctx.lineTo(w*.25,h*.84);ctx.lineTo(w*.75,h*.84);ctx.closePath();return;}
 if(l.type==='ellipse'&&!t){ctx.ellipse(w/2,h/2,w/2,h/2,0,0,Math.PI*2);return;}
 let pts=[];
 if(l.type==='arch'){
 pts.push([0,h],[0,h*.48]);
 for(let i=0;i<=80;i++){const a=Math.PI-i/80*Math.PI;pts.push([w/2+Math.cos(a)*w/2,h*.48-Math.sin(a)*h*.48]);}
 pts.push([w,h],[w*.78,h],[w*.78,h*.51]);
 for(let i=0;i<=60;i++){const a=i/60*Math.PI;pts.push([w/2+Math.cos(a)*w*.28,h*.51-Math.sin(a)*h*.28]);}
 pts.push([w*.22,h],[0,h]);
 }else if(l.type==='ellipse'){for(let i=0;i<=160;i++){const a=i/160*Math.PI*2;pts.push([w/2+Math.cos(a)*w/2,h/2+Math.sin(a)*h/2]);}}
 else{pts=[[0,0],[w,0],[w,h],[0,h],[0,0]];}
 let out=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),n=t?Math.max(1,Math.ceil(len/5)):1;for(let j=0;j<n;j++){const f=j/n,offset=(noise(i*89+j)-.5)*t*.16;out.push([a[0]+(b[0]-a[0])*f+offset,a[1]+(b[1]-a[1])*f+offset]);}}
 out.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();
}
function mask(l,images){const c=surface(l.w,l.h),ctx=c.getContext('2d');ctx.fillStyle='white';
 if(l.type==='image'){ctx.drawImage(images.get(l.src),0,0,l.w,l.h)}
 else if(l.type==='text'){ctx.font=`${l.bold?'700':'500'} ${l.fontSize}px ${l.font||'sans-serif'}`;ctx.textBaseline='top';String(l.text).split('\n').forEach((line,i)=>ctx.fillText(line,0,i*l.fontSize*1.2,l.w));}
 else if(l.type==='stroke'){ctx.strokeStyle='white';ctx.lineCap='round';ctx.lineJoin='round';for(let i=3;i<l.points.length;i+=3){ctx.beginPath();ctx.lineWidth=(l.brushSize||8)*Math.max(.25,l.points[i+2]);ctx.moveTo(l.points[i-3],l.points[i-2]);ctx.lineTo(l.points[i],l.points[i+1]);ctx.stroke();}}
 else{shapePath(ctx,l);ctx.fill();}return c;}
function gradient(ctx,w,h,angle,stops){const a=angle*Math.PI/180,dx=Math.cos(a)*w*.7,dy=Math.sin(a)*h*.7,g=ctx.createLinearGradient(w/2-dx,h/2-dy,w/2+dx,h/2+dy);stops.forEach(s=>g.addColorStop(...s));return g;}
function localLayer(l,backdrop,images,texture){
 const c=surface(l.w,l.h),ctx=c.getContext('2d'),m=mask(l,images),w=l.w,h=l.h,e=l.effects.enabled?l.effects:{...l.effects,material:'flat',texture:0,fold:0,crease:0,emboss:0};
 ctx.fillStyle=l.color;ctx.fillRect(0,0,w,h);
 if(l.type==='image')ctx.drawImage(images.get(l.src),0,0,w,h);
 if(e.material==='chrome'||e.material==='metal'){
 ctx.globalAlpha=l.type==='image'?.78:1;
 ctx.fillStyle=gradient(ctx,w,h,e.light,e.material==='chrome'?[[0,'#f9f6ff'],[.18,'#85808b'],[.36,'#fdfbff'],[.49,'#a39aa8'],[.5,'#211f2a'],[.61,'#565261'],[.75,'#e2d9e4'],[1,'#9994a6']]:[[0,'#f5f0f2'],[.23,l.color],[.46,'#bdb8c0'],[.62,'#faf6f4'],[.78,l.color],[1,'#575262']]);ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
 if(l.type==='ellipse'){const g=ctx.createRadialGradient(w*.29,h*.22,0,w/2,h/2,w*.65);g.addColorStop(0,'#ffffffd9');g.addColorStop(.14,'#ffffff16');g.addColorStop(.65,'#ffffff00');g.addColorStop(1,'#201425b0');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
 ctx.globalAlpha=(100-e.finish)/130;ctx.fillStyle=l.color;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
 }else if(e.material==='glass'||e.material==='frost'){
 const bg=surface(w,h),bc=bg.getContext('2d');bc.rotate(-l.rotation*Math.PI/180);bc.translate(-l.x,-l.y);bc.drawImage(backdrop,0,0);
 ctx.clearRect(0,0,w,h);
 if(e.material==='frost'){const small=surface(Math.max(2,w/(5+e.finish/4)),Math.max(2,h/(5+e.finish/4)));small.getContext('2d').drawImage(bg,0,0,small.width,small.height);ctx.drawImage(small,0,0,w,h);}else ctx.drawImage(bg,0,0);
 ctx.globalAlpha=e.material==='frost'?.3:.15;ctx.fillStyle=l.color;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
 ctx.fillStyle=gradient(ctx,w,h,e.light,[[0,'#ffffffb0'],[.4,'#ffffff0a'],[.5,'#ffffff60'],[.54,'#ffffff00'],[1,'#472a6e40']]);ctx.fillRect(0,0,w,h);
 }else if(e.material==='paper'){
 ctx.fillStyle=gradient(ctx,w,h,e.light,[[0,'#ffffff18'],[.4,'#ffffff00'],[1,'#30132e40']]);ctx.fillRect(0,0,w,h);
 }
 if((e.texture||e.material==='paper')&&texture){ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=Math.max(e.texture/100,e.material==='paper'?.25:0);ctx.drawImage(texture,0,0,w,h);ctx.restore();}
 if(e.fold){const f=e.fold/100;ctx.save();ctx.fillStyle=gradient(ctx,w,h,35,[[0,'#00000000'],[.46,'#00000000'],[.5,`rgba(20,10,30,${f*.65})`],[.505,`rgba(255,255,255,${f*.75})`],[.62,'#ffffff00'],[1,'#ffffff00']]);ctx.fillRect(0,0,w,h);ctx.restore();}
 if(e.crease){ctx.fillStyle=gradient(ctx,w,h,90,[[0,'#ffffff00'],[.46,'#ffffff00'],[.495,`rgba(0,0,0,${e.crease/160})`],[.5,`rgba(255,255,255,${e.crease/130})`],[.53,'#ffffff00'],[1,'#ffffff00']]);ctx.fillRect(0,0,w,h);}
 ctx.globalCompositeOperation='destination-in';ctx.drawImage(m,0,0);ctx.globalCompositeOperation='source-over';
 if(e.emboss||e.material==='glass'||e.material==='frost'){
 const edge=surface(w,h),ec=edge.getContext('2d'),k=1+e.emboss/16;ec.drawImage(m,0,0);ec.globalCompositeOperation='source-out';ec.drawImage(m,k,k);ctx.save();ctx.globalAlpha=.5;ctx.drawImage(edge,0,0);ctx.restore();
 }
 return c;
}
export async function renderProject(project, preview=false){
 const ratio=preview?Math.min(1,768/Math.max(project.width,project.height,...project.layers.flatMap(l=>[l.w,l.h]))):1;
 const p=ratio===1?project:{...project,width:project.width*ratio,height:project.height*ratio,layers:project.layers.map(l=>({...l,x:l.x*ratio,y:l.y*ratio,w:l.w*ratio,h:l.h*ratio,fontSize:l.fontSize*ratio,brushSize:l.brushSize*ratio,points:l.points?.map((v,i)=>i%3===2?v:v*ratio),effects:{...l.effects,shadow:l.effects.shadow*ratio}}))};
 const sources=[...new Set(p.layers.filter(l=>l.type==='image').map(l=>l.src))];const img=await Promise.all(sources.map(loadImage));const images=new Map(sources.map((s,i)=>[s,img[i]]));
 let texture;try{texture=await loadImage(`${import.meta.env?.BASE_URL||'/'}assets/paper-texture.png`)}catch{}
 const composite=surface(p.width,p.height),ctx=composite.getContext('2d');if(!p.transparent){ctx.fillStyle=p.background;ctx.fillRect(0,0,p.width,p.height)}
 const canvases=new Map();
 for(const l of p.layers){if(!l.visible)continue;const c=localLayer(l,composite,images,texture);canvases.set(l.id,c);ctx.save();ctx.translate(l.x,l.y);ctx.rotate(l.rotation*Math.PI/180);ctx.globalAlpha=l.opacity;if(l.effects.enabled&&l.effects.shadow){ctx.shadowColor='#29152e66';ctx.shadowBlur=l.effects.shadow*.65;ctx.shadowOffsetX=l.effects.shadow*.12;ctx.shadowOffsetY=l.effects.shadow*.45;}ctx.drawImage(c,0,0,l.w,l.h);ctx.restore();}
 return {composite,canvases};
}
export async function importImage(file){
 if(file.size>20000000)throw Error('Choose an image under 20 MB.');
 if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Choose PNG, JPEG or WebP.');
 const url=URL.createObjectURL(file);try{const i=await loadImage(url);const scale=Math.min(1,1536/Math.max(i.width,i.height)),c=surface(i.width*scale,i.height*scale);c.getContext('2d').drawImage(i,0,0,c.width,c.height);loaded.delete(url);return {src:c.toDataURL('image/png'),width:c.width,height:c.height}}finally{URL.revokeObjectURL(url)}
}
