import ShiftFormPage from "@/components/pages/shifts/ShiftFormPage";
import React from "react";

interface IBranchViewProps {
  params: {
    shift_id: string;
  };
}

export default function page({ params: { shift_id } }: Readonly<IBranchViewProps>) {
  return <ShiftFormPage isEdit shiftId={shift_id} />;
}
