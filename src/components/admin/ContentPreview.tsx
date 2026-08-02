import { createEffect, createSignal, Show } from "solid-js";
import { renderHtml } from "@tanstack/markdown/html";
import type { MediaAsset } from "./types";

export default function ContentPreview(props: { source: string; media: MediaAsset[] }) {
  const [error, setError] = createSignal("");
  let preview!: HTMLElement;

  createEffect(() => {
    const source = props.source;
    if (!source) {
      preview.innerHTML = "";
      setError("");
      return;
    }
    const timeout = window.setTimeout(() => {
      try {
        preview.innerHTML = renderHtml(source, { frontmatter: true });
        for (const img of preview.querySelectorAll("img")) {
          const src = img.getAttribute("src");
          if (!src) continue;
          const asset = props.media.find((item) => item.path === src);
          if (asset) img.src = asset.url;
        }
        setError("");
      } catch (cause) {
        preview.innerHTML = "";
        setError(cause instanceof Error ? cause.message : "Preview failed");
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  });

  return (
    <section class="flex h-80 flex-col overflow-hidden rounded-[12px] border bg-card shadow-[inset_0_1px_0_white] sm:h-120">
      <header class="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
        <span class="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
          Markdown preview
        </span>
        <span class="size-2 rounded-full bg-secondary" />
      </header>
      <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
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
