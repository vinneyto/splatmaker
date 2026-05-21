import * as React from "react";

import { cn } from "@/app/_libs/utils";

type AlertVariant = "default" | "destructive";

export function Alert({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: AlertVariant }) {
  return (
    <div
      role="alert"
      className={cn(
        "w-full rounded-lg border p-3 text-sm",
        variant === "destructive"
          ? "border-red-300 bg-red-50 text-red-900"
          : "border-zinc-300 bg-zinc-50 text-zinc-900",
        className,
      )}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("mb-1 font-medium", className)} {...props} />;
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm opacity-90", className)} {...props} />;
}
