export default interface IResetPasswordDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export class ResetPasswordDto implements Partial<IResetPasswordDto> {
  email: string;
  password: string;
  confirmPassword: string;
  constructor({ email = "", password = "", confirmPassword = "" }: Partial<IResetPasswordDto> = {}) {
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }
}
