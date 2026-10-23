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
const revealBatchSize = 8;

export default function ArtGallery(props: { art: ArtGalleryItem[] }) {
  const [visibleCount, setVisibleCount] = createSignal(Math.min(previewCount, props.art.length));
  const [newlyVisible, setNewlyVisible] = createSignal(new Set<string>());
  const [selected, setSelected] = createSignal<ArtGalleryItem>();
  const [reduced, setReduced] = createSignal(
    typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [columns, setColumns] = createSignal(2);
  const visible = createMemo(() => props.art.slice(0, visibleCount()));
  const itemsForColumn = (column: number) =>
    visible().filter((_, index) => index % columns() === column);
  const hasMore = () => visibleCount() < props.art.length;

  const updateVisibleCount = () => {
    if (!hasMore()) {
      setVisibleCount(Math.min(previewCount, props.art.length));
      setNewlyVisible(new Set<string>());
      return;
    }

    const start = visibleCount();
    const next = Math.min(start + revealBatchSize, props.art.length);
    setNewlyVisible(
      (current) => new Set([...current, ...props.art.slice(start, next).map((item) => item.id)]),
    );
    setVisibleCount(next);
  };

  onMount(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 64rem)");
    const updateReduced = () => setReduced(motion.matches);
    const updateColumns = () => setColumns(desktop.matches ? 3 : 2);
    motion.addEventListener("change", updateReduced);
    desktop.addEventListener("change", updateColumns);
    updateReduced();
    updateColumns();
    onCleanup(() => {
      motion.removeEventListener("change", updateReduced);
      desktop.removeEventListener("change", updateColumns);
    });
  });

  const masonry = () => (
    <div
      class="grid w-full min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] items-start gap-2.5 sm:gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))] lg:gap-5"
      aria-label="Art gallery"
      id="art-gallery-grid"
    >
      <For each={Array.from({ length: columns() }, (_, column) => column)}>
        {(column) => (
          <div class="art-gallery-column grid min-w-0 content-start gap-2.5 sm:gap-4 lg:gap-5">
            <For each={itemsForColumn(column)}>
              {(item, index) => (
                <Motion.button
                  type="button"
                  class="group block w-full min-w-0 max-w-full cursor-zoom-in overflow-hidden rounded-[10px] p-0 text-left active:scale-[0.985] sm:rounded-[14px]"
                  classList={{
                    "art-tile-enter": newlyVisible().has(item.id) && !reduced(),
                  }}
                  style={{
                    "--art-reveal-delay": `${Math.min(index() * 35, 175)}ms`,
                    "--art-reveal-tilt": index() % 2 ? "0.6deg" : "-0.6deg",
                  }}
                  hover={
                    reduced()
                      ? undefined
                      : {
                          transform: `translateY(-3px) rotate(${index() % 2 ? "0.35deg" : "-0.35deg"}) scale(1.005)`,
                        }
                  }
                  transition={{
                    duration: reduced() ? 0 : 0.22,
                    easing: [0.22, 1, 0.36, 1],
                  }}
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
            aria-controls="art-gallery-grid"
            aria-expanded={visibleCount() > previewCount}
            onClick={updateVisibleCount}
          >
            <span>
              {hasMore()
                ? `See ${Math.min(revealBatchSize, props.art.length - visibleCount())} more artworks`
                : "Show fewer artworks"}
            </span>
            <span class="font-mono text-[10px] text-muted-foreground">
              {visibleCount()} / {props.art.length}
            </span>
            <span aria-hidden="true">{hasMore() ? "↓" : "↑"}</span>
          </button>
        </Show>
      </div>

      <Dialog open={Boolean(selected())} onOpenChange={(open) => !open && setSelected()}>
        <DialogContent class="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-6xl overflow-hidden border-0 bg-transparent p-0 shadow-none max-[640px]:pt-16">
          <Show when={selected()}>
            {(piece) => (
              <Motion.figure
                class="m-0 grid max-h-[calc(100dvh-2rem)] place-items-center max-[640px]:max-h-[calc(100dvh-6rem)]"
                initial={
                  reduced() ? false : { opacity: 0, transform: "translateY(10px) scale(0.985)" }
                }
                animate={{ opacity: 1, transform: "translateY(0) scale(1)" }}
                transition={{ duration: reduced() ? 0 : 0.3, easing: [0.22, 1, 0.36, 1] }}
              >
                <img
                  class="max-h-[calc(100dvh-6rem)] max-w-full rounded-[12px] object-contain shadow-2xl max-[640px]:max-h-[calc(100dvh-9rem)]"
                  src={piece().src}
                  alt={piece().name}
                />
                <figcaption class="mt-3 rounded-full bg-background/90 px-4 py-2 text-sm text-foreground backdrop-blur">
                  <DialogTitle class="text-sm font-normal">{piece().name}</DialogTitle>
                  <DialogDescription class="sr-only">
                    Full-size preview of {piece().name}
                  </DialogDescription>
                </figcaption>
              </Motion.figure>
            )}
          </Show>
        </DialogContent>
      </Dialog>
    </>
  );
}
