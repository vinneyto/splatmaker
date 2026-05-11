import { JobDetailsPage } from "@/components/jobs/JobDetailsPage";

type Props = {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ fileName?: string }>;
};

export default async function JobDetailsRoute({ params, searchParams }: Props) {
  const { jobId } = await params;
  const { fileName } = await searchParams;

  return <JobDetailsPage jobId={jobId} selectedFileName={fileName} />;
}
