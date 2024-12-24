import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface IBranch {
  id?: string;
  names: ITranslatedName[];
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  longitude: number;
  latitude: number;
  isActive?: boolean;
}
