"use client";

import WorkerFormTemplate from "@/components/template/WorkerFormTemplate";

interface IWorkerFormPageProps {
  workerId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function WorkerFormPage({ workerId, isEdit, isView }: Readonly<IWorkerFormPageProps>) {
  return (
    <section className="w-full">
      <WorkerFormTemplate workerId={workerId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
