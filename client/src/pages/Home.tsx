import axios from "axios";
import { useEffect, useState } from "react";
import { IProduct } from "../models/IProduct";

export const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/stripe/fetch-products"
      );
      const products = response.data.data;
      setProducts(products);
      console.log(products);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-10">
        {products.map((product) => (
          <div className="flex flex-col justify-between items-center max-w-xl gap-4">
            <img src={product.images} alt={product.name} className="max-w-xs" />
            <h2 className="font-bold">{product.name}</h2>
            <p className="max-w-xs">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
