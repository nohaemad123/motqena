import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IBranch } from "@/@types/interfaces/IBranch";
import { IDurationService } from "@/@types/interfaces/IDurationService";
import { IGender } from "@/@types/interfaces/IGender";
import { IJob } from "@/@types/interfaces/IJob";
import { IJobStatus } from "@/@types/interfaces/IJobStatus";
import { ILanguage } from "@/@types/interfaces/ILanguage";
import { INationality } from "@/@types/interfaces/INationality";
import { IPagination } from "@/@types/interfaces/IPagination";
import { IProvidedService } from "@/@types/interfaces/IProvidedService";
import { IReligion } from "@/@types/interfaces/IReligion";
import { ISearch } from "@/@types/interfaces/ISearch";
import { IServicesSystems } from "@/@types/interfaces/IServicesSystems";
import { IServiceType } from "@/@types/interfaces/IServiceType";
import { IShift } from "@/@types/interfaces/IShift";
import { IAdvertisement } from "@/@types/interfaces/IAdvertisement";
import { IListOrderStatus, IOrder } from "@/@types/interfaces/IOrder";
import { IRole } from "@/@types/interfaces/IRole";
import { IUser } from "@/@types/interfaces/IUser";
import { IUserMessage } from "@/@types/interfaces/IUserMessage";
import { IUserPermissions } from "@/@types/interfaces/IUserPermissions";
import { IWorker } from "@/@types/interfaces/IWorker";
import fetchClient from "@/lib/fetchClient";
import { IHomeData } from "@/@types/interfaces/IHomeData";

export async function getAllBranches(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IBranch[]; paginationData: IPagination }>>(EndPointsEnums.allBranches, {
    method: "POST",
    body: searchObj,
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getBranchById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IBranch>>(EndPointsEnums.branch + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllJobs(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IJob[]; paginationData: IPagination }>>(EndPointsEnums.allJobs, {
    method: "POST",
    body: searchObj,
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllNationalities(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: INationality[]; paginationData: IPagination }>>(
    EndPointsEnums.allNationality,
    {
      method: "POST",
      body: searchObj,
      headers: {
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllWorker(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IWorker[]; paginationData: IPagination }>>(EndPointsEnums.allWorkers, {
    method: "POST",
    body: searchObj,
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getWorkerById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IWorker>>(EndPointsEnums.worker + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getJobById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IJob>>(EndPointsEnums.job + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNationalityById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IJob>>(EndPointsEnums.nationality + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllShifts(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IShift[]; paginationData: IPagination }>>(EndPointsEnums.allShift, {
    method: "POST",
    body: searchObj,
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllSystemOfService(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IServicesSystems[]; paginationData: IPagination }>>(
    EndPointsEnums.allSystemOfService,
    {
      method: "POST",
      body: searchObj,
      headers: {
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllServiceTypes(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IServiceType[]; paginationData: IPagination }>>(
    EndPointsEnums.allServiceType,
    {
      method: "POST",
      body: searchObj,
      headers: {
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllProvidedServices(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IProvidedService[]; paginationData: IPagination }>>(
    EndPointsEnums.allProvidedService,
    {
      method: "POST",
      body: searchObj,
      headers: {
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllWorkers(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IWorker[]; paginationData: IPagination }>>(EndPointsEnums.allWorkers, {
    method: "POST",
    body: searchObj,
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getListOfDurationService(locale: string) {
  const data = await fetchClient<IDurationService[]>(EndPointsEnums.allDurationService, {
    method: "GET",
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getListOfReligion(locale: string) {
  const data = await fetchClient<IReligion[]>(EndPointsEnums.listReligion, {
    method: "GET",
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getListOfLanguage(locale: string) {
  const data = await fetchClient<ILanguage[]>(EndPointsEnums.listLanguage, {
    method: "GET",
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getListOfJobStatus(locale: string) {
  const data = await fetchClient<IJobStatus[]>(EndPointsEnums.listJobStatus, {
    method: "GET",
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getListOfGender(locale: string) {
  const data = await fetchClient<IGender[]>(EndPointsEnums.listGender, {
    method: "GET",
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getShiftById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IShift>>(EndPointsEnums.shift + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getSystemServiceById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IServicesSystems>>(EndPointsEnums.systemOfService + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getServiceTypeById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IServiceType>>(EndPointsEnums.serviceType + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getProvidedServiceById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IProvidedService>>(EndPointsEnums.providedService + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllUsersPermissions(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IUserPermissions[]; paginationData: IPagination }>>(
    EndPointsEnums.AllRole,
    {
      method: "POST",
      body: searchObj,
      headers: {
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getUsersPermissionsById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IUserPermissions>>(EndPointsEnums.role + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllUsers(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IUser[]; paginationData: IPagination }>>(EndPointsEnums.allUser, {
    method: "POST",
    body: searchObj,
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getUserById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IUser>>(EndPointsEnums.user + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getRolePermissions(roleId: string, locale: string) {
  const { data } = await fetchClient<ResultHandler<IUserPermissions[]>>(EndPointsEnums.rolePermissions + "/GetRolePermissions", {
    method: "GET",
    params: {
      roleId: roleId,
    },
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllUsersMessages(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IUserMessage[]; paginationData: IPagination }>>(
    EndPointsEnums.allUserMessages,
    {
      method: "POST",
      body: searchObj,
      headers: {
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getUserMessagesById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IUserMessage>>(EndPointsEnums.userMessages + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllAdvertisements(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IAdvertisement[]; paginationData: IPagination }>>(
    EndPointsEnums.allAdvertisements,
    {
      method: "POST",
      body: searchObj,
      headers: {
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAdvertisementById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IAdvertisement>>(EndPointsEnums.advertisements + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllOrders(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IOrder[]; paginationData: IPagination }>>(EndPointsEnums.allOrders, {
    method: "POST",
    body: searchObj,
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getOrderbyId(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IOrder>>(EndPointsEnums.orders + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllRoles(locale: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IRole[]; paginationData: IPagination }>>(EndPointsEnums.AllRole, {
    method: "POST",
    body: searchObj,
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getRoleById(locale: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IRole>>(EndPointsEnums.role + "/" + id, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getListOrderStatus(locale: string) {
  const data = await fetchClient<IListOrderStatus[]>(EndPointsEnums.AllListOrderStatus, {
    method: "GET",
    params: {
      withCount: true,
    },
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getHomeData(locale: string) {
  const data = await fetchClient<IHomeData>(EndPointsEnums.homeData, {
    method: "GET",
    headers: {
      "Accept-Language": locale,
    },
  });
  return data;
}
