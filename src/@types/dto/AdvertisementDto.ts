export interface IAdvertisementDto {
  id?: string;
  date: Date;
  ImageFile: string;
  isActive: boolean;
}

export class AdvertisementDto implements Partial<IAdvertisementDto> {
  id?: string;
  date: Date;
  ImageFile: string;
  isActive: boolean;
  constructor({ id, date = new Date(), ImageFile = "", isActive = true }: Partial<AdvertisementDto> = {}) {
    this.id = id;
    this.date = date;
    this.ImageFile = ImageFile;
    this.isActive = isActive;
  }
}
