import { UsersInfo } from "./usersinfo";

export interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    usersInfo: UsersInfo;
  }