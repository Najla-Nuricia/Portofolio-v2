import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TextField, TextFieldLabel, TextFieldRoot } from "@/components/ui/textfield";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { ArrowRight, Search } from "lucide-solid";
import { createMemo, For, Show } from "solid-js";
import type { ContentRow } from "./types";

const editHref = (row: ContentRow) =>
  row.collection === "art" ? "/admin/art" : `/admin/${row.collection}/${row.slug}`;
const column = createColumnHelper<ContentRow>();
const columns = [
  column.accessor("title", { header: "Title" }),
  column.accessor("collection", { header: "Collection" }),
  column.accessor("status", { header: "Status" }),
  column.accessor("order", { header: "Order", cell: (info) => info.getValue() ?? "—" }),
  column.display({
    id: "action",
    header: "Action",
    cell: (info) => (
      <Button
        as="a"
        href={editHref(info.row.original)}
        variant="outline"
        size="sm"
        class="min-h-10 rounded-[8px]"
      >
        Edit
      </Button>
    ),
  }),
];

export default function ContentTable(props: {
  rows: ContentRow[];
  query: string;
  onQuery: (query: string) => void;
}) {
  const rows = createMemo(() => {
    const query = props.query.trim().toLowerCase();
    if (!query) return props.rows;
    return props.rows.filter((row) =>
      `${row.title} ${row.collection} ${row.status} ${row.order ?? ""}`
        .toLowerCase()
        .includes(query),
    );
  });
  const table = createSolidTable({
    get data() {
      return rows();
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section class="min-w-0 overflow-hidden rounded-[16px] border border-white/80 bg-card/88 shadow-md backdrop-blur">
      <div class="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
        <TextFieldRoot class="w-full sm:max-w-md">
          <TextFieldLabel>Search content</TextFieldLabel>
          <div class="relative">
            <Search
              aria-hidden="true"
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <TextField
              class="h-11 pl-10"
              type="search"
              placeholder="Title, collection, status, or order"
              value={props.query}
              onInput={(event) => props.onQuery(event.currentTarget.value)}
            />
          </div>
          <p class="text-xs text-muted-foreground" aria-live="polite">
            {rows().length} {rows().length === 1 ? "entry" : "entries"}
          </p>
        </TextFieldRoot>
        <Button as="a" href="/admin/new" class="min-h-11 w-full rounded-[9px] sm:w-auto">
          New content
        </Button>
      </div>

      <Show
        when={rows().length}
        fallback={
          <div class="px-5 py-14 text-center">
            <p class="font-medium">No content found</p>
            <p class="mt-1 text-sm text-muted-foreground">Try another search term.</p>
          </div>
        }
      >
        <div class="hidden md:block">
          <Table>
            <TableHeader>
              <For each={table.getHeaderGroups()}>
                {(group) => (
                  <TableRow>
                    <For each={group.headers}>
                      {(header) => (
                        <TableHead
                          class="whitespace-nowrap px-4 last:w-24 last:text-right lg:px-5"
                          scope="col"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            </TableHeader>
            <TableBody>
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <TableRow>
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <TableCell class="px-4 py-3 first:font-medium last:text-right lg:px-5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </div>

        <ul class="divide-y md:hidden">
          <For each={rows()}>
            {(row) => (
              <li>
                <a
                  href={editHref(row)}
                  class="flex min-h-24 items-center justify-between gap-4 px-4 py-4 transition-colors active:bg-muted/70"
                >
                  <div class="min-w-0">
                    <p class="truncate font-medium">{row.title}</p>
                    <p class="mt-1 text-xs capitalize text-muted-foreground">
                      {row.collection} · {row.status}
                      {row.order === undefined ? "" : ` · Order ${row.order}`}
                    </p>
                  </div>
                  <span class="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-medium">
                    Edit
                    <ArrowRight aria-hidden="true" class="size-4" />
                  </span>
                </a>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </section>
  );
}
