# Najla Portfolio

Najla Nuricia Laudy's public Astro portfolio and private Git-backed authoring area.

## Development

```bash
vp install
vp run dev
vp check
```

## Deployment

Deploy manually from a machine authenticated with the Alchemy CLI:

```bash
GITHUB_TOKEN=<fine-grained-repository-token> vp run deploy
```

`vp run deploy` builds once, then provisions the Worker and Cloudflare Access. The local Alchemy profile supplies Cloudflare authentication. Access protects `/admin/*` and `/api/admin/*` for the configured author emails.
