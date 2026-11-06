import { spawn } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npmOptions = {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32'
};

function runStep(args, label) {
  return new Promise((resolveStep, rejectStep) => {
    const child = spawn(npmCommand, args, npmOptions);
    child.once('error', rejectStep);
    child.once('exit', (code) => {
      if (code === 0) resolveStep();
      else rejectStep(new Error(`${label} gagal (exit code ${code ?? 'unknown'}).`));
    });
  });
}

if (!existsSync(resolve(root, '.dev.vars'))) {
  copyFileSync(resolve(root, '.dev.vars.example'), resolve(root, '.dev.vars'));
  console.log('Membuat .dev.vars dari .dev.vars.example untuk local development.');
}

try {
  await runStep(['run', 'db:migrate:local'], 'Migrasi D1 lokal');
  await runStep(['run', 'db:seed:local'], 'Seed workspace lokal');
  await runStep(['run', 'build'], 'Build frontend');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const children = [
  spawn(npmCommand, ['run', 'dev:web'], npmOptions),
  spawn(npmCommand, ['run', 'dev:worker'], npmOptions)
];

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exit(exitCode);
}

for (const child of children) {
  child.once('error', (error) => {
    console.error('Gagal menjalankan proses development:', error);
    shutdown(1);
  });
  child.once('exit', (code) => {
    if (!shuttingDown) {
      console.error(`Proses development berhenti (exit code ${code ?? 'unknown'}).`);
      shutdown(code === 0 ? 0 : 1);
    }
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('SocMed-Manager siap di http://localhost:3000');
console.log('Worker API berjalan di http://127.0.0.1:8787');
