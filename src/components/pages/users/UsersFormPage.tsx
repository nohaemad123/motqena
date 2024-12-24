"use client";

import UsersFormTemplate from "@/components/template/UsersFormTemplate";
import React from "react";

interface IUserFormPageProps {
  userId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function UsersFormPage({ userId, isEdit, isView }: Readonly<IUserFormPageProps>) {
  return (
    <section className="w-full py-4 flex flex-grow mt-8">
      <UsersFormTemplate userId={userId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
