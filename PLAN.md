# Najla Portfolio — Plan

## Status

**Phase 6 configuration complete.** Deployment code, Cloudflare Access policies, GitHub Actions, and Git remote are prepared. Production secrets still need configuring.

### Done

- **Phase 1:** Astro 7.0.9, Vite 8.1.4, TypeScript 6.0.3, Solid, Cloudflare adapter, Tailwind v4, CuteSpringTheme tokens, Oxlint/Oxfmt, `vp` toolchain.
- **Phase 2:** Content collections (Work, Project, Education, Tool, Settings) with Zod 4. Verified seed content: 2 Work, 6 Projects, 3 Tools.
- **Phase 3:** Public portfolio: homepage, project details, ProjectCard, 404/500, BaseLayout (SEO/OG), StudioRail (floating nav), MotionReveal, Gallery with shadcn Dialog lightbox.
- **Phase 4:** Admin UI: ContentTable, ContentEditor, AuthoringApp, MediaLibrary, ContentPreview. TanStack Form/Table/Query. shadcn-solid UI components (Button, TextField, TextArea, Select, Table, Alert, Dialog). Git publishing via GitHub Trees API (atomic, conflict-aware). Media upload (local file → base64 → Git). Existing media library with click-to-insert MDX images. Live MDX preview (client-side `@mdx-js/mdx` with `solid-js/h/jsx-runtime`). Responsive Soft Studio Workbench design.

### Remaining

1. Configure GitHub Actions and Cloudflare production secrets.
2. Push `main` and verify the first production deployment.

Final responsive/accessibility QA was explicitly skipped.

---

## Goal

Build Najla Nuricia Laudy's English portfolio at `nacia.ryuko.my.id`: a public Astro portfolio plus Cloudflare Access-protected `/admin` authoring area. Content is Git-backed MDX/local media, authored through the site and deployed to Cloudflare Workers with Alchemy.

## Decisions

- Astro + Solid + MDX; Cloudflare Worker runtime.
- `vp` toolchain with Oxlint/Oxfmt.
- shadcn-solid UI, CuteSpringTheme tokens.
- `solid-motionone` for reduced-motion-safe UI motion.
- TanStack Form Solid for editors; TanStack Table for authoring lists; TanStack Virtual only for long Project masonry galleries.
- Public: editorial use of CuteSpring palette, clean sans typography, responsive one-page portfolio.
- Authoring: full CuteSpringTheme UI at `/admin`.
- Cloudflare Access email OTP: `syahrul4w@gmail.com`, `najlalaudy@gmail.com`; protect `/admin/*`, `/api/admin/*`.
- Alchemy provisions the Worker and Cloudflare Access policy/application, following `../../Javascript/dearly/infra/alchemy.run.ts`.
- Content bundle: `src/content/<collection>/<slug>/index.mdx` with local media beside it.
- Collections: Work, Project, Education, Tool, Portfolio settings.
- Project has 0..1 Work; Work has many Projects; Project has many reusable Tools.
- All content has explicit ascending `order` and `published`. Project slugs are generated before first Publish and immutable after it.
- Publish commits content through a shared `najla-portfolio-bot` Git identity, including the Access author's email in the message. Failed/409 writes retain form input; conflicts require refresh/reapply.
- No drafts/autosave, analytics, R2, custom authentication, public Work/Education listings, or fake portfolio entries.
- Home: Hero → Work → Projects → Education → Contact. Project details at `/project/[slug]`, with previous/next links, masonry Gallery, dialog lightbox, and 404 after deletion.
- Initial content: two verified Work records; six verified Projects from Itch.io; Mask Diary marked In development. Download source images into local content bundles and preserve source links/credit.
- MDX preview uses `@mdx-js/mdx` client-side with `solid-js/h/jsx-runtime`, not a server endpoint. WASM-based parsers (Sätteri) removed.

## File Layout

```txt
infra/                         Alchemy stack and Cloudflare Access resources
src/
  components/
    admin/                     authoring Solid components plus focused types/path/media modules
    ui/                        shadcn-solid primitives (Button, TextField, TextArea, Select, Table, Alert, Dialog)
    Gallery.tsx                public project gallery + lightbox
    MotionReveal.tsx            scroll-triggered reveal animation
    ProjectCard.astro           public project card
    StudioRail.astro           floating navigation rail
  pages/
    index.astro                public homepage
    project/[slug].astro       public project detail
    404.astro, 500.astro       error pages
    admin/index.astro          admin entry (loads AuthoringApp with server-gathered data)
    api/admin/publish.ts       Git publishing endpoint
  layouts/BaseLayout.astro
  content/                     verified content bundles
  content.config.ts            collection schemas
  lib/                         github.ts, content.ts, date.ts, utils.ts
  styles/global.css            theme tokens, typography, utilities
```

## Phases

1. ~~Initialize package/tooling~~ ✅
2. ~~Add content collection schemas, seed verified records/media~~ ✅
3. ~~Build public layout, homepage, project detail, gallery, motion~~ ✅
4. ~~Build admin UI, Git publishing, media handling, MDX preview~~ ✅
5. ~~Deletion integrity, real HTTP 404, settings publishing~~ ✅
6. ~~Add Alchemy Worker/Access stack and GitHub Actions deployment.~~ ✅
7. Configure production secrets and deploy. Final QA skipped by request.

## Concrete Steps

1. ~~Confirm `PLAN.md` then initialize the Astro project/dependencies.~~
2. ~~Add schemas and verified seed content.~~
3. ~~Build public portfolio and Project experiences.~~
4. ~~Build Authoring UI and Git publishing API.~~
5. ~~Implement deletion integrity (Tool refs, Work refs, Project bundles).~~ ✅
6. ~~Real HTTP 404 for missing/unpublished Projects.~~ ✅
7. ~~Settings editing/publishing.~~ ✅
8. ~~Final QA pass.~~ Skipped by request.
9. ~~Add Alchemy/Access/deployment configuration and GitHub target.~~ ✅
10. Configure repository secrets, push `main`, and verify production.

## Materials

### Product references

- Current behavior reference: https://portofolio-self-chi.vercel.app/
- Visual token source — CuteSpringTheme: https://tweakcn.com/themes/cmr5kll1g000004jxcs7c0gl5
- Public portfolio owner: https://nacila.itch.io/
- Astronaut Farm: https://nacila.itch.io/16-x-16-astronaut-farm
- RPG Cute Pixel Game Asset: https://nacila.itch.io/free-16-x-16-rpg-cute-pixel-game-asset
- Cartoon Platformer: https://nacila.itch.io/cartoon-platformer-16-x-16
- Cute Fruit Maid: https://nacila.itch.io/cute-fruit-maid
- Cute Café Furniture: https://nacila.itch.io/free-32x32-cute-cafe-furniture
- Mask Diary source: https://github.com/Najla-Nuricia/Mask-Diary

### Stack documentation

- Astro: https://docs.astro.build/en/getting-started/
- Astro Cloudflare: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- shadcn-solid: https://shadcn-solid.com/
- Alchemy v2: https://v2.alchemy.run/getting-started/
- TanStack Form Solid: https://tanstack.com/form/latest/docs/framework/solid/overview
- solid-motionone: https://github.com/solidjs-community/solid-motionone
- Cloudflare Access: https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/
