import { Spinner } from "@/components/ui/spinner";

type SplatLoadingPhase = "loading" | "buildingLod" | "done";

type Props = {
  isJobsLoading: boolean;
  phase: SplatLoadingPhase;
};

function getText(isJobsLoading: boolean, phase: SplatLoadingPhase): string {
  if (isJobsLoading) {
    return "Loading job details...";
  }

  if (phase === "loading") {
    return "Loading splat file...";
  }

  if (phase === "buildingLod") {
    return "Building LODs...";
  }

  return "Done!";
}

export function JobDetailsLoadingBadge({ isJobsLoading, phase }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm text-zinc-700 shadow-sm">
        <Spinner className="h-4 w-4" />
        <span>{getText(isJobsLoading, phase)}</span>
      </div>
    </div>
  );
}
