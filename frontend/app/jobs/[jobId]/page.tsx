import { JobDetailsPage } from "@/components/jobs/JobDetailsPage";

type Props = {
  params: Promise<{ jobId: string }>;
};

export default async function JobDetailsRoute({ params }: Props) {
  const { jobId } = await params;
  return <JobDetailsPage jobId={jobId} />;
}
