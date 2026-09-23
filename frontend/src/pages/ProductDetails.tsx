import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ShoppingCart,
    Check,
    Trash2,
} from "lucide-react";

import api from "../services/api";
import type { Product } from "../types/product";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
    const { user } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [addingToCart, setAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const productId =
        window.location.pathname.split("/").pop();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(
                    `/products/${productId}`
                );

                setProduct(response.data.data);

            } catch (error) {
                console.error(error);

                setError(
                    "Unable to load product."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        if (!product) {
            return;
        }

        try {
            setAddingToCart(true);
            setAddedToCart(false);

            await api.post("/cart", {
                productId: product._id,
                quantity: 1,
            });

            window.dispatchEvent(
                new Event("cartUpdated")
            );

            setAddedToCart(true);

            setTimeout(() => {
                setAddedToCart(false);
            }, 2000);

        } catch (error) {
            console.error(error);

        } finally {
            setAddingToCart(false);
        }
    };

    const handleDeleteProduct = async () => {
        if (!product) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError("");

            await api.delete(
                `/products/${product._id}`
            );

            window.location.href = "/products";

        } catch (error: any) {
            console.error(error);

            setDeleteError(
                error.response?.data?.message ||
                "Unable to delete product."
            );

            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="products-message">
                Loading product...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="products-message error">
                {error || "Product not found."}
            </div>
        );
    }

    const isProductOwner =
        user?.role === "seller" &&
        user.id === product.seller;

    return (
        <div className="product-details-page">

            <a
                href="/products"
                className="back-button"
            >
                <ArrowLeft size={17} />
                Back to Products
            </a>

            {deleteError && (
                <div className="auth-error">
                    {deleteError}
                </div>
            )}

            <section className="product-details-card">

                <div className="product-details-image">
                    <img
                        src={product.image}
                        alt={product.name}
                    />
                </div>

                <div className="product-details-content">

                    <span className="product-category">
                        {product.category}
                    </span>

                    <h1>
                        {product.name}
                    </h1>

                    <strong className="product-details-price">
                        {product.price} EGP
                    </strong>

                    <p className="product-details-description">
                        {product.description}
                    </p>

                    <div className="product-stock">
                        {product.stock > 0
                            ? `${product.stock} items available`
                            : "Out of stock"
                        }
                    </div>

                    <button
                        className="add-to-cart-button"
                        onClick={handleAddToCart}
                        disabled={
                            product.stock === 0 ||
                            addingToCart
                        }
                    >
                        {addedToCart ? (
                            <>
                                <Check size={19} />
                                Added to Cart
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={19} />

                                {addingToCart
                                    ? "Adding..."
                                    : "Add to Cart"
                                }
                            </>
                        )}
                    </button>

                    {isProductOwner && (
                        <button
                            className="delete-product-button"
                            onClick={handleDeleteProduct}
                            disabled={deleting}
                        >
                            <Trash2 size={18} />

                            {deleting
                                ? "Deleting..."
                                : "Delete Product"
                            }
                        </button>
                    )}

                </div>

            </section>

        </div>
    );
};

export default ProductDetails;