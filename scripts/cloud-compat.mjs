// Some managed preview runtimes cannot enumerate network interfaces.
// Vite only uses this information to print its optional Network URLs.
import os from 'node:os';
const networkInterfaces = os.networkInterfaces;
os.networkInterfaces = () => { try { return networkInterfaces(); } catch { return {}; } };
