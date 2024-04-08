import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { NavLink } from "react-router-dom";

export const Confirmation = () => {
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMailSent, setIsMailSent] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    const authorize = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/auth/authorize",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        user.login(response.data);
      } else {
        user.logout();
      }
    };
    authorize();
  }, [user.isLoggedIn]);

  useEffect(() => {
    if (!verified) {
      const validation = async () => {
        setIsLoading(true);

        let sessionId;
        const sessionIdData = localStorage.getItem("sessionID");
        const servicePoint = localStorage.getItem("service-point");

        if (sessionIdData && servicePoint) {
          sessionId = JSON.parse(sessionIdData);
          const data = { sessionId: sessionId, servicePoint: servicePoint };

          const response = await axios.post(
            "http://localhost:3000/api/stripe/validation",
            data
          );

          if (response.status === 200) {
            setVerified(response.data.verified);
            setIsLoading(false);
            localStorage.setItem("sessionID", "");
            localStorage.setItem("cart-items", "[]");
            localStorage.setItem("service-point", "");
          }
        }
      };
      validation();
    }

    if (verified && !isMailSent) {
      const sendConfirmation = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/sendgrid/send-order-confirmation",
            user.userData
          );
          console.log(response);
          if (response.status === 200) {
            setIsMailSent(true);
          }
        } catch (error) {
          console.error("Error", error);
        }
      };
      sendConfirmation();
    }
  }, [verified]);

  return (
    <div>
      {verified && !isLoading ? (
        <div className="flex flex-col gap-4">
          <p>Thank you for your order!</p>
          <p>{isMailSent ? "Your order confirmation has been sent." : ""}</p>
          <button>
            <NavLink to={"/home"}>Back to home</NavLink>
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
