
import React, { useEffect, useState } from "react";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const Collection = ({ searchTerm, setSearchTerm, showSearch }) => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load products");
                }

                setProducts(Array.isArray(data) ? data : data.products || []);
            } catch (err) {
                setError(err.message || "Failed to load products");
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

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            category === "All" || product.category === category;

        const term = (searchTerm || "").trim().toLowerCase();

        const matchesSearch =
            !term ||
            [product.name, product.description, product.category].some(
                (value) => value?.toLowerCase().includes(term)
            );

        return matchesCategory && matchesSearch;
    });

    return (
        <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-12 sm:px-8">
            <div className="mb-10 text-center">
                <p className="mb-3 text-sm tracking-[0.25em] text-pink-500">
                    DISCOVER YOUR STYLE
                </p>
                <h1 className="text-4xl font-semibold">
                    Our <span className="text-pink-500">Collection</span>
                </h1>
            </div>

            {showSearch && (
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search products..."
                    className="mx-auto mb-6 block w-full max-w-lg rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                />
            )}

            <div className="mb-8 flex flex-wrap justify-center gap-3">
                {categories.map((item) => (
                    <button
                        key={item}
                        onClick={() => setCategory(item)}
                        className={`rounded-full border px-4 py-2 text-sm ${category === item
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-pink-500"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="py-10 text-center">Loading products...</p>
            ) : error ? (
                <p className="py-10 text-center text-red-600">{error}</p>
            ) : filteredProducts.length === 0 ? (
                <p className="py-10 text-center text-gray-500">
                    No products found.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <article
                            key={product._id}
                            className="overflow-hidden border border-gray-100 transition hover:shadow-lg"
                        >
                            <div className="aspect-[3/4] bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="p-4">
                                <p className="text-xs uppercase text-pink-500">
                                    {product.category}
                                </p>
                                <h2 className="mt-2 font-medium">{product.name}</h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    {product.description}
                                </p>
                                <p className="mt-3 font-semibold">
                                    {product.currency || "USD"}{" "}
                                    {Number(product.price).toLocaleString()}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Collection;
