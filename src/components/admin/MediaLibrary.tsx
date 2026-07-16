import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-solid";
import { For, Show } from "solid-js";
import type { MediaAsset, PendingMedia } from "./types";

export default function MediaLibrary(props: {
  existing: MediaAsset[];
  pending: PendingMedia[];
  onInsert: (path: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <Show when={props.existing.length || props.pending.length}>
      <section class="mt-4 rounded-[12px] border bg-muted/35 p-4">
        <div class="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-medium">Media library</h3>
            <p class="mt-1 text-xs text-muted-foreground">
              Select an image to insert it at the editor cursor.
            </p>
          </div>
          <span class="rounded-[6px] border bg-card px-2 py-1 font-mono text-[10px] text-muted-foreground">
            {props.existing.length + props.pending.length} files
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <For each={props.existing}>
            {(asset) => (
              <Button
                type="button"
                variant="outline"
                class="group relative h-auto min-w-0 flex-col overflow-hidden p-1.5"
                title={`Insert ${asset.path}`}
                onClick={() => props.onInsert(asset.path)}
              >
                <span class="grid aspect-square w-full place-items-center overflow-hidden rounded-[6px] bg-muted">
                  <img
                    class="size-full object-contain [image-rendering:pixelated]"
                    src={asset.url}
                    width="320"
                    height="320"
                    loading="lazy"
                    alt=""
                  />
                </span>
                <span class="w-full truncate px-1 py-1 text-left font-mono text-[10px] text-muted-foreground">
                  {asset.name}
                </span>
              </Button>
            )}
          </For>
          <For each={props.pending}>
            {(asset, index) => (
              <div class="relative min-w-0 rounded-[9px] border border-primary/40 bg-card p-1.5 shadow-xs">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="absolute right-2 top-2 z-10 size-8 bg-card/90"
                  aria-label={`Remove ${asset.file.name}`}
                  onClick={() => props.onRemove(index())}
                >
                  <X class="size-3.5" />
                </Button>
                <button
                  type="button"
                  class="block w-full text-left"
                  title={`Insert ${asset.path}`}
                  onClick={() => props.onInsert(asset.path)}
                >
                  <span class="grid aspect-square w-full place-items-center overflow-hidden rounded-[6px] bg-muted">
                    <img
                      class="size-full object-contain [image-rendering:pixelated]"
                      src={asset.url}
                      width="320"
                      height="320"
                      alt=""
                    />
                  </span>
                  <span class="mt-1 flex min-w-0 items-center gap-1 px-1 py-1 font-mono text-[10px] text-muted-foreground">
                    <ImagePlus class="size-3 shrink-0 text-primary" />
                    <span class="truncate">{asset.file.name}</span>
                  </span>
                </button>
              </div>
            )}
          </For>
        </div>
      </section>
    </Show>
  );
}
