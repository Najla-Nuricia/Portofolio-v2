# Dependency upgrade plan

**Status:** stable-major upgrade pass completed and locally verified on 2026-10-23. A Solid 2 / TanStack Query 6 prerelease migration is pending because the current Astro and Solid UI ecosystem does not support Solid 2 as a drop-in update. No deployment was run.

**Version snapshot:** 2026-10-23. “Latest” means the stable npm `latest` tag on that date; prereleases are listed separately. Versions below compare the current `bun.lock` resolution with the npm registry, not just the manifest ranges.

## Execution outcome

- Updated direct dependencies to the selected latest stable versions, including Astro 7.4.2 / MDX 8.1.1 / Cloudflare adapter 14.4.2, TanStack Markdown 1.0.0, Solid Table 9.3.1, Vite+ 1.4.0, and Vitest 5.0.5. Same-major updates are captured in the table below.
- Moved the coupled Effect stack from beta to stable 4.0.6 and advanced Alchemy to beta.83 with its exact Drizzle ORM/Kit 1.0.0 RC peer versions. These packages remain prerelease where their `latest` channel is prerelease.
- Kept TypeScript 6.0.3 under the `typescript` package name for Astro’s checker and installed TypeScript 7.0.2 as `@typescript/native`. The `tsconfig` path alias now uses a relative target because TypeScript 7 removes `baseUrl`.
- Migrated `ContentTable.tsx` to Solid Table v9, removed the obsolete D1 schema option from Drizzle setup, changed Alchemy D1 config from `migrationsDir` to `migrations`, and normalized the remaining Astronaut Farm relation to Astro's entry ID. No live database migration or deployment was run.
- Verified the regenerated lockfile with frozen install, `vp run check`, `bun run build`, TypeScript 6 and 7 checks (including `alchemy.run.ts`), and `bun run format:check`. Astro check/build complete without errors. The existing Oxlint `sort()` warning was fixed with `toSorted()`.

## Major upgrade migration notes

- **`@astrojs/mdx` — `7.0.3` → `8.1.1`.** MDX processing moved to Astro’s Markdown processors. The current `astro.config.ts` does not configure a custom processor, so the release notes say no action is needed unless one is configured. MDX 8 requires Astro `^7.2.10`, `@astrojs/markdown-remark` `^7.3.0`, and `@astrojs/markdown-satteri` `^0.4.0`; Cloudflare integration 14.4 also requires Astro `^7.4.0` and Wrangler `^4.125.0`. Upgrade the Astro integration set together and verify the Worker build. [MDX 8.0.0 release](https://github.com/withastro/astro/releases/tag/%40astrojs/mdx%408.0.0) · [Astro upgrade guidance](https://docs.astro.build/en/upgrade-astro/)

- **`@tanstack/markdown` — `0.0.12` → `1.0.0`.** The documented parser/renderer calls require no migration in the v1 guide, but its explicit upgrade section starts at `0.0.16`, while this lockfile is at `0.0.12`; verify this older starting point against the current `renderHtml` call in `src/components/admin/ContentPreview.tsx`. V1 is ESM-only, stabilizes entrypoints/options/AST/renderers, and does not provide full CommonMark/GFM/MDX support or HTML sanitization. The parser/HTML renderer itself is framework-independent, despite React/Octane peers. [Version 1 compatibility](https://tanstack.com/markdown/latest/docs/project/version-one)

- **`@tanstack/solid-table` — `8.21.3` → `9.3.1`.** `ContentTable.tsx` uses `createSolidTable` and `flexRender`; v9 replaces these with `createTable` and `<FlexRender />`, requires a `features` option, and moves row-model setup into `tableFeatures()` (or the migration shortcut `stockFeatures`). The core row model is automatic. State APIs and some types also change, but this component uses only the basic client-side row model. [Solid v9 migration](https://tanstack.com/table/latest/docs/framework/solid/guide/migrating)

- **TypeScript — 6.0.3 + 7.0.2 side by side.** TypeScript 7 removes `baseUrl` and does not expose the programmatic API Astro’s checker requires. `@astrojs/check@0.9.12` also declares TypeScript 5 or 6. Therefore `typescript` remains 6.0.3 for Astro tooling, while the TypeScript 7.0.2 compiler is installed under `@typescript/native`; its direct `tsc --noEmit` check passes. Move the `typescript` package name to 7 only after Astro tooling supports it. [TypeScript 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) · [`@astrojs/check` peer metadata](https://registry.npmjs.org/%40astrojs%2Fcheck/latest)

- **`vite-plus` — `0.2.4` → `1.4.0`. Updated with Vitest 5.** Vite+ 1 includes Vitest 5 changes. Vite+ 1 requires Node 22.18.x, 24.11.x, or 26+; the project now declares `>=24.11.0`. This repository uses `vp` in README instructions, but its package scripts call `astro`/`vitest` directly. [Vite+ migration](https://viteplus.dev/guide/migrate) · [Vite+ Vitest 5 guide](https://viteplus.dev/guide/vitest-v5)

- **`vitest` — `4.1.10` → `5.0.5`. Keep with Vite+ 1 if Vite+ is updated.** Notable behavior changes include `clearMocks: true` by default, inline project configs inheriting root options, hoisted `vi.mock`/`vi.unmock`/`vi.hoisted` calls inside callbacks now throwing, unawaited async assertions failing the test, and removal of deprecated entrypoints/APIs. This repo has three tests and no Vitest config, so the focused test run is a useful first check. [Vitest 5 migration guide](https://vitest.dev/guide/migration/)

## Same-major updates

These have a newer stable version without a stable major change. Handle them as a separate maintenance pass, still reviewing release notes and running the repo checks. Astro packages should be kept in one aligned group.

| Package                     | Locked → latest                 | Package                    | Locked → latest       |
| --------------------------- | ------------------------------- | -------------------------- | --------------------- |
| `astro`                     | `7.0.9` → `7.4.2`               | `@astrojs/cloudflare`      | `14.1.3` → `14.4.2`   |
| `@astrojs/solid-js`         | `7.0.1` → `7.1.1`               | `@astrojs/check`           | `0.9.9` → `0.9.12`    |
| `@dnd-kit/solid`            | `0.5.0` → `0.5.1`               | `@kobalte/core`            | `0.13.12` → `0.13.14` |
| `@tanstack/solid-form`      | `1.33.2` → `1.33.5`             | `@tanstack/solid-query`    | `5.101.4` → `5.104.5` |
| `@tanstack/solid-virtual`   | `3.13.36` → `3.13.49`           | `class-variance-authority` | `0.7.1` → `0.7.1`     |
| `clsx`                      | `2.1.1` → `2.1.1`               | `drizzle-orm`              | `0.45.2` → `0.45.4`   |
| `drizzle-kit`               | `0.31.10` → `0.31.11`           | `lucide-solid`             | `1.24.0` → `1.61.0`   |
| `solid-js`                  | `1.9.14` → `1.9.17`             | `solid-motionone`          | `1.0.4` → `1.0.4`     |
| `solid-sonner`              | `0.3.1` → `0.3.2`               | `@tailwindcss/vite`        | `4.3.2` → `4.3.3`     |
| `tailwindcss`               | `4.3.2` → `4.3.3`               | `tailwind-merge`           | `3.6.0` → `3.7.0`     |
| `yaml`                      | `2.9.0` → `2.9.1`               | `zod`                      | `4.4.3` → `4.6.7`     |
| `@cloudflare/workers-types` | `5.20260729.1` → `5.20261023.1` | `oxfmt`                    | `0.59.0` → `0.74.0`   |
| `oxlint`                    | `1.74.0` → `1.89.0`             |                            |                       |

No newer version on the stable `latest` tag was found for `class-variance-authority`, `clsx`, or `solid-motionone`.
The Drizzle row is the stable-tag comparison; the installed ORM/Kit versions instead use the exact 1.0 RC peer set required by Alchemy beta.83.

## Coupled release-channel changes

- **Effect:** `effect` and both platform packages moved from beta releases to stable `4.0.6` together. This is a release-channel migration despite retaining major version 4. [Effect 4 release](https://effect.website/blog/releases/effect/40) · [Effect migration guide](https://github.com/Effect-TS/effect/blob/main/MIGRATION.md)
- **Alchemy and Drizzle:** advanced Alchemy to `2.0.0-beta.83` together with the exact Drizzle ORM/Kit `1.0.0-rc.5-ab785fc` peers it requires. They remain prerelease packages; the standalone Drizzle 1 migration tooling has not been run against the database.
- **Not selected in the stable-major pass:** Solid 2 and TanStack Solid Query 6 have prerelease versions. Their compatibility requirements are detailed below. TanStack Solid Virtual's beta tag is `3.0.0-beta.68`, still declares a Solid 1 peer, and is older than the stable `3.13.49`; it is not a newer compatible major. Drizzle 1 RC was selected only as part of the Alchemy peer-compatible set above.

## Solid 2 / TanStack prerelease compatibility status

The prerelease update is not a package-only change:

- Registry metadata identifies `solid-js@next` as `2.0.0-rc.17`; Solid 2 also needs the separate `@solidjs/web` package. Solid 2 moves/renames public APIs and changes async rendering, hydration, and reactive behavior; the Solid migration guide must be followed across application code and every Solid adapter.
- `@tanstack/solid-query@rc` is `6.0.0-rc.5` and requires both Solid and `@solidjs/web` 2. Its adapter switches to Solid's async model (query reads suspend, `data` is non-optional, and `mutateAsync` is removed in favor of promise-returning `mutate`). RC5 has a reported transition failure on current Solid 2 RCs, so the gallery mutation path would need a focused runtime test.
- The official `@astrojs/solid-js@7.1.1`, `@dnd-kit/solid@0.5.1`, `solid-motionone@1.0.4`, and `solid-sonner@0.3.2` declare Solid 1 peers. There is a community Astro/Solid 2 renderer (`astro-solid-next`), but it is not the official integration and its compatibility/source could not be independently confirmed here. Adopting it would mean replacing the current renderer and testing all Astro islands.
- `@kobalte/core@2.0.0-alpha.4` has Solid 2 support but pins both Solid and `@solidjs/web` to RC16, not latest RC17. `@tanstack/solid-form@2.0.0-alpha.2` still depends on `@tanstack/solid-store@0.11.x`, whose peer contract is Solid 1; there is a published runtime import issue in this Solid 2 migration line. Do not treat its broad Solid peer range as proof of compatibility.
- `@tanstack/solid-virtual@beta` is `3.0.0-beta.68`, with a Solid 1 peer and lower semver than the installed stable `3.13.49`. The stable latest is already the appropriate choice. Solid Table 9 is already on its stable release.

Therefore, using Solid 2 and Query 6 safely requires a coordinated experimental port: replace the official Astro integration and either replace, port, or deliberately peer-override the Solid 1-only dnd, motion, toast, and form integrations. Do not silently force-install these packages as if the peer/runtime compatibility were verified. The owner must choose whether to authorize that wider app-level port and whether to pin Solid RC16 for Kobalte or accept the RC17 peer mismatch.

## Upgrade order

1. Apply selected patch/minor updates in stack-specific passes (Astro integrations, Solid/UI, data, then developer tooling), verifying each pass before starting the next.
2. If selected, upgrade the Astro group together: Astro 7.4.x, Cloudflare adapter 14.4.x, MDX 8.x, Solid integration 7.1.x, and compatible Wrangler/Markdown processor peers. Build the Worker before moving on.
3. Upgrade selected UI/data packages independently: TanStack Markdown, then Solid Table. Their call sites are limited to `ContentPreview.tsx` and `ContentTable.tsx` respectively.
4. If selected, migrate Vite+ and Vitest as one toolchain group using the official migration command, review its changes, and run tests/lint/build.
5. Keep TypeScript 6 as Astro’s checker runtime while separately testing the TypeScript 7 compiler. The Effect and Alchemy/Drizzle groups were coordinated as described above.

## Verification for each chosen group

The final verification ran the applicable repository checks in a temporary workspace to avoid filling the home filesystem:

```sh
bun run format:check
bun run lint
bun run test
bun run build
bun run check
```

`bun run check`, `bun run build`, and the TypeScript 7 compiler check passed. No deployment was run; verifying a live Cloudflare deployment remains a separate, explicitly authorized step.

## Environment note

Verification used Node `24.22.1` and Bun `1.3.14`; `/home` was full, so install, checks, and build ran in `/tmp` with a separate package cache. The home filesystem and its existing caches were left untouched.
