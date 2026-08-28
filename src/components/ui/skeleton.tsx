import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60", className)}
      {...props}
    />
  );
}

export { Skeleton };

/* ── Composites ─────────────────────────────── */

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-8 w-full rounded-sm" />
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 py-2.5 px-1">
      <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
      <Skeleton className="h-3 w-10 shrink-0" />
    </div>
  );
}

export function SkeletonChartCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  );
}

/**
 * columns: array of Tailwind width classes + optional pill flag per cell.
 * e.g. [{ w: "w-28" }, { w: "w-40" }, { w: "w-16", pill: true }]
 * Defaults to a 5-column generic layout if omitted.
 */
export function SkeletonTableRow({
  columns = [
    { w: "w-28" }, { w: "w-40" }, { w: "w-24" }, { w: "w-16", pill: true }, { w: "w-20" },
  ],
}: {
  columns?: { w: string; pill?: boolean }[];
}) {
  return (
    <tr className="border-b border-border last:border-0">
      {columns.map((col, i) => (
        <td key={i} className="py-3 px-4">
          <Skeleton className={`h-3 ${col.w} ${col.pill ? "h-5 rounded-full" : ""}`} />
        </td>
      ))}
    </tr>
  );
}

/* Standalone row for non-table contexts (div-based lists) */
export function SkeletonRowItem() {
  return (
    <div className="flex gap-4 items-center py-2.5 border-b border-border last:border-0">
      <Skeleton className="h-3 flex-1" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

export function SkeletonAvatar({ size = 10 }: { size?: number }) {
  return <Skeleton className={`h-${size} w-${size} rounded-full shrink-0`} />;
}
