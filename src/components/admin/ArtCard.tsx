import { Button } from "@/components/ui/button";
import type { DraftArt } from "@/lib/art-draft";
import { useSortable } from "@dnd-kit/solid/sortable";
import { Eye, EyeOff, GripVertical, Star, Trash2 } from "lucide-solid";
import { Motion } from "solid-motionone";
import { Show, type JSX } from "solid-js";

export default function ArtCard(props: {
  item: DraftArt;
  changed: boolean;
  index: number;
  reduced: boolean;
  nameField: JSX.Element;
  onFeature: () => void;
  onVisibility: () => void;
  onDelete: () => void;
}) {
  const sortable = useSortable({
    get id() {
      return props.item.id;
    },
    get index() {
      return props.index;
    },
  });

  return (
    <Motion.article
      ref={sortable.ref}
      class="relative rounded-[14px] border bg-card p-2 shadow-sm"
      classList={{
        "border-primary ring-2 ring-primary/20": props.changed,
        "opacity-60": sortable.isDragging(),
        "ring-2 ring-primary/40": sortable.isDropTarget(),
      }}
      initial={
        props.item.file && !props.reduced
          ? { opacity: 0, transform: "translateY(12px) scale(.985)" }
          : false
      }
      animate={{
        opacity: props.item.hidden ? 0.55 : 1,
        transform: "translateY(0) scale(1)",
      }}
      hover={props.reduced ? undefined : { transform: "translateY(-2px) scale(1)" }}
      transition={{ duration: props.reduced ? 0 : 0.36, easing: [0.22, 1, 0.36, 1] }}
    >
      <Show when={props.changed}>
        <span class="absolute right-3 top-3 z-10 rounded-full bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground shadow-sm">
          Unsaved
        </span>
      </Show>
      <div class="relative">
        <img
          class="aspect-square w-full rounded-[10px] bg-muted object-cover"
          src={props.item.url}
          alt=""
        />
        <button
          ref={sortable.handleRef}
          type="button"
          aria-label={`Reorder ${props.item.name}`}
          class="absolute left-2 top-2 grid size-9 cursor-grab place-items-center rounded-md bg-background/90 shadow active:cursor-grabbing"
        >
          <GripVertical class="size-4" />
        </button>
      </div>
      {props.nameField}

      <div class="mt-2 grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant={props.item.featured ? "default" : "outline"}
          class="h-10 px-2"
          aria-label={`${props.item.featured ? "Unfeature" : "Feature"} ${props.item.name}`}
          onClick={props.onFeature}
        >
          <Star class="size-4" fill={props.item.featured ? "currentColor" : "none"} />
          <span class="sr-only">Featured</span>
        </Button>
        <Button
          type="button"
          variant={props.item.hidden ? "secondary" : "outline"}
          class="h-10 px-2"
          aria-label={`${props.item.hidden ? "Show" : "Hide"} ${props.item.name}`}
          onClick={props.onVisibility}
        >
          {props.item.hidden ? <EyeOff class="size-4" /> : <Eye class="size-4" />}
          <span class="sr-only">Visibility</span>
        </Button>
        <Button
          type="button"
          variant="destructive"
          class="h-10 px-2"
          aria-label={`Delete ${props.item.name}`}
          onClick={props.onDelete}
        >
          <Trash2 class="size-4" />
        </Button>
      </div>
    </Motion.article>
  );
}
