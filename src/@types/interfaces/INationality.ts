import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface INationality {
  nameEn: string;
  nameAr: string;
  id?: string;
  name: string;
  code: string | null;
  names: ITranslatedName[];
  isActive?: boolean;
}
