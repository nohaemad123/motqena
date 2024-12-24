import ProvidedServiceFormTemplate from "@/components/template/ProvidedServiceFormTemplate";

interface IProvidedServiceViewProps {
  params: {
    provided_service_id: string;
  };
}

export default function page({ params: { provided_service_id } }: Readonly<IProvidedServiceViewProps>) {
  return <ProvidedServiceFormTemplate isEdit providedServiceId={provided_service_id} />;
}
