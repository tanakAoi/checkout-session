import { IUserContext } from "../contexts/UserContext";
import axios from "axios";

export const checkAuth = async (user: IUserContext) => {

  try {
    const response = await axios.get(
      "http://localhost:3000/api/auth/authorize",
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      user.login(response.data);
    }
  } catch (error: any) {
    if ((error.response.status = 401)) {
      user.logout();
    }
    console.error("Error", error);
  }
};
