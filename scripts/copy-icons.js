/**
 * Copies icon PNGs into this repo's public/ directory.
 *
 * This script is optional. The committed assets in public/ are the source used by
 * normal builds. When HUSH_ICONS_DIR is set, it refreshes those committed files
 * from an external asset source.
 */
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const srcDir = process.env.HUSH_ICONS_DIR
  ? (process.env.HUSH_ICONS_DIR.startsWith('/')
      ? process.env.HUSH_ICONS_DIR
      : join(repoRoot, process.env.HUSH_ICONS_DIR))
  : null;
const destDir = join(repoRoot, 'public');

const files = [
  'favicon.png',
  'favicon-light.png',
  'apple-touch-icon.png',
  'apple-touch-icon-light.png',
  'icon-192.png',
  'icon-192-light.png',
  'icon-512.png',
  'icon-512-light.png',
  'og-image.png',
];

if (!srcDir || !existsSync(srcDir)) {
  process.exit(0);
}

if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

for (const name of files) {
  const src = join(srcDir, name);
  if (!existsSync(src)) continue;
  copyFileSync(src, join(destDir, name));
  console.log('copy-icons:', name);
}
