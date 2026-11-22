import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import {freshProject,layer,historyInitial,historyReducer,validateProject,swapLayer} from '../src/model.js';
import {saveProject,allProjects} from '../src/storage.js';
test('layer material edits are nondestructive through undo, redo and JSON restore',()=>{
 const p=freshProject(true);p.layers[1].effects.material='chrome';const id=p.layers[1].id;const s=historyReducer(historyInitial(p),{type:'edit',change:q=>({...q,layers:q.layers.map(l=>l.id===id?{...l,effects:{...l.effects,material:'frost',finish:35}}:l)})});
 assert.equal(s.project.layers[1].effects.material,'frost');assert.equal(p.layers[1].effects.material,'chrome');
 const u=historyReducer(s,{type:'undo'});assert.deepEqual(u.project,p);const r=historyReducer(u,{type:'redo'});assert.deepEqual(validateProject(JSON.parse(JSON.stringify(r.project))),s.project);
});
test('continuous sliders coalesce but separate gestures and other actions remain undoable',()=>{
 const p=freshProject();let s=historyInitial(p);
 s=historyReducer(s,{type:'edit',key:'finish',time:1000,change:q=>({...q,name:'A'})});
 s=historyReducer(s,{type:'edit',key:'finish',time:1100,change:q=>({...q,name:'B'})});assert.equal(s.past.length,1);
 s=historyReducer(s,{type:'edit',key:'finish',time:1900,change:q=>({...q,name:'C'})});assert.equal(s.past.length,2);
 s=historyReducer(s,{type:'undo'});s=historyReducer(s,{type:'edit',change:q=>({...q,name:'D'})});assert.equal(s.future.length,0);
});
test('reordering preserves layers and no-op bounds',()=>{const p=freshProject(true);assert.equal(swapLayer(p,p.layers[1].id,1),p);const q=swapLayer(p,p.layers[0].id,1);assert.equal(q.layers[1].id,p.layers[0].id);assert.deepEqual(new Set(q.layers.map(l=>l.id)),new Set(p.layers.map(l=>l.id)))});
test('invalid backups reject remote image URLs, duplicate IDs, bad effects and unbounded geometry',()=>{
 const cases=[q=>q.layers.push({...q.layers[0]}),q=>q.layers[0].effects.light=Infinity,q=>q.layers[0].w=0,q=>q.layers[0].effects.material='unknown',q=>q.layers.push(layer('image',{src:'https://example.com/tracker.png'})),q=>q.palette.push('javascript:alert(1)')];
 for(const change of cases){const q=freshProject(true);change(q);assert.throws(()=>validateProject(q))}
});
test('IndexedDB restores image sources, drawings, effects, palette and reusable styles',async()=>{
 const p=freshProject(true);p.layers.push(layer('image',{src:'data:image/png;base64,aGVsbG8=',effects:{...p.layers[0].effects,material:'glass'}}));p.layers.push(layer('stroke',{points:[0,0,.4,200,100,.9],brushSize:12}));p.palette.push('#123456');p.styles.push({id:'test',name:'Paper',color:'#123456',effects:structuredClone(p.layers[0].effects)});
 await saveProject(p);const list=await allProjects();const restored=list.find(q=>q.id===p.id);assert.deepEqual(restored,p);assert.deepEqual(validateProject(restored),p);
 const changed={...p,name:'Saved again'};await saveProject(changed);const again=await allProjects();assert.equal(again.filter(q=>q.id===p.id).length,1);assert.equal(again.find(q=>q.id===p.id).name,'Saved again');
});
test('project switching stores independent project records',async()=>{const a=freshProject(),b=freshProject(true);await Promise.all([saveProject(a),saveProject(b)]);const list=await allProjects();assert.deepEqual(list.find(q=>q.id===a.id),a);assert.deepEqual(list.find(q=>q.id===b.id),b)});
