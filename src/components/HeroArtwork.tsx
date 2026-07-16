import { ChevronLeft, ChevronRight } from "lucide-solid";
import { Motion, Presence } from "solid-motionone";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

interface Artwork {
  src: string;
  width: number;
  height: number;
  title: string;
}

export default function HeroArtwork(props: { artworks: Artwork[] }) {
  const [index, setIndex] = createSignal(0);
  const [paused, setPaused] = createSignal(false);
  const [reduced, setReduced] = createSignal(false);
  const move = (step: number) =>
    setIndex((current) => (current + step + props.artworks.length) % props.artworks.length);

  onMount(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const timer = window.setInterval(() => !paused() && !reduced() && move(1), 4500);
    onCleanup(() => window.clearInterval(timer));
  });

  const artwork = () => props.artworks[index()];

  return (
    <div
      class="relative ml-auto w-full max-w-130"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusIn={() => setPaused(true)}
      onFocusOut={() => setPaused(false)}
    >
      <div class="absolute inset-8 translate-x-5 translate-y-5 rounded-[24px] border bg-secondary/45" />
      <div class="relative overflow-hidden rounded-[20px] border border-white/80 bg-card p-3 shadow-[0_30px_80px_-40px_oklch(0.38_0.07_20/.55),0_2px_8px_-3px_oklch(0.38_0.07_20/.2),inset_0_1px_0_white]">
        <div class="flex items-center justify-between border-b px-2 pb-3 text-[11px] text-muted-foreground">
          <span class="max-w-64 truncate">{artwork()?.title}</span>
          <span class="font-mono tabular-nums">
            {String(index() + 1).padStart(2, "0")} /{" "}
            {String(props.artworks.length).padStart(2, "0")}
          </span>
        </div>
        <div class="relative mt-3 grid aspect-[4/5] place-items-center overflow-hidden rounded-[13px] border bg-muted">
          <Presence initial={false}>
            <Show when={artwork()} keyed>
              {(item) => (
                <Motion.div
                  class="absolute inset-0 grid place-items-center"
                  initial={
                    reduced() ? false : { opacity: 0, transform: "translateX(18px) scale(.985)" }
                  }
                  animate={{ opacity: 1, transform: "translateX(0) scale(1)" }}
                  exit={
                    reduced()
                      ? undefined
                      : { opacity: 0, transform: "translateX(-12px) scale(.99)" }
                  }
                  transition={{ duration: reduced() ? 0 : 0.42, easing: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    class="absolute inset-0 size-full scale-110 object-cover opacity-20 blur-2xl"
                    src={item.src}
                    alt=""
                    aria-hidden="true"
                  />
                  <img
                    class="relative z-10 max-h-[82%] max-w-[84%] object-contain drop-shadow-[0_24px_18px_oklch(0.35_0.03_20/.24)] [image-rendering:pixelated]"
                    src={item.src}
                    width={item.width}
                    height={item.height}
                    alt={`${item.title} artwork by Najla`}
                  />
                </Motion.div>
              )}
            </Show>
          </Presence>
          <div class="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between">
            <button
              class="grid size-10 place-items-center rounded-[9px] border border-white/80 bg-card/90 text-foreground shadow-sm backdrop-blur transition-transform hover:-translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              type="button"
              aria-label="Previous artwork"
              onClick={() => move(-1)}
            >
              <ChevronLeft class="size-4" />
            </button>
            <div class="flex gap-1.5" aria-label="Artwork selection">
              {props.artworks.map((item, itemIndex) => (
                <button
                  class="h-1.5 rounded-full bg-foreground/20 transition-[width,background-color]"
                  classList={{
                    "w-5 bg-foreground/70": itemIndex === index(),
                    "w-1.5": itemIndex !== index(),
                  }}
                  type="button"
                  aria-label={`Show ${item.title}`}
                  aria-current={itemIndex === index() ? "true" : undefined}
                  onClick={() => setIndex(itemIndex)}
                />
              ))}
            </div>
            <button
              class="grid size-10 place-items-center rounded-[9px] border border-white/80 bg-card/90 text-foreground shadow-sm backdrop-blur transition-transform hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              type="button"
              aria-label="Next artwork"
              onClick={() => move(1)}
            >
              <ChevronRight class="size-4" />
            </button>
          </div>
        </div>
      </div>
      <span class="absolute -left-1 top-10 -rotate-3 rounded-[8px] border bg-accent px-3 py-2 text-xs text-accent-foreground shadow-[0_8px_20px_-12px_currentColor]">
        Tiny worlds, big feeling ✦
      </span>
    </div>
  );
}
