import axios from "axios";
import { useEffect, useState } from "react";
import { IProduct } from "../models/IProduct";
import { useCart } from "../contexts/CartContext";

export const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/stripe/fetch-products"
      );
      const productsData = response.data.data;

      const products: IProduct[] = productsData.map((product: IProduct) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        default_price: {
          id: product.default_price.id,
          unit_amount: product.default_price.unit_amount,
          currency: product.default_price.currency,
        },
        images: product.images,
      }));
      setProducts(products);
    };
    fetchProducts();
  }, []);

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
              <button className="btn" onClick={() =>addToCart(product)}>
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
