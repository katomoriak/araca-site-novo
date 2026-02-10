/**
 * Roda payload migrate com Node 20, mesmo quando o Node padrão é 24.
 * nvm use 20 não persiste em alguns terminais; este script localiza o Node 20 do nvm e executa o migrate.
 *
 * Uso: node scripts/migrate-with-node20.cjs
 * Ou: npm run migrate
 */
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';
const projectRoot = path.resolve(__dirname, '..');

function findNode20() {
  if (process.version.startsWith('v20.')) {
    return process.execPath; // já estamos no Node 20
  }

  const nvmHome = process.env.NVM_HOME || process.env.NVM_SYMLINK || (isWindows && (process.env.APPDATA ? path.join(process.env.APPDATA, 'nvm') : null));
  if (!nvmHome || !fs.existsSync(nvmHome)) {
    return null;
  }

  try {
    const entries = fs.readdirSync(nvmHome, { withFileTypes: true });
    const v20 = entries
      .filter((d) => d.isDirectory() && d.name.startsWith('v20.'))
      .map((d) => d.name)
      .sort()
      .pop();
    if (v20) {
      const nodeExe = path.join(nvmHome, v20, isWindows ? 'node.exe' : 'bin/node');
      if (fs.existsSync(nodeExe)) return nodeExe;
    }
  } catch (_) {}
  return null;
}

const node20 = findNode20();
if (!node20) {
  console.error('');
  console.error('Node 20 nao encontrado. O payload migrate precisa do Node 20 (Lexical usa top-level await; Node 24 falha).');
  console.error('');
  console.error('Opcoes:');
  console.error('  1. Instale Node 20: nvm install 20');
  console.error('  2. Use nvm use 20 em um terminal e rode: npx payload migrate');
  console.error('  3. Ou defina NVM_HOME (pasta do nvm) e rode este script de novo.');
  console.error('');
  process.exit(1);
}

const node20Dir = path.dirname(node20);
const pathSep = isWindows ? ';' : ':';
const newPath = node20Dir + pathSep + (process.env.PATH || process.env.Path || '');

console.log('Usando Node 20:', node20);
console.log('');

// PATH com Node 20 primeiro garante que npx use Node 20.
const result = spawnSync(isWindows ? 'npx.cmd' : 'npx', ['payload', 'migrate'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: { ...process.env, PATH: newPath, Path: newPath, NODE_OPTIONS: '' },
  shell: isWindows,
});

process.exit(result.status ?? 1);
