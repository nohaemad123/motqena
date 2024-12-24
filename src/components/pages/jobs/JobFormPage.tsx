"use client";

import JobFormTemplate from "@/components/template/JobFormTemplate";

interface IJobFormPageProps {
  jobId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function JobFormPage({ jobId, isEdit, isView }: Readonly<IJobFormPageProps>) {
  return (
    <section className="w-full">
      <JobFormTemplate jobId={jobId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
