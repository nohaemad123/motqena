export interface IShiftDto {
  name: string;
  id?: string;
  time: number;
  isActive: boolean;
}

export class ShiftDto implements Partial<IShiftDto> {
  name: string;
  id?: string;
  isActive: boolean;
  time: number;
  constructor({ id, time = 0, isActive = true, name = "" }: Partial<ShiftDto> = {}) {
    this.id = id;
    this.isActive = isActive;
    this.name = name;
    this.time = time;
  }
}
