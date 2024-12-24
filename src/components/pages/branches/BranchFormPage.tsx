"use client";

import BranchFormTemplate from "@/components/template/BranchFormTemplate";

interface IBranchFormPageProps {
  branchId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function BranchFormPage({ branchId, isEdit, isView }: Readonly<IBranchFormPageProps>) {
  return (
    <section className="w-full">
      <BranchFormTemplate branchId={branchId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
