export interface IUserAddress {
  city: string;
  postalCode: string;
  street: {
    streetName: string;
    streetNumber: string;
  };
}
