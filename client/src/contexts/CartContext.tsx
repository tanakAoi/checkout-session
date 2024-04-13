import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IProduct } from "../models/IProduct";
import { toast } from "react-toastify";

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

interface ICartContext {
  cart: ICartItem[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

const initValues = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
};

const CartContext = createContext<ICartContext>(initValues);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useState<ICartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (storedCart.length > 0) {
      setCart(storedCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: IProduct) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (!existingItem) {
      setCart([...cart, { product, quantity: 1 }]);
      toast.success("Product added to cart!", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.error("Already in your cart.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(
      (product) => product.product.id !== productId
    );
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      const updatedCart = cart.map((product) => {
        if (product.product.id === productId) {
          return { ...product, quantity: quantity };
        }
        return product;
      });
      setCart(updatedCart);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
