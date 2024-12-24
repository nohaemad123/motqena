import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IServiceType {
  name: string;
  id?: string;
  names: ITranslatedName[];
  serviceSystem: string;
  shift: string;
  isWoman: boolean;
  isActive?: boolean;
}
