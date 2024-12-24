import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface IJobDto {
  nameEn: string;
  nameAr: string;
  id?: string;
  code: string | null;
  names: ITranslatedName[];
  isActive: boolean;
}

export class JobDto implements Partial<IJobDto> {
  nameEn: string;
  nameAr: string;
  id?: string;
  code: string | null;
  isActive: boolean;
  names: ITranslatedName[];
  constructor({ id, nameEn = "", isActive = true, nameAr = "", code = null, names = [] }: Partial<JobDto> = {}) {
    this.id = id;
    this.isActive = isActive;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
    this.code = code;
    this.names = names;
  }
}
