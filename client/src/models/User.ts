export class User {
  constructor(
    public stripeId: string,
    public userName: string,
    public email: string,
    public password: string
  ) {}
}

export interface IUser {
  stripeId: string;
  userName: string;
  email: string;
  password: string;
}
