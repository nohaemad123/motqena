import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface IServicesSystemsDto {
  nameEn: string;
  nameAr: string;
  id?: string;
  code: string | null;
  names: ITranslatedName[];
  isActive: boolean;
}

export class ServicesSystemsDto implements Partial<IServicesSystemsDto> {
  nameEn: string;
  isActive: boolean;
  nameAr: string;
  id?: string;
  code: string | null;
  names: ITranslatedName[];
  constructor({ id, nameEn = "", isActive = true, nameAr = "", code = null, names = [] }: Partial<ServicesSystemsDto> = {}) {
    this.id = id;
    this.isActive = isActive;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
    this.code = code;
    this.names = names;
  }
}
