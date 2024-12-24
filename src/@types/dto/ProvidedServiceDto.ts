import { IProvidedServiceDetails } from "@/@types/interfaces/IProvidedService";
import { customId } from "@/@types/stables";

export interface IProvidedServiceDto {
  id?: string;
  typeOfServiceId: string;
  systemOfServiceId: string;
  isActive?: boolean;
  details: ProvidedServiceRow[];
}

export class ProvidedServiceDto implements Partial<IProvidedServiceDto> {
  id?: string;
  systemOfServiceId: string;
  typeOfServiceId: string;
  isActive: boolean;
  details: ProvidedServiceRow[];
  constructor({ id, typeOfServiceId = "", systemOfServiceId = "", details = [] }: Partial<ProvidedServiceDto> = {}) {
    this.id = id;
    this.isActive = true;
    this.typeOfServiceId = typeOfServiceId;
    this.details = details;
    this.systemOfServiceId = systemOfServiceId;
  }
}

export class ProvidedServiceRow implements Partial<IProvidedServiceDetails> {
  id: string;
  rowId: string;
  tax: number;
  total: number;
  branchId: string;
  workerCount: number;
  nationalityId: string;
  hourPrice: number;
  dayPrice: number;
  monthPrice: number;
  externalFees: number;
  descount: number;
  internalFees: number;
  governmentFees: number;
  constructor({
    id = "",
    rowId = customId(),
    workerCount = 0,
    tax = 0,
    internalFees = 0,
    total = 0,
    governmentFees = 0,
    externalFees = 0,
    branchId = "",
    nationalityId = "",
    hourPrice = 0,
    dayPrice = 0,
    monthPrice = 0,
    descount = 0,
  }: Partial<IProvidedServiceDetails> = {}) {
    this.id = id;
    this.governmentFees = governmentFees;
    this.externalFees = externalFees;
    this.rowId = rowId;
    this.internalFees = internalFees;
    this.tax = tax;
    this.workerCount = workerCount;
    this.total = total;
    this.branchId = branchId;
    this.nationalityId = nationalityId;
    this.hourPrice = hourPrice;
    this.dayPrice = dayPrice;
    this.monthPrice = monthPrice;
    this.descount = descount;
  }
}
