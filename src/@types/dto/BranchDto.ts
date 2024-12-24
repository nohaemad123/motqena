import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface IBranchDto {
  nameEn: string;
  nameAr: string;
  id?: string;
  cityName: string;
  longitude: number | null;
  latitude: number | null;
  neighborhood: string;
  email: string;
  phone: string;
  locationTitle: string;
  isActive: boolean;
  names: ITranslatedName[];
}

export class BranchDto implements Partial<IBranchDto> {
  nameEn: string;
  isActive: boolean;
  nameAr: string;
  longitude: number | null;
  latitude: number | null;
  id?: string;
  email: string;
  cityName: string;
  neighborhood: string;
  locationTitle: string;
  phone: string;
  names: ITranslatedName[];
  constructor({
    id,
    nameEn = "",
    locationTitle = "",
    nameAr = "",
    cityName = "",
    longitude = null,
    latitude = null,
    phone = "",
    isActive = true,
    email = "",
    neighborhood = "",
    names = [],
  }: Partial<BranchDto> = {}) {
    this.id = id;
    this.isActive = isActive;
    this.phone = phone;
    this.email = email;
    this.longitude = longitude;
    this.latitude = latitude;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
    this.locationTitle = locationTitle;
    this.cityName = cityName;
    this.neighborhood = neighborhood;
    this.names = names;
  }
}
