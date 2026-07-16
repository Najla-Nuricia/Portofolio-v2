import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { TextField, TextFieldLabel, TextFieldRoot } from "@/components/ui/textfield";
import { createForm } from "@tanstack/solid-form";
import { createSignal, onCleanup, Show } from "solid-js";
import ContentPreview from "./ContentPreview";
import MediaDropZone from "./MediaDropZone";
import MediaLibrary from "./MediaLibrary";
import { mediaPath } from "./paths";
import {
  blankContent,
  collectionLabel,
  collections,
  type CollectionName,
  type EditorValues,
  type MediaAsset,
  type PendingMedia,
} from "./types";

export default function ContentEditor(props: {
  initial: EditorValues;
  locked: boolean;
  pending: boolean;
  notice?: { kind: "error" | "success"; text: string };
  existingMedia: MediaAsset[];
  onPublish: (values: EditorValues, media: File[]) => Promise<void>;
  onDelete: (values: EditorValues) => Promise<void>;
}) {
  const [confirmDelete, setConfirmDelete] = createSignal(false);
  const [media, setMedia] = createSignal<PendingMedia[]>([]);
  let editor: HTMLTextAreaElement | undefined;
  const form = createForm(() => ({
    defaultValues: props.initial,
    onSubmit: ({ value }) =>
      props.onPublish(
        value,
        media().map((asset) => asset.file),
      ),
  }));

  const selectMedia = (files: File[]) => {
    const existing = new Set(media().map(({ name }) => name));
    setMedia([
      ...media(),
      ...files
        .filter((file) => file.type.startsWith("image/") && !existing.has(file.name))
        .map((file) => ({
          file,
          name: file.name,
          path: mediaPath(file.name),
          url: URL.createObjectURL(file),
        })),
    ]);
  };

  const removeMedia = (index: number) => {
    const assets = [...media()];
    URL.revokeObjectURL(assets[index].url);
    assets.splice(index, 1);
    setMedia(assets);
  };

  const insertImage = (path: string) => {
    const value = form.state.values.content;
    const start = editor?.selectionStart ?? value.length;
    const end = editor?.selectionEnd ?? start;
    const name =
      path
        .split("/")
        .at(-1)
        ?.replace(/\.[^.]+$/, "") ?? "Image";
    const markdown = `![${name}](${path})`;
    const prefix = start > 0 && value[start - 1] !== "\n" ? "\n\n" : "";
    const suffix = end < value.length && value[end] !== "\n" ? "\n\n" : "";
    const insertion = `${prefix}${markdown}${suffix}`;
    form.setFieldValue("content", `${value.slice(0, start)}${insertion}${value.slice(end)}`);
    queueMicrotask(() => {
      const cursor = start + insertion.length;
      editor?.focus();
      editor?.setSelectionRange(cursor, cursor);
    });
  };

  onCleanup(() => {
    for (const asset of media()) URL.revokeObjectURL(asset.url);
  });

  return (
    <>
      <form
        class="min-w-0 rounded-[16px] border border-white/80 bg-card/90 p-3 shadow-md backdrop-blur sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span class="text-xs text-muted-foreground">Content editor</span>
            <h2 class="mt-1 text-2xl sm:text-3xl">
              {props.locked ? "Edit content" : "New content"}
            </h2>
          </div>
          <Button as="a" href="/admin" class="min-h-11 w-full sm:w-auto" variant="secondary">
            Back
          </Button>
        </div>

        <div aria-live="polite">
          <Show when={props.notice}>
            {(notice) => (
              <Alert class="mb-5" variant={notice().kind === "error" ? "destructive" : "default"}>
                <AlertDescription>{notice().text}</AlertDescription>
              </Alert>
            )}
          </Show>
        </div>

        <Show when={form.state.values.collection !== "settings"}>
          <div class="grid gap-5 rounded-[12px] border bg-muted/45 p-4 shadow-[inset_0_1px_0_white] md:grid-cols-2">
            <form.Field name="collection">
              {(field) => (
                <div class="space-y-1">
                  <span class="text-sm font-medium">Collection</span>
                  <Select<CollectionName>
                    aria-label="Collection"
                    options={collections}
                    value={field().state.value}
                    disabled={props.locked}
                    onChange={(collection) => {
                      if (!collection) return;
                      field().handleChange(collection);
                      form.setFieldValue("content", blankContent[collection]);
                    }}
                    itemComponent={(item) => (
                      <SelectItem item={item.item}>
                        {collectionLabel[item.item.rawValue]}
                      </SelectItem>
                    )}
                  >
                    <SelectTrigger class="h-12 min-h-11">
                      <SelectValue<CollectionName>>
                        {(state) => collectionLabel[state.selectedOption()]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent />
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="slug">
              {(field) => (
                <TextFieldRoot required disabled={props.locked}>
                  <TextFieldLabel>Slug</TextFieldLabel>
                  <TextField
                    class="h-12"
                    name="slug"
                    autocomplete="off"
                    value={field().state.value}
                    pattern="[a-z0-9-]+"
                    onInput={(event) =>
                      field().handleChange(
                        event.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      )
                    }
                  />
                </TextFieldRoot>
              )}
            </form.Field>
          </div>
        </Show>

        <Show
          when={!(["tool", "settings"] as CollectionName[]).includes(form.state.values.collection)}
        >
          <MediaDropZone onSelect={selectMedia} />
        </Show>

        <form.Field name="content">
          {(field) => (
            <div
              class="mt-5 grid items-start gap-5"
              classList={{ "xl:grid-cols-2": form.state.values.collection !== "settings" }}
            >
              <TextFieldRoot required>
                <TextFieldLabel>MDX content</TextFieldLabel>
                <TextArea
                  ref={(element) => (editor = element)}
                  name="content"
                  autocomplete="off"
                  class="min-h-80 resize-y rounded-[10px] bg-muted/35 p-3 font-mono text-base leading-relaxed shadow-[inset_0_1px_3px_oklch(0.35_0.03_20/.07)] sm:min-h-120 sm:p-4 sm:text-sm"
                  value={field().state.value}
                  spellcheck={false}
                  onInput={(event) => field().handleChange(event.currentTarget.value)}
                />
              </TextFieldRoot>
              <Show when={form.state.values.collection !== "settings"}>
                <ContentPreview
                  source={field().state.value}
                  media={[...props.existingMedia, ...media()]}
                />
                <div class="xl:col-span-2">
                  <MediaLibrary
                    existing={props.existingMedia}
                    pending={media()}
                    onInsert={insertImage}
                    onRemove={removeMedia}
                  />
                </div>
              </Show>
            </div>
          )}
        </form.Field>

        <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span class="text-xs text-muted-foreground">
              Explicit Publish creates one Git commit. Failed changes stay here.
            </span>
            <Show when={props.locked && form.state.values.collection !== "settings"}>
              <Button
                variant="destructive"
                size="sm"
                class="min-h-11 w-full sm:w-auto"
                type="button"
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
            </Show>
          </div>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {(state) => (
              <Button
                class="min-h-11 w-full sm:w-auto"
                type="submit"
                disabled={!state()[0] || state()[1]}
              >
                {state()[1] ? "Publishing…" : "Publish"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>

      <Dialog open={confirmDelete()} onOpenChange={setConfirmDelete}>
        <DialogContent class="w-[calc(100vw-2rem)] max-w-md rounded-[16px] border-white/80 p-4 shadow-xl sm:p-6">
          <DialogHeader>
            <DialogTitle>Delete content?</DialogTitle>
            <DialogDescription>
              This permanently deletes “{form.state.values.slug}” from the repository.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter class="gap-2">
            <Button
              class="min-h-11 w-full sm:w-auto"
              variant="outline"
              type="button"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              class="min-h-11 w-full sm:w-auto"
              type="button"
              disabled={props.pending}
              onClick={() => void props.onDelete(form.state.values)}
            >
              {props.pending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
