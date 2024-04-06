export class User {
  constructor(
    public userName: string,
    public email: string,
    public password: string
  ) {}
}

export interface IUser {
  userName: string,
  email: string;
  password: string;
}
