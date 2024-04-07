import axios from "axios";
import { useEffect, useState } from "react";

export const Confirmation = () => {
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!verified) {
      const validation = async () => {
        let sessionId;
        const sessionIdData = localStorage.getItem("sessionID");

        if (sessionIdData) {
          sessionId = JSON.parse(sessionIdData);

          const response = await axios.post(
            "http://localhost:3000/api/stripe/validation",
            { sessionId }
          );
          console.log(response);
          

          if ( response.status === 200 ) {
            setVerified(response.data.verified);
            setIsLoading(false);
            localStorage.setItem("sessionID", "");
            localStorage.setItem("cart-items", "[]");
          }
        }
      };
      validation();
    }
  }, [verified]);

  return (
    <div>
      <h2>{verified && !isLoading ? "Thank you!" : "Loading..."}</h2>
    </div>
  );
};
