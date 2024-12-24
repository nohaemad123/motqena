import ServiceSystemFormPage from "@/components/pages/services-systems/ServiceSystemsFormPage";
import React from "react";

interface IBranchViewProps {
  params: {
    system_service_id: string;
  };
}

export default function page({ params: { system_service_id } }: Readonly<IBranchViewProps>) {
  return <ServiceSystemFormPage isEdit systemService_id={system_service_id} />;
}
