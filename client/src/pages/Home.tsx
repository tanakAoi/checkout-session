import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IStripeProduct } from "../models/IStripeProduct";
import { UserContext } from "../contexts/UserContext";
import { checkAuth } from "../components/CheckAuth";

export const Home = () => {
  const user = useContext(UserContext);
  const [products, setProducts] = useState<IStripeProduct[]>([]);
  const [cartItems, setCartItems] = useState<IStripeProduct[]>(
    JSON.parse(localStorage.getItem("cart-items") || "[]")
  );

  useEffect(() => {
    checkAuth(user);
    
      if (user.isLoggedIn) {
        const fetchProducts = async () => {
          const response = await axios.get(
            "http://localhost:3000/api/stripe/fetch-products"
          );
          const productsData = response.data.data;
    
          const products: IStripeProduct[] = productsData.map((product: IStripeProduct) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            default_price: {
              id: product.default_price.id,
              unit_amount: product.default_price.unit_amount,
              currency: product.default_price.currency,
            },
            images: product.images,
            quantity: 1,
          }));
          setProducts(products);
        };
        fetchProducts();
      }
  }, [user.isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleClick = (product: IStripeProduct) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (!existingItem) {
      setCartItems([...cartItems, product]);
    } else {
      window.alert("This item is already in your cart.")
    }
  };

  return (
    <div>
      <div className="p-10 flex flex-wrap justify-center gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-between items-center max-w-xl gap-4 *:max-w-xs"
          >
            <img src={product.images} alt={product.name} />
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-wrap">{product.description}</p>
            <div className="flex w-full items-center justify-between">
              <p className="font-bold text-lg">
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
