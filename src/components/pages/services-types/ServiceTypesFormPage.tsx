"use client";

import ServiceTypeFormTemplate from "@/components/template/ServiceTypesFormTemplate";

interface IServiceTypeIdFormPageProps {
  serviceTypeId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function ServiceTypeFormPage({ serviceTypeId, isEdit, isView }: Readonly<IServiceTypeIdFormPageProps>) {
  return (
    <section className="w-full">
      <ServiceTypeFormTemplate serviceTypeId={serviceTypeId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
