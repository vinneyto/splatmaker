import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function JobDetailsBackButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full bg-white text-zinc-900 hover:bg-zinc-100"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
}
