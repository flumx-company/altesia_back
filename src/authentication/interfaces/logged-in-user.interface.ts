import { LoginErrorsEnum } from '../enums/login-errors.enum';

export interface LoggedInUserInterface {
  token: string;
  loginStatus: LoginErrorsEnum;
}
