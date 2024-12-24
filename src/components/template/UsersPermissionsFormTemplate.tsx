"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Checkbox,
  InputAdornment,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getRoleById, getRolePermissions } from "@/services/loadData";
import { fontCairo, modalStyle, table, tableBodyCell, tableHeadCell } from "@/@types/styles";
import { UserPermissionsDto } from "@/@types/dto/UserPermissionsDto";
import ask_add from "@/assets/images/ask-add.gif";
import ask_cancel from "@/assets/images/ask_cancel.svg";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IRole } from "@/@types/interfaces/IRole";
import fetchClient from "@/lib/fetchClient";
import { FiUser } from "react-icons/fi";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";

interface IUserPermissionsFormPageProps {
  userPermissionsId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function UsersPermissionsFormTemplate({ userPermissionsId, isEdit, isView }: Readonly<IUserPermissionsFormPageProps>) {
  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const [openAdd, setOpenAdd] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [role, setRole] = useState<IRole>();
  const userPermissionsRef = useRef<UserPermissionsDto[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissionsDto[]>([]);

  const handleOpenCancel = () => setOpenCancel(true);
  const handleCloseCancel = () => setOpenCancel(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  useEffect(() => {
    if (userPermissionsId && typeof userPermissionsId === "string") {
      getRolePermissions(userPermissionsId, i18n.language)
        .then((res) => {
          console.log(res);
          if (res) {
            userPermissionsRef.current = res;
            setUserPermissions(res);
          }
        })
        .catch(console.log);
      getRoleById(i18n.language, userPermissionsId)
        .then((res) => {
          console.log(res);
          setRole(res);
        })
        .catch(console.log);
    }
  }, [userPermissionsId]);

  async function handleCreate(userPermissionData: UserPermissionsDto[]) {
    console.log(userPermissionData);
    handleOpenAdd();
  }

  async function handleUpdate(userPermissionData: UserPermissionsDto[]) {
    if (!role) return;

    const updatedPermissions = userPermissionData.map((permission) => ({
      ...permission,
      roleId: role?.id,
    }));

    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.rolePermissions + "/UpdateRolePermission", {
        method: "POST",
        body: updatedPermissions,
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        handleOpenAdd();
      } else {
        console.error("Error Updating user");
      }
    } catch (error) {
      console.error("Error updating user permissions:", error);
    }

    handleOpenAdd();
  }

  async function handleSubmitForm() {
    if (isView) return;

    if (isEdit) {
      await handleUpdate(userPermissions);
    } else {
      await handleCreate(userPermissions);
    }
  }

  function handleClearForm() {
    setUserPermissions(userPermissionsRef.current);
    handleCloseCancel();
    push("/users-permissions");
  }

  return (
    <div className="flex-grow w-full flex flex-col p-5">
      <div className="w-full">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ ...fontCairo, marginBottom: "28px" }}>
          <Link color="inherit" href={"/users-permissions"} className="text-base font-bold no-underline text-[var(--primary)]">
            {t("users")}
          </Link>
          {isEdit && (
            <Typography className="text-[15px] font-normal" sx={{ ...fontCairo, color: "text.primary" }}>
              {t("edit user permission")}
            </Typography>
          )}
        </Breadcrumbs>
        <div>
          <div className="p-5 bg-white">
            <h3 className="text-[15px] font-normal pb-2 border-x-0 border-t-0 border-b border-solid border-b-[#E4DDE9]">
              {isEdit && <span className="text-[15px]">{t("edit user permission")}</span>}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-20 mt-3">
              {/* user name */}
              <div className="mb-5">
                <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("choose user name")}</label>
                {/* 
                <Select
                  defaultValue={role?.id}
                  disabled={isEdit}
                  displayEmpty
                  input={
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position="start">
                          <BiUser className="text-[#808080] text-2xl" />
                        </InputAdornment>
                      }
                    />
                  }
                  className="w-full custom-field-modules px-5 mt-2 text-lg border-2 rounded-lg"
                >
                  <MenuItem key={role?.id} value={role?.id}>
                    {role?.name}
                  </MenuItem>
                </Select> */}
                <div className="bg-[#f7f8fa] text-[#808080CC] mt-2 rounded-lg h-[56px] flex items-center">
                  <InputAdornment position="start">
                    <FiUser className="text-[#808080CC] w-[24px] h-[24px]" />
                  </InputAdornment>
                  {role?.name}
                </div>
              </div>
            </div>
            <TableContainer sx={table}>
              <Table>
                <TableHead sx={{ backgroundColor: "#E8EEEE", height: "32px" }}>
                  <TableRow>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("statement")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("add")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("edit")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("delete")}
                    </TableCell>
                    <TableCell align="center" sx={tableHeadCell}>
                      {t("view")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userPermissions.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell align="center" sx={tableBodyCell}>
                        {t(row.pageName)}
                      </TableCell>
                      {row.permissionActions.map((permission, permissionIndex) => (
                        <TableCell align="center" key={permission.permissionId} sx={tableBodyCell}>
                          <Checkbox
                            disabled={isHttpClientLoading}
                            checked={permission.havePermission}
                            onChange={(e) => {
                              setUserPermissions((prev) =>
                                prev.map((x) => {
                                  if (x.permissionActions[permissionIndex].permissionId === permission.permissionId)
                                    x.permissionActions[permissionIndex].havePermission = e.target.checked;
                                  return x;
                                }),
                              );
                            }}
                            // sx={{
                            //   color: "#DDE6E5",
                            //   width: 24,
                            //   height: 24,
                            //   borderRadius: "4px",
                            //   border: "2px solid #DDE6E5",
                            //   "&.Mui-checked": {
                            //     color: "#46a14a",
                            //   }
                            // }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="flex justify-end mt-8">
            <div className="flex mb-2 gap-x-5 btns-wrapper">
              <button onClick={handleSubmitForm} className="add_button" disabled={isHttpClientLoading}>
                {!isEdit && !isView && <span>{t("Add")}</span>}
                {(isEdit || isView) && <span>{t("update data")}</span>}
              </button>

              <button type="button" onClick={handleOpenCancel} className="cancel_btn" disabled={isHttpClientLoading}>
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>

        {/* add modal */}
        <Modal open={openAdd} onClose={handleCloseAdd} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" className="mb-10" variant="h6" component="h2">
              <ButtonBase className="close_modal" onClick={handleCloseAdd}>
                X
              </ButtonBase>
            </Typography>
            <Image
              src={ask_add}
              alt="logo"
              width={400}
              height={400}
              className="text-center justify-center m-auto actions_tr"
              style={{ textAlign: "center", margin: "0 auto", display: "block" }}
            />

            <div className="text-center">
              <h3 className="font-bold text-[20px]">{t("Congratulations")}</h3>
              <p className="font-normal text-[18px] mt-2">
                {!isEdit && !isView && <span>{t("The operation was completed successfully")}</span>}
                {(isEdit || isView) && <span>{t("The operation was updated successfully")}</span>}
              </p>
            </div>

            <div className="flex w-full mt-5">
              <Link className="add_popup_button" href={"/users-permissions"}>
                {t("view users permissions")}
              </Link>
            </div>
          </Box>
        </Modal>

        {/* cancel modal */}
        <Modal
          open={openCancel}
          onClose={handleCloseCancel}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" className="mb-10" variant="h6" component="h2">
              <ButtonBase className="close_modal" onClick={handleCloseCancel}>
                X
              </ButtonBase>
            </Typography>
            <Image
              src={ask_cancel}
              alt="logo"
              width={400}
              height={400}
              className="text-center justify-center m-auto actions_tr"
              style={{ textAlign: "center", margin: "0 auto", display: "block" }}
            />

            <div className="text-center">
              <h3 className="font-bold text-[20px]">{t("Are you sure to cancel?")}</h3>
              <p className="font-normal text-[18px] mt-2">{t("When you click Cancel you will lose all information")}</p>
            </div>

            <div className="w-full mt-5 flex gap-5">
              <Button className="cancel_popup_button" onClick={handleClearForm} disabled={isHttpClientLoading}>
                {t("Cancel")}
              </Button>
              <Button disabled={isHttpClientLoading} onClick={handleCloseCancel} className="back_popup_button">
                {t("Back")}
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
