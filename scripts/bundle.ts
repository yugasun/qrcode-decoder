import * as path from 'path';
import * as rollup from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import typescript2 from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import globals from 'rollup-plugin-node-globals';
import commonjs from 'rollup-plugin-commonjs';
import ts from 'typescript';

import { createLogger } from './logger';

const logBundle = createLogger('bundle');

const plugins: rollup.Plugin[] = [
  resolve({
    browser: true,
    jsnext: true,
    preferBuiltins: true,
  }),
  commonjs(),
  typescript2({
    tsconfig: path.join(__dirname, '..', 'tsconfig.json'),
  }),
];

async function bundleEsm() {
  const bundle = await rollup.rollup({
    input: path.join(process.cwd(), 'src/index.ts'),
    plugins: [...plugins, globals()],
    external: ['jsqr'],
  });
  await bundle.write({
    file: 'dist/index.esm.js',
    name: 'QrcodeDecoder',
    format: 'esm',
    sourcemap: false,
    globals: {
      jsqr: 'jsqr',
      tslib: 'tslib',
    },
  });
}
async function bundleUmd() {
  const bundle = await rollup.rollup({
    input: path.join(process.cwd(), 'src/index.ts'),
    plugins: [...plugins],
    external: ['jsqr'],
  });
  await bundle.write({
    file: 'dist/index.js',
    exports: 'named',
    name: 'QrcodeDecoder',
    format: 'umd',
    sourcemap: false,
    globals: {
      jsqr: 'jsqr',
      tslib: 'tslib',
    },
  });
}

async function bundleCommonjs() {
  const bundle = await rollup.rollup({
    input: path.join(process.cwd(), 'src/index.ts'),
    plugins: [...plugins],
    external: ['jsqr'],
  });
  await bundle.write({
    file: 'dist/index.js',
    exports: 'named',
    name: 'QrcodeDecoder',
    format: 'commonjs',
    sourcemap: false,
    globals: {
      jsqr: 'jsqr',
      tslib: 'tslib',
    },
  });
}

async function bundleAio() {
  const bundle = await rollup.rollup({
    input: path.join(process.cwd(), 'src/index.ts'),
    plugins: [
      ...plugins,
      uglify({
        compress: {
          drop_debugger: true,
          drop_console: false,
        },
      }),
    ],
  });
  await bundle.write({
    file: 'dist/index.min.js',
    name: 'QrcodeDecoder',
    format: 'iife',
    sourcemap: true,
  });
}

async function bundle() {
  try {
    const outputs = process.argv.slice(2)[0].split(',');
    logBundle(`Creating bundle`);

    if (outputs.indexOf('esm') === -1) {
      logBundle(`Skipping esm`);
    } else {
      logBundle(`Creating esm`);
      await bundleEsm();
    }

    if (outputs.indexOf('umd') === -1) {
      logBundle(`Skipping umd`);
    } else {
      logBundle(`Creating umd`);

      await bundleUmd();
    }

    if (outputs.indexOf('commonjs') === -1) {
      logBundle(`Skipping commonjs`);
    } else {
      logBundle(`Creating commonjs`);

      await bundleCommonjs();
    }

    if (outputs.indexOf('aio') === -1) {
      logBundle(`Skipping umd aio`);
    } else {
      logBundle(`Creating umd aio`);

      await bundleAio();
    }
  } catch (err) {
    logBundle('Failed to bundle:');
    logBundle(err);
    process.exit(1);
  }
}

bundle();
