"use client";

import ServiceSystemFormTemplate from "@/components/template/SystemServiceFormTemplate";

interface IJobFormPageProps {
  systemService_id?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function ServiceSystemFormPage({ systemService_id, isEdit, isView }: Readonly<IJobFormPageProps>) {
  console.log(systemService_id);

  return (
    <section className="w-full">
      <ServiceSystemFormTemplate systemServiceId={systemService_id} isEdit={isEdit} isView={isView} />
    </section>
  );
}
