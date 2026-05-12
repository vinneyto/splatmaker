import { Suspense } from "react";

import { JobsRouteClient } from "@/components/jobs/JobsRouteClient";

export default function JobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsRouteClient />
    </Suspense>
  );
}
