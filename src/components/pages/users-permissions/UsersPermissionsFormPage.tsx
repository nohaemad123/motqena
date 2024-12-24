"use client";

import UsersPermissionsFormTemplate from "@/components/template/UsersPermissionsFormTemplate";
import React from "react";

interface IUserPermissionsFormPageProps {
  userPermissionsId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function UsersPermissionsFormPage({ userPermissionsId, isEdit, isView }: Readonly<IUserPermissionsFormPageProps>) {
  return (
    <section className="w-full py-4 flex flex-grow">
      <UsersPermissionsFormTemplate userPermissionsId={userPermissionsId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
