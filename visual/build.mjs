/**
 * Builds the app the way the visual run needs it: offline sample data, so every
 * page renders without the API being up, and into its own output directory so
 * the normal `yarn build` artefact is never clobbered.
 */
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const child = spawn(
  process.execPath,
  [require.resolve('react-scripts/bin/react-scripts.js'), 'build'],
  {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      REACT_APP_USE_MOCK: 'true',
      BUILD_PATH: path.join('visual', '.build'),
      GENERATE_SOURCEMAP: 'false',
      // CRA fails the build on lint warnings when CI is set; a visual run is not
      // the place to relitigate them.
      CI: '',
    },
  },
)

child.on('exit', (code) => process.exit(code ?? 1))
