export interface IUser {
  id?: string;
  name: string;
  phoneNumber: string;
  address: string;
  jobNumber: string;
  roles: string[];
  branches: string[];
  password: string;
  confirmPassword: string;
  email: string;
  isActive?: boolean;
}
