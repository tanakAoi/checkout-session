import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { NavLink } from "react-router-dom";

export const Confirmation = () => {
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMailSent, setIsMailSent] = useState(false);
  const [orderDetail, setOrderDetail] = useState();
  const [error, setError] = useState(false);
  const { userData } = useUser();

  useEffect(() => {
    if (!verified) {
      try {
        const validation = async () => {
          setIsLoading(true);

          let sessionId;
          const sessionIdData = localStorage.getItem("sessionID");
          const servicePoint = localStorage.getItem("service-point");

          if (sessionIdData && servicePoint) {
            sessionId = JSON.parse(sessionIdData);

            const data = {
              sessionId: sessionId,
              servicePoint: servicePoint,
            };

            const response = await axios.post(
              "http://localhost:3000/api/stripe/validation",
              data
            );

            if (response.status === 200) {
              setOrderDetail(response.data.order);
              setVerified(response.data.verified);
              setIsLoading(false);
            }
          }
        };
        validation();
      } catch (error) {
        setError(true);
        console.error("Error", error);
      }
    }

    if (verified && !isMailSent) {
      const sendConfirmation = async () => {
        try {
          const data = {
            email: userData.email,
            order: orderDetail,
          };

          const response = await axios.post(
            "http://localhost:3000/api/sendgrid/send-order-confirmation",
            data
          );

          if (response.status === 200) {
            setIsMailSent(true);
          }
        } catch (error) {
          setError(true);
          console.error("Error", error);
        }
      };
      sendConfirmation();
    }
  }, [verified]);

  if (verified && isMailSent) {
    localStorage.setItem("sessionID", "");
    localStorage.setItem("cart", "[]");
    localStorage.setItem("service-point", "");
  }

  return (
    <div className="h-screen flex">
      {verified && !isLoading ? (
        <div className="flex flex-col justify-center items-center gap-10">
          <p className="text-xl font-bold">Thank you for your order!</p>
          <p>{isMailSent ? "Your order confirmation has been sent 📫" : ""}</p>
          <button className="btn">
            <NavLink to={"/"}>Back to home</NavLink>
          </button>
        </div>
      ) : (
        <p>{error ? "Something went wrong" : "Loading..."}</p>
      )}
    </div>
  );
};
