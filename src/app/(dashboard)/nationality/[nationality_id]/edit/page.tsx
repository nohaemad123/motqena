import NationalityFormPage from "@/components/pages/nationality/NationalityFormPage";

interface INationalityViewProps {
  params: {
    nationality_id: string;
  };
}

export default function page({ params: { nationality_id } }: Readonly<INationalityViewProps>) {
  return <NationalityFormPage isEdit nationalityId={nationality_id} />;
}
