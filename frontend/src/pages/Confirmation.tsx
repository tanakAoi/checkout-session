import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Button } from "../components/Button";

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
            }
          }
        };
        validation();
      } catch (error) {
        setError(true);
        console.error("Error", error);
      } finally {
        setIsLoading(false);
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
    localStorage.setItem("service-point", "");
  }

  return (
    <div className="h-screen w-full flex justify-center">
      {isLoading ? (
        <span className="loading loading-dots loading-lg"></span>
      ) : verified ? (
        <div className="flex flex-col justify-center items-center gap-14">
          <p className="text-2xl font-bold">Thank you for your order!</p>
          <p>{isMailSent ? "Your order confirmation has been sent 📫" : ""}</p>
          <Button
            children={"Back to home"}
            size={"md"}
            color={"light"}
            linkTo={"/"}
          />
        </div>
      ) : (
        <p>{error && "Something went wrong"}</p>
      )}
    </div>
  );
};
