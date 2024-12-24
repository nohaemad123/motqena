export type PermissionActionType = "Add" | "Edit" | "Browse" | "Delete";

export interface IUserPermissionsDto {
  id: string;
  pageKey: string;
  pageName: string;
  roleId: string;
  permissionActions: PermissionActionDto[];
}

export class UserPermissionsDto implements Partial<IUserPermissionsDto> {
  id?: string;
  pageKey: string;
  pageName: string;
  roleId: string;
  permissionActions: PermissionActionDto[];
  constructor({ id, pageKey = "", pageName = "", roleId = "", permissionActions = [] }: Partial<UserPermissionsDto> = {}) {
    this.id = id;
    this.pageKey = pageKey;
    this.pageName = pageName;
    this.roleId = roleId;
    this.permissionActions = permissionActions;
  }
}

export interface IPermissionActionDto {
  permissionAction: PermissionActionType;
  havePermission: boolean;
  permissionId: number | null;
}

export class PermissionActionDto implements Partial<IPermissionActionDto> {
  permissionAction?: PermissionActionType;
  havePermission?: boolean;
  permissionId?: number | null;
  constructor({ havePermission, permissionAction, permissionId }: Partial<IPermissionActionDto> = {}) {
    this.permissionAction = permissionAction;
    this.havePermission = havePermission;
    this.permissionId = permissionId;
  }
}
