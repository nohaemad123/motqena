import UsersFormPage from "@/components/pages/users/UsersFormPage";
import React from "react";

interface IUserViewProps {
  params: {
    user_id: string;
  };
}

export default function page({ params: { user_id } }: Readonly<IUserViewProps>) {
  return <UsersFormPage isView userId={user_id} />;
}
