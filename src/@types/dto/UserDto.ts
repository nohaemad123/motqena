export interface IUserDto {
  id?: string;
  name: string;
  phoneNumber: string;
  address: string;
  jobNumber: string;
  roles: string[];
  branches: string[];
  password: string;
  confirmPassword: string;
  email: string | null;
  isActive: boolean;
}

export class UserDto implements Partial<IUserDto> {
  id?: string;
  name: string;
  phoneNumber: string;
  address: string;
  jobNumber: string;
  roles: string[];
  branches: string[];
  password: string;
  confirmPassword: string;
  email: string | null;
  isActive: boolean;
  constructor({
    id,
    name = "",
    phoneNumber = "",
    address = "",
    jobNumber = "",
    roles = [],
    branches = [],
    password = "",
    confirmPassword = "",
    email = "",
    isActive = true,
  }: Partial<UserDto> = {}) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.jobNumber = jobNumber;
    this.roles = roles;
    this.branches = branches;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.email = email;
    this.isActive = isActive;
  }
}
