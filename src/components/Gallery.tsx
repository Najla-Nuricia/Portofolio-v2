import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";

export interface GalleryImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export default function Gallery(props: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = createSignal<number>();
  const active = () => {
    const index = activeIndex();
    return index === undefined ? undefined : props.images[index];
  };
  const move = (direction: number) => {
    const index = activeIndex();
    if (index === undefined) return;
    setActiveIndex((index + direction + props.images.length) % props.images.length);
  };

  return (
    <>
      <div class="columns-1 gap-4 sm:columns-2 sm:gap-6">
        <For each={props.images}>
          {(image, index) => (
            <Button
              class="group mb-4 h-auto min-h-11 w-full touch-manipulation cursor-zoom-in break-inside-avoid overflow-hidden rounded-[14px] border border-white/80 bg-card p-2 shadow-sm transition-[transform,box-shadow] hover:-translate-y-1 hover:bg-card hover:shadow-md sm:mb-6"
              variant="ghost"
              type="button"
              aria-label={`Open ${image.alt}`}
              onClick={() => setActiveIndex(index())}
            >
              <span class="relative block w-full overflow-hidden rounded-[9px] border bg-muted/40">
                <img
                  class="h-auto w-full [image-rendering:pixelated] transition-transform duration-300 group-hover:scale-[1.015]"
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt={image.alt}
                  loading="lazy"
                />
                <span class="absolute bottom-2 right-2 rounded-[5px] border border-white/75 bg-card/80 px-2 py-1 font-mono text-[9px] text-muted-foreground backdrop-blur">
                  {String(index() + 1).padStart(2, "0")}
                </span>
              </span>
            </Button>
          )}
        </For>
      </div>

      <Dialog open={activeIndex() !== undefined} onOpenChange={(open) => !open && setActiveIndex()}>
        <DialogContent class="max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden rounded-[16px] border-white/80 bg-card p-2 shadow-2xl sm:max-h-[94vh] sm:w-auto sm:max-w-[94vw] sm:p-3">
          <Show when={active()}>
            {(image) => (
              <>
                <DialogTitle class="sr-only">{image().alt}</DialogTitle>
                <DialogDescription class="sr-only">Enlarged gallery image</DialogDescription>
                <div class="grid max-h-[calc(100dvh-5rem)] place-items-center overflow-auto rounded-[11px] border bg-muted/45 p-2 sm:max-h-[86vh] sm:p-4">
                  <img
                    class="max-h-[calc(100dvh-8rem)] max-w-full object-contain [image-rendering:pixelated] sm:max-h-[78vh] sm:max-w-[86vw]"
                    src={image().src}
                    width={image().width}
                    height={image().height}
                    alt={image().alt}
                  />
                </div>
                <div class="flex items-center justify-between gap-4 px-2 pb-1 pt-3">
                  <span class="font-mono text-[10px] text-muted-foreground">
                    {String((activeIndex() ?? 0) + 1).padStart(2, "0")} /{" "}
                    {String(props.images.length).padStart(2, "0")}
                  </span>
                  <Show when={props.images.length > 1}>
                    <div class="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        class="size-10 rounded-[8px]"
                        type="button"
                        aria-label="Previous image"
                        onClick={() => move(-1)}
                      >
                        <ChevronLeft class="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        class="size-10 rounded-[8px]"
                        type="button"
                        aria-label="Next image"
                        onClick={() => move(1)}
                      >
                        <ChevronRight class="size-4" />
                      </Button>
                    </div>
                  </Show>
                </div>
              </>
            )}
          </Show>
        </DialogContent>
      </Dialog>
    </>
  );
}
