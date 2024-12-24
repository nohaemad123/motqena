"use client";
import BranchFormPage from "@/components/pages/branches/BranchFormPage";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <BranchFormPage />
    </Suspense>
  );
}
