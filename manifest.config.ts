import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';

const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version.replace(/[^\d.-]/g, '').split(/[.-]/);

export default defineManifest(async ({mode}) => ({
  manifest_version: 3,
  name: `${mode === 'development' ? '[DEV] ' : ''}Dable Extension`,
  version: `${major}.${minor}.${patch}`,
  description: 'Dable administration tools',
  icons: [16,19,48,128].reduce(
    (obj, size) => ({ ...obj, [size]: `icons/icon${size}${mode === 'development' ? '.dev' : ''}.png`}),
    {} as Record<string, string>
  ),
  action: {
    default_popup: 'src/action/popup.html',
  },
  background: {
    service_worker: 'src/background.ts',
  },
  permissions: ['tabs'],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*' ],
      exclude_matches: ['*://*.dable.io/*'],
      match_about_blank: false,
      js: ['src/content/inject.ts'],
      all_frames: true,
      run_at: 'document_idle',
    },
  ],
}));
