export interface IServicePoint {
    name: string,
    servicePointId: string,
    deliveryAddress: {
        city: string,
        postalCode: string,
        streetName: string,
        streetNumber: string
    }

}