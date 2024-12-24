export default interface IOtpDto {
  email: string;
  code: string;
}

export class OtpDto implements Partial<IOtpDto> {
  email: string;
  code: string;
  constructor({ email = "", code = "" }: Partial<IOtpDto> = {}) {
    this.email = email;
    this.code = code;
  }
}
