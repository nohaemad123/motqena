import AdvertisementsFormPage from "@/components/pages/advertisements/AdvertisementsFormPage";
import React from "react";

interface IAdvertisingViewProps {
  params: {
    advertisement_id: string;
  };
}

export default function page({ params: { advertisement_id } }: Readonly<IAdvertisingViewProps>) {
  return <AdvertisementsFormPage isEdit advertisementId={advertisement_id} />;
}
