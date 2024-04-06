import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IProduct } from "../models/IProduct";
import { UserContext } from "../contexts/UserContext";
import { User } from "../models/User";

export const Home = () => {
  const user = useContext(UserContext);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [cartItems, setCartItems] = useState<IProduct[]>(
    JSON.parse(localStorage.getItem("cart-items") || "[]")
  );
  
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

        const fetchProducts = async () => {
          const response = await axios.get(
            "http://localhost:3000/api/stripe/fetch-products"
          );
          const productsData = response.data.data;
          
          const products: IProduct[] = productsData.map((product: IProduct) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            default_price:  {
              id: product.default_price.id,
              unit_amount: product.default_price.unit_amount,
              currency: product.default_price.currency
            },
            images: product.images,
            quantity: 1
          }))
          setProducts(products);
        };
        fetchProducts();
      } else {
        user.logout();
      }
    };
    authorize();
  }, [user.isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleClick = (product: IProduct) => {
    setCartItems([...cartItems, product]);
  };

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
              <p className="font-bold">
                {(product.default_price.unit_amount / 100).toFixed(2)}
                {product.default_price.currency}
              </p>
              <button className="btn" onClick={() => handleClick(product)}>
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
