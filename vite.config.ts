import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';

export default defineConfig({
    plugins: [
        preact({
          devtoolsInProd: false,
        }),
        crx({
          manifest,
          contentScripts: {
            preambleCode: false,
          },
        }),
    ],
});
