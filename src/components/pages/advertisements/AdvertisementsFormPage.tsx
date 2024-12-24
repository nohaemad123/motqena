"use client";

import AdvertisementsFormTemplate from "@/components/template/AdvertisementsFormTemplate";
import React from "react";

interface IAdvertisingFormPageProps {
  advertisementId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function AdvertisementsFormPage({ advertisementId, isEdit, isView }: Readonly<IAdvertisingFormPageProps>) {
  return (
    <section className="w-full py-4 flex flex-grow mt-8">
      <AdvertisementsFormTemplate advertisementId={advertisementId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
