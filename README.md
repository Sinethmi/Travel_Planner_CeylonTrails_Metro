# CeylonTrails

Monorepo (Turborepo + pnpm) with:

- `apps/web` (Next.js)
- `apps/admin` (Next.js)
- `apps/mobile` (Expo)
- shared packages under `packages/*`

## Dev

- Web + Admin:

	```sh
	pnpm dev
	```

- Mobile (Expo):

	```sh
	pnpm dev:mobile
	```

- Everything (runs all dev tasks via Turbo):

	```sh
	pnpm dev:all
	```

## Node version note (Windows)

If Expo fails on Windows with:

`Error [ERR_UNSUPPORTED_ESM_URL_SCHEME] ... Received protocol 'c:'` while loading `metro.config.*`,
you’re likely running Node v22+. Expo SDK 54 is generally happiest on Node 20 LTS.

Use Node 20 for `apps/mobile` (then re-run `pnpm dev:mobile`).
