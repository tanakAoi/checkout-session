import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IProduct } from "../models/IProduct";
import { AuthContext } from "../contexts/AuthContext";
import { UserContext } from "../contexts/UserContext";

interface IUser {
  userName: string;
  email: string;
}

export const Home = () => {
  const [user, setUser] = useState<IUser>();
  // const user = useContext(UserContext);
  const auth = useContext(AuthContext);
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const authorize = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/auth/authorize",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        // user.login(response.data);
        setUser(response.data);
        auth.login();

        const fetchProducts = async () => {
          const response = await axios.get(
            "http://localhost:3000/api/stripe/fetch-products"
          );
          const products = response.data.data;
          setProducts(products);
        };
        fetchProducts();
      } else {
        // user.logout();
        auth.logout();
      }
    };
    authorize();
  }, [auth.isLoggedIn]);

  return (
    <div>
      <div className="py-10 flex flex-wrap justify-center gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-between items-center max-w-xl gap-4"
          >
            <img src={product.images} alt={product.name} className="max-w-xs" />
            <h2 className="font-bold">{product.name}</h2>
            <p className="max-w-xs">{product.description}</p>
            <div className="flex w-full items-center justify-around">
              <p className="font-bold">{(product.default_price.unit_amount / 100).toFixed(2)}{product.default_price.currency}</p>
              <button className="btn">Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
