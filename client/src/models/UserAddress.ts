export class UserAddress {
  constructor(
    public city: string,
    public postalCode: string,
    public street: {
      streetName: string,
      streetNumber: string
    }
  ) {}
}
