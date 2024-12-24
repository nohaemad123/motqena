export interface ILogin {
  message?: string;
  isAuthenticated?: boolean;
  username?: string;
  email?: string;
  token?: string;
  expiresOn?: string;
  language?: string;
}
