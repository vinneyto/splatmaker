import { JobDetailsPage } from "@/components/jobs/JobDetailsPage";

type Props = {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ fileKey?: string }>;
};

export default async function JobDetailsRoute({ params, searchParams }: Props) {
  const { jobId } = await params;
  const { fileKey } = await searchParams;

  return <JobDetailsPage jobId={jobId} selectedFileKey={fileKey} />;
}
