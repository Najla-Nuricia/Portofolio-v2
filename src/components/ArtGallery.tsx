import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Motion } from "solid-motionone";
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";

export interface ArtGalleryItem {
  id: string;
  name: string;
  src: string;
  featured: boolean;
}

const previewCount = 8;
const columnGroups = (items: ArtGalleryItem[], columns: number) => {
  const groups = Array.from({ length: columns }, () => [] as ArtGalleryItem[]);
  items.forEach((item, index) => groups[index % columns].push(item));
  return groups;
};

export default function ArtGallery(props: { art: ArtGalleryItem[] }) {
  const [expanded, setExpanded] = createSignal(false);
  const [selected, setSelected] = createSignal<ArtGalleryItem>();
  const [reduced, setReduced] = createSignal(false);
  const [columns, setColumns] = createSignal(2);
  const visible = createMemo(() => (expanded() ? props.art : props.art.slice(0, previewCount)));

  onMount(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const desktop = matchMedia("(min-width: 64rem)");
    const updateColumns = () => setColumns(desktop.matches ? 3 : 2);
    desktop.addEventListener("change", updateColumns);
    updateColumns();
    onCleanup(() => desktop.removeEventListener("change", updateColumns));
  });

  const masonry = () => (
    <div
      class="grid w-full min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] items-start gap-2.5 sm:gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))] lg:gap-5"
      aria-label="Art gallery"
    >
      <For each={columnGroups(visible(), columns())}>
        {(group) => (
          <div class="grid min-w-0 content-start gap-2.5 sm:gap-4 lg:gap-5">
            <For each={group}>
              {(item) => (
                <Motion.button
                  type="button"
                  class="group block w-full min-w-0 max-w-full cursor-zoom-in overflow-hidden rounded-[10px] p-0 text-left active:scale-[0.985] sm:rounded-[14px]"
                  initial={false}
                  hover={reduced() ? undefined : { transform: "translateY(-3px) scale(1)" }}
                  transition={{ duration: reduced() ? 0 : 0.22, easing: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelected(item)}
                >
                  <img
                    class="block h-auto w-full max-w-full rounded-[8px] object-contain transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.015] sm:rounded-[12px]"
                    src={item.src}
                    alt={item.name}
                    loading="lazy"
                  />
                </Motion.button>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );

  return (
    <>
      <div>
        {masonry()}

        <Show when={props.art.length > previewCount}>
          <button
            type="button"
            class="button secondary group mx-auto mt-8 flex cursor-pointer active:scale-[0.97]"
            aria-expanded={expanded()}
            onClick={() => setExpanded((value) => !value)}
          >
            <span>
              {expanded() ? "Show fewer artworks" : `View all ${props.art.length} artworks`}
            </span>
            <span
              aria-hidden="true"
              class="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-aria-expanded:rotate-180"
            >
              ↓
            </span>
          </button>
        </Show>
      </div>

      <Dialog open={Boolean(selected())} onOpenChange={(open) => !open && setSelected()}>
        <DialogContent class="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-6xl overflow-hidden border-0 bg-transparent p-0 shadow-none">
          <Show when={selected()}>
            {(piece) => (
              <figure class="m-0 grid max-h-[calc(100dvh-2rem)] place-items-center">
                <img
                  class="max-h-[calc(100dvh-6rem)] max-w-full rounded-[12px] object-contain shadow-2xl"
                  src={piece().src}
                  alt={piece().name}
                />
                <figcaption class="mt-3 rounded-full bg-background/90 px-4 py-2 text-sm text-foreground backdrop-blur">
                  <DialogTitle class="text-sm font-normal">{piece().name}</DialogTitle>
                  <DialogDescription class="sr-only">
                    Full-size preview of {piece().name}
                  </DialogDescription>
                </figcaption>
              </figure>
            )}
          </Show>
        </DialogContent>
      </Dialog>
    </>
  );
}
