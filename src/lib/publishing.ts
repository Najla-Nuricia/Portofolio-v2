export type GitChange =
  | { path: string; content: string }
  | { path: string; base64: string }
  | { path: string; delete: true };

export interface PublishRequest {
  changes: GitChange[];
  message: string;
}

export class PublishConflictError extends Error {}

export class ContentReferencedError extends Error {}

export const publish = async (body: PublishRequest) => {
  const response = await fetch("/api/admin/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(result.error ?? "Publishing failed");
  return result;
};
