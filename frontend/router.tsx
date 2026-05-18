import { Navigate, Route, Routes, useParams, useSearchParams } from "react-router-dom";

import { JobDetailsPage } from "@/components/jobs/JobDetailsPage";
import { JobsListPage } from "@/components/jobs/JobsListPage";

function JobDetailsRoute() {
  const { jobId = "" } = useParams();
  const [searchParams] = useSearchParams();

  return <JobDetailsPage jobId={jobId} selectedFileName={searchParams.get("fileName") ?? undefined} />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jobs" replace />} />
      <Route path="/jobs" element={<JobsListPage />} />
      <Route path="/jobs/:jobId" element={<JobDetailsRoute />} />
    </Routes>
  );
}
