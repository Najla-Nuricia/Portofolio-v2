import { createEffect, createSignal, onCleanup, Show, type Component } from "solid-js";
import { render } from "solid-js/web";
import * as runtime from "solid-js/h/jsx-runtime";
import type { MediaAsset } from "./types";

export default function ContentPreview(props: { source: string; media: MediaAsset[] }) {
  const [error, setError] = createSignal("");
  let preview!: HTMLElement;

  createEffect(() => {
    const source = props.source;
    let dispose: (() => void) | undefined;
    const timeout = window.setTimeout(async () => {
      try {
        const [{ evaluate }, { default: remarkFrontmatter }, { default: remarkGfm }] =
          await Promise.all([
            import("@mdx-js/mdx"),
            import("remark-frontmatter"),
            import("remark-gfm"),
          ]);
        const module = await evaluate(source, {
          ...runtime,
          baseUrl: import.meta.url,
          remarkPlugins: [remarkFrontmatter, remarkGfm],
        });
        const Preview = module.default as Component<{ components: { img: typeof image } }>;
        preview.replaceChildren();
        dispose = render(() => Preview({ components: { img: image } }), preview);
        setError("");
      } catch (cause) {
        preview?.replaceChildren();
        setError(cause instanceof Error ? cause.message : "Preview failed");
      }
    }, 250);

    onCleanup(() => {
      window.clearTimeout(timeout);
      dispose?.();
    });
  });

  const image = (imageProps: { src?: string; alt?: string }) => {
    const asset = props.media.find((item) => item.path === imageProps.src);
    return <img {...imageProps} src={asset?.url ?? imageProps.src} loading="lazy" />;
  };

  return (
    <section class="min-h-80 overflow-hidden rounded-[12px] border bg-card shadow-[inset_0_1px_0_white] sm:min-h-120">
      <header class="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
        <span class="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
          MDX preview
        </span>
        <span class="size-2 rounded-full bg-secondary" />
      </header>
      <div class="p-5 sm:p-7">
        <Show when={error()}>
          <p class="mb-5 rounded-[8px] border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error()}
          </p>
        </Show>
        <article ref={(element) => (preview = element)} class="admin-mdx-preview" />
      </div>
    </section>
  );
}
