import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { IProduct } from "../models/IProduct";

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

interface ICartContext {
  cart: ICartItem[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void,
}

const initValues = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {}
};

const CartContext = createContext<ICartContext>(initValues);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: PropsWithChildren) => {

  const [cart, setCart] = useState<ICartItem[]>([]);

  useEffect(() => {
    const cartItemInLS =  localStorage.getItem("cart");
    if (cartItemInLS) {
      setCart(JSON.parse(cartItemInLS))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: IProduct) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (!existingItem) {
      setCart([...cart, { product, quantity: 1 }]);
    }
    else {
      window.alert("This item is already in your cart.")
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((product) => product.product.id !== productId)
    setCart(updatedCart)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = cart.map(product => {
      if(product.product.id === productId) {
        return {...product, quantity: quantity}
      }
      return product
    })
    setCart(updatedCart)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

