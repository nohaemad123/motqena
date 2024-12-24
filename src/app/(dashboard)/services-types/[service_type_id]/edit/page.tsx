import ServiceTypeFormTemplate from "@/components/template/ServiceTypesFormTemplate";

interface IServiceTypeViewProps {
  params: {
    service_type_id: string;
  };
}

export default function page({ params: { service_type_id } }: Readonly<IServiceTypeViewProps>) {
  return <ServiceTypeFormTemplate isEdit serviceTypeId={service_type_id} />;
}
