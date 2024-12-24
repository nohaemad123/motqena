export default interface IForgetPasswordDto {
  email: string;
}

export class ForgetPasswordDto implements Partial<IForgetPasswordDto> {
  email: string;
  constructor({ email = "" }: Partial<IForgetPasswordDto> = {}) {
    this.email = email;
  }
}
