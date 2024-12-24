"use client";

import BranchFormPage from "@/components/pages/branches/BranchFormPage";
import React, { Suspense } from "react";

interface IBranchViewProps {
  params: {
    branch_id: string;
  };
}

export default function page({ params: { branch_id } }: Readonly<IBranchViewProps>) {
  return (
    <Suspense>
      <BranchFormPage isView branchId={branch_id} />{" "}
    </Suspense>
  );
}
