import axios from "axios";
import { IUserAddress } from "../models/IUserAddress";
import { useEffect, useState } from "react";
import { IServicePoint } from "../models/IServicePoint";
import { Button } from "./Button";

interface IUserAddressProps {
  userAddress: IUserAddress;
  proceedToCheckout: () => void;
}

export const ServicePoints = ({
  userAddress,
  proceedToCheckout,
}: IUserAddressProps) => {
  const [servicePoints, setServicePoints] = useState<IServicePoint[]>([]);
  const [userServicePoint, setUserServicePoint] = useState<IServicePoint>(
    JSON.parse(localStorage.getItem("service-point") || "[]")
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServicePoints = async () => {
      setIsLoading(true);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/postnord/service-points",
          userAddress
        );
        setServicePoints(
          response.data.servicePointInformationResponse.servicePoints
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error: fetchServicePoints", error);
      }
    };
    fetchServicePoints();
  }, []);

  const handleClick = (servicePoint: IServicePoint) => {
    setUserServicePoint(servicePoint);
    proceedToCheckout();
  };
  
  useEffect(() => {
    localStorage.setItem("service-point", JSON.stringify(userServicePoint));
  }, [userServicePoint])

  return (
    <div className="flex flex-col items-center">
      {isLoading ? (
        <span className="loading loading-ring loading-lg"></span>
      ) : (
        servicePoints.length > 0 && (
          <div className="py-10 flex flex-col justify-center items-center gap-5">
            {servicePoints.map((servicePoint) => {
              return (
                <div
                  key={servicePoint.servicePointId}
                  className={`card w-full bg-base-100 shadow-xl ${
                    userServicePoint === servicePoint
                      ? "border-4 border-blossom"
                      : "border-4 border-transparent"
                  }`}
                >
                  <div className="card-body">
                    <h3 className="card-title">{servicePoint.name}</h3>
                    <p>
                      {servicePoint.deliveryAddress.streetName}{" "}
                      {servicePoint.deliveryAddress.streetNumber}
                    </p>
                    <p>{servicePoint.deliveryAddress.postalCode}</p>
                    <div className="card-actions justify-end">
                      <Button
                        children={"Choose"}
                        size={"sm"}
                        color={"light"}
                        event={() => {
                          handleClick(servicePoint);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};
