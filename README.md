# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Variables

Copy `.env.example` to `.env` and adjust the values as needed:

```bash
cp .env.example .env
```

| Variable            | Description                                   | Default                 |
| ------------------- | --------------------------------------------- | ----------------------- |
| `REACT_APP_API_URL` | Backend API base URL (`src/common/constants`) | `http://localhost:8801` |

`.env` is not committed (already in `.gitignore`); `.env.example` serves as the template for anyone cloning the repo.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run lint` / `npm run lint:fix`

Runs ESLint across `src` (`react-app` + `react-app/jest` config, with Prettier-conflicting rules disabled). `lint:fix` auto-fixes what it can.

### `npm run format` / `npm run format:check`

Formats the whole project with Prettier (`format`), or just checks formatting without writing changes (`format:check`, meant for CI).

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Code quality: ESLint, Prettier, Husky

- **Prettier** (`.prettierrc.json`, `.prettierignore`) — shared formatting rules: no semicolons, single quotes, 2-space indent, `printWidth: 100`.
- **ESLint** — uses `react-scripts`'s built-in config (`react-app`, `react-app/jest`) plus `eslint-config-prettier` to disable formatting rules that conflict with Prettier. ESLint only handles correctness/best practices, Prettier handles formatting — `eslint-plugin-prettier` is intentionally not used, to keep linting fast.
- **Husky + lint-staged** — on every `git commit`, the `.husky/pre-commit` hook runs `eslint --fix` + `prettier --write` on staged `src/**/*.{ts,tsx}` files (and `prettier --write` for `*.{json,css,scss,md}`). The commit is blocked if any ESLint error can't be auto-fixed.
  - The hook is installed automatically via the `"prepare": "husky"` script on every `npm install`.

## TypeScript

The codebase is TypeScript (`.ts`/`.tsx`) with `strict` mode on. Shared domain types (`Product`, `Order`, `User`, `Cart`, `Coupon`, `Review`, etc.) live in `src/interface/` as declaration files, one per concept, re-exported from `src/interface/index.d.ts`.

## Error Handling & Toasts

- `src/common/constants/errorCodes.ts` — maps backend error `code`s to the Vietnamese text shown to users.
- `src/common/utils/errorMessage.ts` — `getErrorMessage(error)` (used in axios `.catch` blocks) and `getErrorMessageFromCode(code, fallback)` (used when the error comes back in a 200 response shaped like `{ status: 'error', code, message }`).
- `src/common/utils/toast.ts` — `toast.success/error/warning/info` wrapper around `antd/lib/message`.
- `src/common/api/client.ts` — axios response interceptor: **every failed request automatically shows a toast**, unless the request is called with `{ silentError: true }` (used by forms that display the error inline below the relevant input instead, e.g. `LoginUserForm`, `RegisterUser`, `Checkout`, `EditingUser`).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
