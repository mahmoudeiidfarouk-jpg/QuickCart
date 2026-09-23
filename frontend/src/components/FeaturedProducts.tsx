import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
} from "lucide-react";

import api from "../services/api";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const sliderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");

                setProducts(response.data.data);
            } catch (error) {
                console.error(error);

                setError(
                    "Unable to load products."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const scrollLeft = () => {
        sliderRef.current?.scrollBy({
            left: -340,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        sliderRef.current?.scrollBy({
            left: 340,
            behavior: "smooth",
        });
    };

    return (
        <section className="featured-products">

            <div className="section-header">

                <div>
                    <span>
                        Our Products
                    </span>

                    <h2>
                        Featured Products
                    </h2>

                    <p>
                        Explore some of our latest products.
                    </p>
                </div>

                <a
                    href="/products"
                    className="view-all-button"
                >
                    View All
                    <ArrowRight size={17} />
                </a>

            </div>

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

            {!loading &&
                !error &&
                products.length === 0 && (
                    <div className="products-message">
                        No products available.
                    </div>
                )}

            {!loading &&
                !error &&
                products.length > 0 && (
                    <div className="featured-slider-wrapper">

                        <button
                            className="featured-slider-button left"
                            onClick={scrollLeft}
                            aria-label="Previous products"
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <div
                            className="featured-slider"
                            ref={sliderRef}
                        >
                            {products.map((product) => (
                                <div
                                    className="featured-slider-item"
                                    key={product._id}
                                >
                                    <ProductCard
                                        product={product}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            className="featured-slider-button right"
                            onClick={scrollRight}
                            aria-label="Next products"
                        >
                            <ArrowRight size={19} />
                        </button>

                    </div>
                )}

        </section>
    );
};

export default FeaturedProducts;