import { Button } from "@/components/ui/button";
import {
  BriefcaseBusiness,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Menu,
  Plus,
  Settings,
  Wrench,
  X,
} from "lucide-solid";
import { createSignal, type JSX, Show } from "solid-js";

const links = [
  { label: "Work", icon: BriefcaseBusiness, href: "/admin?collection=work" },
  { label: "Projects", icon: FolderKanban, href: "/admin?collection=project" },
  { label: "Education", icon: GraduationCap, href: "/admin?collection=education" },
  { label: "Tools", icon: Wrench, href: "/admin?collection=tool" },
];

export default function AdminShell(props: { author: string; children: JSX.Element }) {
  const [open, setOpen] = createSignal(false);
  return (
    <div class="min-h-screen overflow-x-hidden bg-muted/65 pb-20 md:pb-0">
      <div class="fixed bottom-[max(.75rem,env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 md:hidden">
        <Show when={open()}>
          <div class="mb-2 flex items-center gap-1 rounded-[14px] border border-white/80 bg-card/92 p-1.5 shadow-lg backdrop-blur-xl">
            <Button
              as="a"
              href="/admin/new"
              size="icon"
              class="size-11 rounded-[9px]"
              aria-label="Create content"
            >
              <Plus class="size-4" />
            </Button>
            {links.map((item) => (
              <Button
                as="a"
                href={item.href}
                size="icon"
                variant="ghost"
                class="size-11 rounded-[9px] text-muted-foreground"
                aria-label={item.label}
              >
                <item.icon class="size-4" />
              </Button>
            ))}
            <Button
              as="a"
              href="/admin/settings/settings"
              size="icon"
              variant="ghost"
              class="size-11 rounded-[9px] text-muted-foreground"
              aria-label="Settings"
            >
              <Settings class="size-4" />
            </Button>
            <Button
              as="a"
              href="/"
              size="icon"
              variant="ghost"
              class="size-11 rounded-[9px]"
              aria-label="View portfolio"
            >
              <ExternalLink class="size-4" />
            </Button>
          </div>
        </Show>
        <Button
          size="icon"
          variant="outline"
          class="mx-auto size-12 rounded-[13px] bg-card/92 shadow-lg backdrop-blur-xl"
          type="button"
          aria-label="Toggle tools"
          aria-expanded={open()}
          onClick={() => setOpen(!open())}
        >
          <Show when={open()} fallback={<Menu class="size-5" />}>
            <X class="size-5" />
          </Show>
        </Button>
      </div>

      <aside class="group/rail fixed left-4 top-1/2 z-40 hidden w-14 -translate-y-1/2 flex-col items-stretch gap-1 overflow-hidden rounded-[14px] border border-white/80 bg-card/90 p-1.5 shadow-lg backdrop-blur-xl transition-[width] duration-200 hover:w-40 focus-within:w-40 md:flex">
        <Button
          as="a"
          href="/admin/new"
          class="size-11 shrink-0 justify-start overflow-hidden rounded-[9px] p-0 md:w-full"
          aria-label="Create content"
        >
          <span class="grid size-11 shrink-0 place-items-center">
            <Plus class="size-4" />
          </span>
          <span class="hidden whitespace-nowrap pr-4 text-xs opacity-0 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100 md:block">
            New content
          </span>
        </Button>
        <span class="mx-auto my-1 h-px w-8 shrink-0 bg-border" />
        {links.map((item) => (
          <Button
            as="a"
            href={item.href}
            variant="ghost"
            class="size-11 shrink-0 justify-start overflow-hidden rounded-[9px] p-0 text-muted-foreground md:w-full"
            aria-label={item.label}
          >
            <span class="grid size-11 shrink-0 place-items-center">
              <item.icon class="size-4" />
            </span>
            <span class="hidden whitespace-nowrap pr-4 text-xs opacity-0 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100 md:block">
              {item.label}
            </span>
          </Button>
        ))}
        <span class="mx-auto my-1 h-px w-8 shrink-0 bg-border" />
        <Button
          as="a"
          href="/admin/settings/settings"
          variant="ghost"
          class="size-11 shrink-0 justify-start overflow-hidden rounded-[9px] p-0 text-muted-foreground md:w-full"
          aria-label="Settings"
        >
          <span class="grid size-11 shrink-0 place-items-center">
            <Settings class="size-4" />
          </span>
          <span class="hidden whitespace-nowrap pr-4 text-xs opacity-0 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100 md:block">
            Settings
          </span>
        </Button>
        <Button
          as="a"
          href="/"
          variant="ghost"
          class="size-11 shrink-0 justify-start overflow-hidden rounded-[9px] p-0 md:w-full"
          aria-label="View portfolio"
        >
          <span class="grid size-11 shrink-0 place-items-center">
            <ExternalLink class="size-4" />
          </span>
          <span class="hidden whitespace-nowrap pr-4 text-xs opacity-0 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100 md:block">
            View site
          </span>
        </Button>
      </aside>

      <main id="main-content" class="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-12">
        <header class="mb-6 rounded-[16px] border border-white/80 bg-card/82 px-5 py-5 shadow-sm backdrop-blur sm:mb-8 sm:px-7 sm:py-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span class="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
                Content studio
              </span>
              <h1 class="mt-2 text-pretty text-3xl tracking-[-.025em] sm:text-4xl">
                Portfolio workspace
              </h1>
              <p class="mt-2 break-all text-xs text-muted-foreground sm:break-normal">
                Signed in as {props.author}
              </p>
            </div>
            <span class="inline-flex w-fit items-center gap-2 rounded-[7px] border bg-muted/70 px-3 py-2 text-xs text-muted-foreground">
              <span class="size-1.5 rounded-full bg-secondary" />
              Git-backed publishing
            </span>
          </div>
        </header>
        {props.children}
      </main>
    </div>
  );
}
