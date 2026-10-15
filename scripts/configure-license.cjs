const fs = require('node:fs');
const path = require('node:path');

const target = path.join(__dirname, '..', 'src', 'primeui-license.local.ts');
const key = process.env.PRIMEUI_LICENSE;
if (key) {
  fs.writeFileSync(target, `export const primeUILicense: string | undefined = ${JSON.stringify(key)};\n`);
} else if (!fs.existsSync(target)) {
  fs.writeFileSync(target, 'export const primeUILicense: string | undefined = undefined;\n');
}
if (!key && !fs.readFileSync(target, 'utf8').includes('= "')) {
  console.warn('PrimeUI license is not configured. Set PRIMEUI_LICENSE locally and rerun the npm command.');
}
