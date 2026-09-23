import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import api from "../services/api";
import type { Product } from "../types/product";
import ProductCard from "../components/ProductCard";

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");

                setProducts(response.data.data);
            } catch (error) {
                console.error(error);
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="products-page">

            <section className="products-header">

                <div>
                    <span>QuickCart Store</span>

                    <h1>All Products</h1>

                    <p>
                        Browse our collection and find what you need.
                    </p>
                </div>

                <div className="products-search">

                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>

            </section>

            {loading && (
                <div className="products-message">
                    Loading products...
                </div>
            )}

            {error && (
                <div className="products-message error">
                    {error}
                </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
                <div className="products-message">
                    No products found.
                </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
                <div className="products-grid">

                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                        />
                    ))}

                </div>
            )}

        </div>
    );
};

export default Products;