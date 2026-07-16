import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

const DOMAIN = Config.string("PORTFOLIO_DOMAIN").pipe(Config.withDefault("nacia.ryuko.my.id"));
const GITHUB_REPOSITORY = Config.string("GITHUB_REPOSITORY").pipe(
  Config.withDefault("Najla-Nuricia/Portofolio-v2"),
);
const GITHUB_TOKEN = Config.redacted("GITHUB_TOKEN");
const AUTHOR_EMAILS = Config.string("CF_ACCESS_AUTHOR_EMAILS").pipe(
  Config.withDefault("syahrul4w@gmail.com,najlalaudy@gmail.com"),
  Config.map((emails) =>
    emails
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean),
  ),
);

export default Alchemy.Stack(
  "najla-portfolio",
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
    const domain = yield* DOMAIN;
    const authors = yield* Cloudflare.Access.Policy("PortfolioAuthors", {
      name: "Najla Portfolio authors",
      decision: "allow",
      include: (yield* AUTHOR_EMAILS).map((email) => ({ email: { email } })),
      sessionDuration: "24h",
    });

    yield* Cloudflare.Access.Application("PortfolioAdmin", {
      name: "Najla Portfolio authoring area",
      type: "self_hosted",
      domain: `${domain}/admin`,
      policies: [authors.policyId],
      sessionDuration: "24h",
    });
    yield* Cloudflare.Access.Application("PortfolioPublishingApi", {
      name: "Najla Portfolio publishing API",
      type: "self_hosted",
      domain: `${domain}/api/admin`,
      policies: [authors.policyId],
      sessionDuration: "24h",
    });

    const worker = yield* Cloudflare.Worker("Portfolio", {
      main: "./dist/server/entry.mjs",
      assets: "./dist/client",
      compatibility: { flags: ["nodejs_compat"] },
      domain,
      env: {
        IMAGES: Cloudflare.Images.Images(),
        GITHUB_REPOSITORY: yield* GITHUB_REPOSITORY,
        GITHUB_TOKEN: yield* GITHUB_TOKEN,
      },
    });

    return { url: worker.url };
  }),
);
