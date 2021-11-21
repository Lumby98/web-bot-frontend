import {LoginTypeEnum} from "../enums/loginType.enum";


export interface InsertSavedLoginDto {
  username: string;
  password: string;
  loginType: LoginTypeEnum;
  key: string;
}
