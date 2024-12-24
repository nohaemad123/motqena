"use client";

import NationalityFormTemplate from "@/components/template/NationalityFormTemplate";

interface IJobFormPageProps {
  nationalityId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function NationalityFormPage({ nationalityId, isEdit, isView }: Readonly<IJobFormPageProps>) {
  return (
    <section className="w-full">
      <NationalityFormTemplate nationalityId={nationalityId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
