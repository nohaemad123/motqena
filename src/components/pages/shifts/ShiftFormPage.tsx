"use client";

import ShiftFormTemplate from "@/components/template/ShiftFormTemplate";

interface IJobFormPageProps {
  shiftId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function ShiftFormPage({ shiftId, isEdit, isView }: Readonly<IJobFormPageProps>) {
  return (
    <section className="w-full">
      <ShiftFormTemplate shiftId={shiftId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
