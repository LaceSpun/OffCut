export const PALETTE = ['#f78a21','#ffd44e','#fff0cc','#459c69','#2869db'];
export const uid = () => crypto.randomUUID();
export const effects = () => ({material:'flat',finish:78,light:135,texture:0,fold:0,crease:0,torn:0,emboss:0,shadow:16,enabled:true});
export function layer(type, extra={}) { return {id:uid(),type,name:({rect:'Rectangle',ellipse:'Circle',arch:'Paper arch',triangle:'Triangle',ring:'Ring',frame:'Frame',text:'Text',image:'Imported image',stroke:'Drawing'})[type],x:240,y:240,w:440,h:440,rotation:0,opacity:1,visible:true,locked:false,color:'#805377',effects:effects(),...extra}; }
export function freshProject(sample=false) {
 const p={schema:1,id:uid(),name:sample?'Prism study':'Untitled icon',width:1024,height:1024,background:'#fff0d4',transparent:false,palette:[...PALETTE],styles:[],layers:[],updated:Date.now()};
 if(sample)p.layers=[layer('ring',{name:'Ring',x:190,y:260,w:640,h:640,color:'#2869db',effects:{...effects(),material:'paper',texture:70,shadow:15}}),layer('triangle',{name:'Triangle',x:170,y:110,w:685,h:750,color:'#f78a21',effects:{...effects(),material:'paper',texture:35,shadow:20}})];
 return p;
}
export function historyInitial(project){return {project,past:[],future:[],merge:null,time:0};}
export function historyReducer(s,a){
 if(a.type==='load')return historyInitial(a.project);
 if(a.type==='undo')return s.past.length?{project:s.past.at(-1),past:s.past.slice(0,-1),future:[s.project,...s.future].slice(0,40),merge:null,time:0}:s;
 if(a.type==='redo')return s.future.length?{project:s.future[0],past:[...s.past,s.project].slice(-40),future:s.future.slice(1),merge:null,time:0}:s;
 if(a.type==='edit'){
 const next=typeof a.change==='function'?a.change(s.project):a.change;
 if(next===s.project)return s;
 const now=a.time??Date.now(),merge=a.key&&s.merge===a.key&&now-s.time<650;
 return {project:{...next,updated:now},past:merge?s.past:[...s.past,s.project].slice(-40),future:[],merge:a.key??null,time:now};
 }return s;
}
export function validateProject(p){
 const num=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
 const color=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
 if(!p||p.schema!==1||!num(p.width,64,2560)||!num(p.height,64,2560)||!Array.isArray(p.layers)||p.layers.length>32||!color(p.background))throw Error('This is not a supported Studio project.');
 if(typeof p.name!=='string'||p.name.length>100||typeof p.id!=='string')throw Error('Invalid project details.');
 if(!Array.isArray(p.palette)||p.palette.length>64||!p.palette.every(color))throw Error('Invalid palette.');
 const seen=new Set();
 for(const l of p.layers){
 if(!['rect','ellipse','arch','triangle','ring','frame','text','image','stroke'].includes(l.type)||typeof l.id!=='string'||seen.has(l.id)||typeof l.name!=='string'||l.name.length>100||!color(l.color))throw Error('Invalid layer.');seen.add(l.id);
 if(!['x','y','w','h','rotation','opacity'].every(k=>num(l[k],k==='w'||k==='h'?1:k==='opacity'?0:-10000,k==='opacity'?1:10000)))throw Error('Invalid layer geometry.');
 if(l.type==='image'&&(typeof l.src!=='string'||!/^data:image\/(png|jpeg|webp);base64,/.test(l.src)||l.src.length>12000000))throw Error('Unsupported image.');
 if(l.w>2560||l.h>2560||typeof l.visible!=='boolean'||typeof l.locked!=='boolean'||typeof l.effects?.enabled!=='boolean')throw Error('Invalid layer limits.');
 if(l.type==='text'&&(typeof l.text!=='string'||l.text.length>500||!num(l.fontSize,8,512)))throw Error('Invalid text layer.');
 if(l.type==='stroke'&&(!Array.isArray(l.points)||l.points.length>20000||!l.points.every(n=>num(n,-10000,10000))||l.points.length%3||!num(l.brushSize,1,100)))throw Error('Invalid drawing.');
 const e=l.effects;if(!e||!['flat','glass','frost','chrome','metal','paper'].includes(e.material)||!['finish','texture','fold','crease','torn','emboss','shadow'].every(k=>num(e[k],0,100))||!num(e.light,0,360))throw Error('Invalid effects.');
 }
 if(!Array.isArray(p.styles)||p.styles.length>32)throw Error('Invalid styles.');
 for(const s of p.styles){if(typeof s.name!=='string'||s.name.length>80||!color(s.color))throw Error('Invalid style.');const test={...p,layers:[layer('rect',{effects:s.effects})],styles:[]};validateProject(test);}
 return structuredClone(p);
}
export function swapLayer(p,id,direction){const i=p.layers.findIndex(l=>l.id===id),j=i+direction;if(i<0||j<0||j>=p.layers.length)return p;const layers=[...p.layers];[layers[i],layers[j]]=[layers[j],layers[i]];return {...p,layers};}
