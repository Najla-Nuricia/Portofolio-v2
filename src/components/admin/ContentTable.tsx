import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TextField, TextFieldRoot } from "@/components/ui/textfield";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { For } from "solid-js";
import type { ContentRow } from "./types";

const column = createColumnHelper<ContentRow>();
const columns = [
  column.accessor("title", { header: "Title" }),
  column.accessor("collection", { header: "Collection" }),
  column.accessor("status", { header: "Status" }),
  column.accessor("order", { header: "Order", cell: (info) => info.getValue() ?? "—" }),
];

export default function ContentTable(props: {
  rows: ContentRow[];
  query: string;
  onQuery: (query: string) => void;
}) {
  const table = createSolidTable({
    get data() {
      const query = props.query.toLowerCase();
      return props.rows.filter((row) =>
        `${row.title} ${row.collection}`.toLowerCase().includes(query),
      );
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section class="min-w-0 overflow-hidden rounded-[16px] border border-white/80 bg-card/88 p-3 shadow-md backdrop-blur sm:p-5">
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <TextFieldRoot class="w-full sm:max-w-sm">
          <TextField
            class="h-11"
            type="search"
            placeholder="Search content…"
            value={props.query}
            onInput={(event) => props.onQuery(event.currentTarget.value)}
          />
        </TextFieldRoot>
        <Button as="a" href="/admin/new" class="min-h-11 w-full rounded-[9px] sm:w-auto">
          New content
        </Button>
      </div>
      <Table>
        <TableHeader>
          <For each={table.getHeaderGroups()}>
            {(group) => (
              <TableRow>
                <For each={group.headers}>
                  {(header) => (
                    <TableHead class="whitespace-nowrap px-3">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )}
                </For>
                <TableHead />
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
                    <TableCell class="min-w-32 px-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )}
                </For>
                <TableCell class="sticky right-0 bg-card/95 px-3 text-right backdrop-blur">
                  <Button
                    as="a"
                    href={`/admin/${row.original.collection}/${row.original.slug}`}
                    variant="outline"
                    size="sm"
                    class="min-h-11 rounded-[8px]"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    </section>
  );
}
