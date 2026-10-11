import { rollup } from 'rollup';
import { mkdir, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await mkdir('lib', { recursive: true });
const bundle = await rollup({ input: 'src/index.js' });
for (const [file, format] of [['cyclic-prev.cjs.js', 'cjs'], ['cyclic-prev.esm.js', 'es'], ['cyclic-prev.mjs', 'es'], ['cyclic-prev.umd.js', 'umd']]) {
  await bundle.write({ file: `dist/${file}`, format, name: 'cyclicPrev', exports: 'named', sourcemap: true, generatedCode: 'es5' });
}
await bundle.close();
await writeFile('dist/index.js', "'use strict';\nvar cyclicPrev = require('./cyclic-prev.cjs.js').cyclicPrev;\nmodule.exports = cyclicPrev;\nmodule.exports.cyclicPrev = cyclicPrev;\nmodule.exports.default = cyclicPrev;\n");
await writeFile('lib/index.js', "'use strict';\nmodule.exports = require('../dist/index.js');\n");
await writeFile('dist/index.d.ts', 'declare function cyclicPrev(max: number, curr?: number, dec?: number): number;\ndeclare namespace cyclicPrev { export { cyclicPrev, cyclicPrev as default }; }\nexport = cyclicPrev;\n');
await writeFile('dist/cyclic-prev.d.mts', 'export declare function cyclicPrev(max: number, curr?: number, dec?: number): number;\nexport default cyclicPrev;\n');
console.log('Built CommonJS, ES modules, UMD, legacy entry point, and types.');
