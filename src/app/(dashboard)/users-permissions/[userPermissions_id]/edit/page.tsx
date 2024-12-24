import UsersPermissionsFormPage from "@/components/pages/users-permissions/UsersPermissionsFormPage";
import React from "react";

interface IUserPermissionsViewProps {
  params: {
    userPermissions_id: string;
  };
}

export default function page({ params: { userPermissions_id } }: Readonly<IUserPermissionsViewProps>) {
  return <UsersPermissionsFormPage isEdit userPermissionsId={userPermissions_id} />;
}
