const result = async (response: Response, fallback: string) => {
  const body = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(body.error ?? fallback);
  return body;
};

export const saveArt = async (form: FormData) =>
  result(await fetch("/admin/api/art", { method: "POST", body: form }), "Gallery save failed");

export const deleteArtItem = async (id: string) =>
  result(
    await fetch("/admin/api/art", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }),
    "Artwork deletion failed",
  );
