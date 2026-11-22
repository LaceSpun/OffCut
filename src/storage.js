let dbPromise;
export function database(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open('full-creative-studio',1);req.onupgradeneeded=()=>req.result.createObjectStore('projects',{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>{dbPromise=null;reject(req.error)};req.onblocked=()=>reject(Error('Close other Studio tabs and retry.'));});return dbPromise;}
export async function saveProject(project){const db=await database();return new Promise((resolve,reject)=>{const t=db.transaction('projects','readwrite');t.objectStore('projects').put(project);t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||Error('Save interrupted'));});}
export async function allProjects(){const db=await database();return new Promise((resolve,reject)=>{const r=db.transaction('projects').objectStore('projects').getAll();r.onsuccess=()=>resolve(r.result.sort((a,b)=>b.updated-a.updated));r.onerror=()=>reject(r.error)});}
export function remember(id){try{localStorage.setItem('studio-active',id)}catch{}}
export function lastActive(){try{return localStorage.getItem('studio-active')}catch{return null}}
export function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
