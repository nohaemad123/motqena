import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface IJob {
  id?: string;
  names: ITranslatedName[];
  name: string;
  code?: string | null;
  isActive?: boolean;
}
