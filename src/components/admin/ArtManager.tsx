import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { deleteArtItem, saveArt } from "@/lib/art-admin";
import {
  artManifest,
  moveDraft,
  toggleFeatured,
  updateDraft,
  type DraftArt,
} from "@/lib/art-draft";
import { DragDropProvider } from "@dnd-kit/solid";
import { isSortable } from "@dnd-kit/solid/sortable";
import { createForm } from "@tanstack/solid-form";
import { QueryClient, QueryClientProvider, createMutation } from "@tanstack/solid-query";
import { ImagePlus } from "lucide-solid";
import { toast } from "solid-sonner";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import AdminShell from "./AdminShell";
import ArtCard from "./ArtCard";
import { mediaName } from "./paths";

export interface AdminArtItem {
  id: string;
  name: string;
  image: string;
  order: number;
  featured: boolean;
  hidden: boolean;
  url: string;
}

const queryClient = new QueryClient();

function ArtManagerContent(props: { initial: AdminArtItem[]; author: string }) {
  const [items, setItems] = createSignal<DraftArt[]>(props.initial);
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<string>();
  const [reduced, setReduced] = createSignal(false);
  const [changed, setChanged] = createSignal<Set<string>>(new Set());
  const names = createForm(() => ({
    defaultValues: Object.fromEntries(props.initial.map(({ id, name }) => [id, name])),
  }));

  onMount(() => setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches));

  const markChanged = (id: string) => setChanged((ids) => new Set(ids).add(id));
  const change = (id: string, fields: Partial<DraftArt>) => {
    setItems(updateDraft(items(), id, fields));
    markChanged(id);
  };

  const add = (files: File[]) => {
    const used = new Set(items().map((item) => item.image));
    const additions = files.flatMap((file, index) => {
      if (!file.type.startsWith("image/")) return [];
      let image = mediaName(file.name);
      let suffix = 2;
      while (used.has(image)) {
        const dot = image.lastIndexOf(".");
        image = `${image.slice(0, dot)}-${suffix++}${image.slice(dot)}`;
      }
      used.add(image);
      return [
        {
          id: crypto.randomUUID(),
          name: file.name.replace(/\.[^.]+$/, ""),
          image,
          order: items().length + index,
          featured: false,
          hidden: false,
          url: URL.createObjectURL(file),
          file,
        },
      ];
    });
    setItems([...items(), ...additions]);
    setChanged((ids) => new Set([...ids, ...additions.map((item) => item.id)]));
  };

  const saveMutation = createMutation(() => ({ mutationFn: saveArt }));
  const deleteMutation = createMutation(() => ({ mutationFn: deleteArtItem }));

  const feature = (id: string) => {
    setItems(toggleFeatured(items(), id));
    markChanged(id);
  };

  const remove = async (item: DraftArt) => {
    if (item.file) {
      URL.revokeObjectURL(item.url);
      setItems(items().filter((entry) => entry.id !== item.id));
      setChanged((ids) => {
        const next = new Set(ids);
        next.delete(item.id);
        return next;
      });
      return;
    }
    setError();
    try {
      await deleteMutation.mutateAsync(item.id);
      setItems(items().filter((entry) => entry.id !== item.id));
      toast.success(`Deleted ${item.name}`);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Artwork deletion failed";
      toast.error(message);
      setError(message);
    }
  };

  const move = (source: string, from: number, to: number) => {
    if (from === to) return;
    setItems((current) => {
      const target = current[to];
      return target ? moveDraft(current, source, target.id) : current;
    });
    markChanged(source);
  };

  const save = async () => {
    setPending(true);
    setError();
    try {
      const uploads = new FormData();
      uploads.set("manifest", JSON.stringify(artManifest(items(), names.state.values)));
      for (const item of items()) if (item.file) uploads.append("images", item.file, item.image);
      await saveMutation.mutateAsync(uploads);
      toast.success("Gallery saved");
      location.reload();
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "Publish failed. Your edits are retained.";
      toast.error(message);
      setError(message);
    } finally {
      setPending(false);
    }
  };

  onCleanup(() => {
    for (const item of items()) if (item.file) URL.revokeObjectURL(item.url);
  });

  return (
    <AdminShell author={props.author}>
      <section class="rounded-[16px] border border-white/80 bg-card/90 p-4 shadow-md backdrop-blur sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span class="text-xs text-muted-foreground">Gallery manager</span>
            <h2 class="mt-1 text-3xl">Art</h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Upload, drag to order, feature, hide, rename, or remove artwork.
            </p>
          </div>
          <div class="flex overflow-hidden rounded-[9px] border border-primary/70 shadow-sm">
            <label class="button min-h-11 cursor-pointer rounded-none border-0 shadow-none hover:translate-y-0 hover:shadow-none">
              <ImagePlus aria-hidden="true" class="size-4" /> Add images
              <input
                class="sr-only"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  add(Array.from(event.currentTarget.files ?? []));
                  event.currentTarget.value = "";
                }}
              />
            </label>
            <Button
              type="button"
              class="h-11 rounded-none border-y-0 border-r-0 shadow-none hover:shadow-none"
              disabled={
                pending() || items().some((item) => !(names.state.values[item.id] ?? "").trim())
              }
              onClick={() => void save()}
            >
              {pending() ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>

        <Show when={error()}>
          <Alert class="mt-5" variant="destructive">
            <AlertDescription>{error()}</AlertDescription>
          </Alert>
        </Show>

        <Show
          when={items().length}
          fallback={
            <p class="mt-8 rounded-[12px] border border-dashed p-10 text-center text-sm text-muted-foreground">
              No art yet. Add several images at once.
            </p>
          }
        >
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) return;
              const source = event.operation.source;
              if (isSortable(source)) move(String(source.id), source.initialIndex, source.index);
            }}
          >
            <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <For each={items()}>
                {(item, index) => (
                  <names.Field name={item.id} defaultValue={item.name}>
                    {(field) => (
                      <ArtCard
                        item={item}
                        changed={changed().has(item.id)}
                        index={index()}
                        reduced={reduced()}
                        nameField={
                          <input
                            aria-label="Artwork name"
                            class="mt-3 h-11 w-full rounded-[8px] border bg-input px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={field().state.value}
                            required
                            autocomplete="off"
                            onInput={(event) => {
                              field().handleChange(event.currentTarget.value);
                              markChanged(item.id);
                            }}
                          />
                        }
                        onFeature={() => feature(item.id)}
                        onVisibility={() => change(item.id, { hidden: !item.hidden })}
                        onDelete={() => void remove(item)}
                      />
                    )}
                  </names.Field>
                )}
              </For>
            </div>
          </DragDropProvider>
        </Show>

        <div class="mt-6 border-t pt-5">
          <Button as="a" href="/admin" variant="secondary" class="min-h-11">
            Back
          </Button>
        </div>
      </section>
    </AdminShell>
  );
}

export default function ArtManager(props: { initial: AdminArtItem[]; author: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ArtManagerContent {...props} />
    </QueryClientProvider>
  );
}
