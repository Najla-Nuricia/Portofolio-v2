# Najla Portfolio

Najla Nuricia Laudy's public Astro portfolio and private Git-backed authoring area.

## Development

```bash
vp install
vp run dev
vp check
```

## Deployment

Pushes to `main` deploy through `.github/workflows/deploy.yml` using Alchemy and Cloudflare Workers.

Required GitHub Actions secrets:

- `ALCHEMY_PASSWORD`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `PORTFOLIO_GITHUB_TOKEN` — fine-grained token with repository Contents read/write access

Cloudflare Access protects `/admin/*` and `/api/admin/*` for the two configured author emails.
