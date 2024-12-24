import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IServiceTypeDto {
  nameAr: string;
  nameEn: string;
  id?: string;
  systemOfServiceId: string;
  shiftId: string;
  womenIsRequired: boolean;
  names: ITranslatedName[];
  isActive: boolean;
}

export class ServiceTypeDto implements Partial<IServiceTypeDto> {
  nameAr: string;
  nameEn: string;
  id?: string;
  systemOfServiceId: string;
  shiftId: string;
  isActive: boolean;
  names: ITranslatedName[];
  womenIsRequired: boolean;
  constructor({
    id,
    nameAr = "",
    isActive = true,
    nameEn = "",
    names = [],
    systemOfServiceId = "",
    shiftId = "",
    womenIsRequired = true,
  }: Partial<ServiceTypeDto> = {}) {
    this.id = id;
    this.nameEn = nameEn;
    this.names = names;
    this.systemOfServiceId = systemOfServiceId;
    this.shiftId = shiftId;
    this.isActive = isActive;
    this.womenIsRequired = womenIsRequired;
    this.nameAr = nameAr;
  }
}
