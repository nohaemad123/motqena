"use client";

import ProvidedServiceFormTemplate from "@/components/template/ProvidedServiceFormTemplate";

interface IServiceTypeIdFormPageProps {
  providedServiceId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function ProvidedServiceFormPage({ providedServiceId, isEdit, isView }: Readonly<IServiceTypeIdFormPageProps>) {
  return (
    <section className="w-full">
      <ProvidedServiceFormTemplate providedServiceId={providedServiceId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
