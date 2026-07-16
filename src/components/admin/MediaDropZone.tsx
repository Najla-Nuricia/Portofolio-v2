import { ImagePlus, Upload } from "lucide-solid";

export default function MediaDropZone(props: { onSelect: (files: File[]) => void }) {
  return (
    <label
      class="group mt-5 grid min-h-36 cursor-pointer touch-manipulation place-items-center rounded-[12px] border border-dashed bg-muted/25 p-5 text-center transition-colors hover:border-primary/55 hover:bg-primary/5 focus-within:ring-[1.5px] focus-within:ring-ring"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        props.onSelect([...(event.dataTransfer?.files ?? [])]);
      }}
    >
      <input
        class="sr-only"
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          props.onSelect([...(event.currentTarget.files ?? [])]);
          event.currentTarget.value = "";
        }}
      />
      <span>
        <span class="mx-auto grid size-10 place-items-center rounded-full border bg-card text-primary shadow-xs transition-transform group-hover:-translate-y-0.5">
          <Upload class="size-4" />
        </span>
        <span class="mt-3 block text-sm font-medium">Drop images here or browse</span>
        <span class="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ImagePlus class="size-3.5" />
          Multiple images · PNG, JPG, GIF, WebP
        </span>
      </span>
    </label>
  );
}
