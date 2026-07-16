import { fileToBase64 } from "@/lib/file";
import { publish } from "@/lib/publishing";
import { createSignal } from "solid-js";
import AdminShell from "./AdminShell";
import ContentEditor from "./ContentEditor";
import ContentTable from "./ContentTable";
import { contentPath, mediaName } from "./paths";
import { blankContent, type ContentRow, type EditorValues } from "./types";

export type { CollectionName, ContentRow, MediaAsset } from "./types";

export default function AuthoringApp(props: {
  rows?: ContentRow[];
  row?: ContentRow;
  author: string;
  query?: string;
}) {
  const [query, setQuery] = createSignal(props.query ?? "");
  const [notice, setNotice] = createSignal<{ kind: "error" | "success"; text: string }>();
  const [pending, setPending] = createSignal(false);
  const initial = () =>
    props.row ?? {
      collection: "project" as const,
      slug: "",
      content: blankContent.project,
      title: "",
      status: "Unpublished",
      media: [],
    };

  const submit = async (body: Parameters<typeof publish>[0]) => {
    setPending(true);
    try {
      return await publish(body);
    } finally {
      setPending(false);
    }
  };

  const publishContent = async (value: EditorValues, media: File[]) => {
    setNotice();
    try {
      await submit({
        changes: [
          { path: contentPath(value), content: value.content },
          ...(await Promise.all(
            media.map(async (file) => ({
              path: `src/content/${value.collection}/${value.slug}/${mediaName(file.name)}`,
              base64: await fileToBase64(file),
            })),
          )),
        ],
        message: `${props.row ? "Update" : "Create"} ${value.collection}: ${value.slug}`,
      });
      location.href = "/admin";
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Publish failed. Your edits are retained.",
      });
    }
  };

  const remove = async (value: EditorValues) => {
    try {
      await submit({
        changes: [{ path: contentPath(value), delete: true }],
        message: `Delete ${value.collection}: ${value.slug}`,
      });
      location.href = "/admin";
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Delete failed." });
    }
  };

  return (
    <AdminShell author={props.author}>
      {props.rows ? (
        <ContentTable rows={props.rows} query={query()} onQuery={setQuery} />
      ) : (
        <ContentEditor
          initial={{
            collection: initial().collection,
            slug: initial().slug,
            content: initial().content,
          }}
          locked={Boolean(props.row)}
          pending={pending()}
          notice={notice()}
          existingMedia={initial().media}
          onPublish={publishContent}
          onDelete={remove}
        />
      )}
    </AdminShell>
  );
}
