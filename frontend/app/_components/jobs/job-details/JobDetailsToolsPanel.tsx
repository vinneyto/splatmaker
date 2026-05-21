import { Scissors } from "lucide-react";

import { Button } from "@/app/_components/ui/button";

export function JobDetailsToolsPanel() {
  return (
    <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-2 backdrop-blur-sm">
        <Button
          type="button"
          variant="outline"
          className="h-8 rounded-full border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
          title="Clipping tool (placeholder)"
        >
          <Scissors className="mr-1 h-4 w-4" />
          Clipping
        </Button>
      </div>
    </div>
  );
}
