
import React, { useEffect, useState } from 'react';

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const LatestCollections = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Fetch products error:", err);
        setError("Products load kora jacche na.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category).filter(Boolean))
  ];

  const filteredProducts = category === "All"
    ? products
    : products.filter((product) => product.category === category);

  return (
    <div className="my-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="text-center py-8 text-3xl">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500 font-medium">
            LATEST <span className="text-gray-800 font-semibold">COLLECTIONS</span>
          </p>
          <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
        </div>

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore our new arrivals and find your perfect outfit today.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`px-4 py-2 rounded-full border text-sm transition ${category === item
              ? "bg-black text-white border-black"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          No products found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {filteredProducts.map((item) => (
            <div key={item._id || item.id} className="text-gray-700 cursor-pointer">
              <div className="overflow-hidden bg-gray-100 rounded-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="hover:scale-110 transition ease-in-out duration-300 w-full h-64 object-cover"
                />
              </div>

              <p className="pt-3 pb-1 text-sm truncate">{item.name}</p>

              <p className="text-sm font-medium">
                {item.currency === "BDT" ? "৳" : item.currency === "EUR" ? "€" : item.currency === "GBP" ? "£" : "$"}
                {item.price}
              </p>

              <p className="text-xs text-gray-500 mt-1">{item.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestCollections;
