import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IServicesSystems {
  nameEn: string;
  nameAr: string;
  id?: string;
  name: string;
  code: string | null;
  names: ITranslatedName[];
  showPrice: boolean | null;
  showExternalFees: boolean | null;
  showInternalFees: boolean | null;
  showGovernmentFees: boolean | null;
  showDiscount: boolean | null;
  isActive?: boolean;
}
