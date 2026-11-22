import { cp, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const built = path.join(root, 'dist/client');
// GitHub Pages branch publishing serves the repository root without running Vite.
// Keep source HTML in editor/ and publish only Vite's compiled output here.
for (const name of await readdir(built)) {
  await cp(path.join(built, name), path.join(root, name), { recursive: true });
}
await writeFile(path.join(root, '.nojekyll'), '');
console.log('Prepared compiled app at the repository root for branch-based GitHub Pages.');
