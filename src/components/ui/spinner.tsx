import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

/**
 * Overlays the nearest `relative` ancestor — blurs its content and
 * centers a spinner inside it. Wrap the component's root with
 * `relative overflow-hidden` and render <ComponentLoader visible={loading} />.
 */
export function ComponentLoader({ visible, className }: { visible: boolean; className?: string }) {
  if (!visible) return null;
  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] backdrop-blur-[3px] bg-background/40",
        className,
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center">
          <LoaderIcon className="size-4 animate-spin text-foreground/60" />
        </div>
        <span className="text-[11px] text-muted-foreground font-medium tracking-wide">Loading…</span>
      </div>
    </div>
  );
}
