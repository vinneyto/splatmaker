import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-zinc-300 px-2 py-0.5 text-xs font-medium text-zinc-800",
        className,
      )}
      {...props}
    />
  );
}
