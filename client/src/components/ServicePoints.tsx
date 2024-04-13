import axios from "axios";
import { IUserAddress } from "../models/IUserAddress";
import { useEffect, useState } from "react";
import { IServicePoint } from "../models/IServicePoint";

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

  useEffect(() => {
    const fetchServicePoints = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/postnord/service-points",
          userAddress
        );
        setServicePoints(
          response.data.servicePointInformationResponse.servicePoints
        );
      } catch (error) {
        console.error("Error: fetchServicePoints", error);
      }
    };
    fetchServicePoints();
  }, []);

  const handleClick = (servicePoint: IServicePoint) => {
    setUserServicePoint(servicePoint);
    localStorage.setItem("service-point", JSON.stringify(userServicePoint));
    proceedToCheckout();
  };

  return (
    <>
      {servicePoints.length > 0 && (
        <div className="py-10 flex flex-col justify-center items-center gap-5">
          {servicePoints.map((servicePoint) => {
            return (
              <div
                key={servicePoint.servicePointId}
                className={`card w-96 bg-base-100 shadow-xl ${
                  userServicePoint === servicePoint
                    ? "border-4 border-cyan-600"
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
                    <button
                      className="btn"
                      onClick={() => {
                        handleClick(servicePoint);
                      }}
                    >
                      Choose
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
