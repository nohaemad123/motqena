export interface IProvidedService {
  id?: string;
  serviceSystem: string;
  typeOfService: string;
  details: IProvidedServiceDetails[];
  isActive?: boolean;
}

export interface IProvidedServiceDetails {
  tax: number;
  total: number;
  branchId: string;
  id: string;
  externalFees: number;
  workerCount: number;
  internalFees: number;
  rowId: string;
  governmentFees: number;
  nationalityId: string;
  hourPrice: number;
  dayPrice: number;
  monthPrice: number;
  descount: number;
}
