import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface INationalityDto {
  nameEn: string;
  nameAr: string;
  id?: string;
  code: string | null;
  names: ITranslatedName[];
  isActive: boolean;
}

export class NationalityDto implements Partial<INationalityDto> {
  nameEn: string;
  nameAr: string;
  isActive: boolean;
  id?: string;
  code: string | null;
  names: ITranslatedName[];
  constructor({ id, nameEn = "", isActive = true, nameAr = "", code = null, names = [] }: Partial<NationalityDto> = {}) {
    this.id = id;
    this.nameEn = nameEn;
    this.isActive = isActive;
    this.nameAr = nameAr;
    this.code = code;
    this.names = names;
  }
}
