import JobFormPage from "@/components/pages/jobs/JobFormPage";

interface IJobViewProps {
  params: {
    job_id: string;
  };
}

export default function page({ params: { job_id } }: Readonly<IJobViewProps>) {
  return <JobFormPage isEdit jobId={job_id} />;
}