import { PermissionActionDto } from "@/@types/dto/UserPermissionsDto";

export interface IUserPermissions {
  id: string;
  pageKey: string;
  pageName: string;
  roleId: string;
  permissionActions: PermissionActionDto[];
}
