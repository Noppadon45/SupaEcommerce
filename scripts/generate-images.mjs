import fs from 'node:fs';
import path from 'node:path';

const products = [
  { file: 'aurora-headphones.svg', emoji: '🎧', from: '#6366f1', to: '#312e81', label: 'AURORA' },
  { file: 'nova-laptop.svg', emoji: '💻', from: '#475569', to: '#0f172a', label: 'NOVA' },
  { file: 'pulse-smartwatch.svg', emoji: '⌚', from: '#8b5cf6', to: '#4c1d95', label: 'PULSE' },
  { file: 'luma-camera.svg', emoji: '📷', from: '#0ea5e9', to: '#1e3a8a', label: 'LUMA' },
  { file: 'cotton-tee.svg', emoji: '👕', from: '#fb7185', to: '#9f1239', label: 'ESSENTIAL' },
  { file: 'denim-jacket.svg', emoji: '🧥', from: '#3b82f6', to: '#1e3a8a', label: 'URBAN' },
  { file: 'midi-dress.svg', emoji: '👗', from: '#ec4899', to: '#831843', label: 'FLUID' },
  { file: 'cloudrun-sneakers.svg', emoji: '👟', from: '#06b6d4', to: '#155e75', label: 'CLOUDRUN' },
  { file: 'trailblazer-boots.svg', emoji: '👢', from: '#f59e0b', to: '#92400e', label: 'TRAIL' },
  { file: 'tote-bag.svg', emoji: '👜', from: '#10b981', to: '#065f46', label: 'EVERYDAY' },
  { file: 'sunglasses.svg', emoji: '🕶️', from: '#f97316', to: '#7c2d12', label: 'CLASSIC' },
  { file: 'backpack.svg', emoji: '🎒', from: '#14b8a6', to: '#134e4a', label: 'MINIMAL' },
];

const dir = path.resolve('public/images');
fs.mkdirSync(dir, { recursive: true });

for (const item of products) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${item.from}"/>
      <stop offset="100%" stop-color="${item.to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="690" cy="120" r="230" fill="#ffffff" opacity="0.07"/>
  <circle cx="90" cy="720" r="270" fill="#ffffff" opacity="0.06"/>
  <circle cx="400" cy="380" r="250" fill="#ffffff" opacity="0.10"/>
  <circle cx="400" cy="380" r="210" fill="#ffffff" opacity="0.08"/>
  <text x="400" y="450" text-anchor="middle" font-size="250" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${item.emoji}</text>
  <text x="400" y="670" text-anchor="middle" font-size="44" font-weight="700" letter-spacing="10" fill="#ffffff" opacity="0.92" font-family="Inter, Arial, sans-serif">${item.label}</text>
</svg>`;
  fs.writeFileSync(path.join(dir, item.file), svg, 'utf8');
}

console.log(`Generated ${products.length} product images in ${dir}`);
