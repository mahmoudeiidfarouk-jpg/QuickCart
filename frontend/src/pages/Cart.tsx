import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
} from "lucide-react";

import api from "../services/api";

interface CartProduct {
    _id: string;
    name: string;
    price: number;
    image: string;
}

interface CartItem {
    product: CartProduct;
    quantity: number;
}

interface Cart {
    _id: string;
    items: CartItem[];
}

const Cart = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");

    const checkoutStarted = useRef(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }

            setError("");

            const response = await api.get("/cart");

            setCart(response.data.data);

        } catch (error: any) {
            console.error("Cart error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load cart."
            );
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    const updateQuantity = async (
        productId: string,
        quantity: number
    ) => {
        if (quantity < 1) {
            return;
        }

        try {
            await api.patch("/cart", {
                productId,
                quantity,
            });

            await fetchCart(false);

            window.dispatchEvent(
                new Event("cartUpdated")
            );

        } catch (error: any) {
            console.error(
                "Update cart error:",
                error
            );
        }
    };

    const removeItem = async (productId: string) => {
        try {
            await api.delete("/cart", {
                data: {
                    productId,
                    quantity: 1,
                },
            });

            await fetchCart(false);

            window.dispatchEvent(
                new Event("cartUpdated")
            );

        } catch (error) {
            console.error(
                "Remove cart item error:",
                error
            );
        }
    };

    const clearCart = async () => {
        try {
            await api.delete("/cart/clear");

            await fetchCart(false);

            window.dispatchEvent(
                new Event("cartUpdated")
            );

        } catch (error) {
            console.error(
                "Clear cart error:",
                error
            );
        }
    };

    const handleCheckout = async () => {
        if (checkoutStarted.current) {
            return;
        }

        checkoutStarted.current = true;

        try {
            setCheckoutLoading(true);
            setCheckoutError("");

            const response = await api.post("/orders");

            console.log(
                "Order created:",
                response.data
            );

            window.location.href = "/orders";

        } catch (error: any) {
            console.error(
                "Create order error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            checkoutStarted.current = false;

            setCheckoutError(
                error.response?.data?.message ||
                "Unable to create order."
            );

        } finally {
            setCheckoutLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="products-message">
                Loading cart...
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-message error">
                {error}
            </div>
        );
    }

    const items = cart?.items || [];

    const totalPrice = items.reduce(
        (total, item) =>
            total +
            item.product.price *
            item.quantity,
        0
    );

    return (
        <div className="cart-page">

            <div className="cart-header">

                <div>
                    <span>
                        Your Shopping Cart
                    </span>

                    <h1>Cart</h1>

                    <p>
                        Review your products before
                        checkout.
                    </p>
                </div>

                {items.length > 0 && (
                    <button
                        className="clear-cart-button"
                        onClick={clearCart}
                    >
                        <Trash2 size={17} />
                        Clear Cart
                    </button>
                )}

            </div>

            {checkoutError && (
                <div className="auth-error">
                    {checkoutError}
                </div>
            )}

            {items.length === 0 ? (
                <div className="empty-cart">

                    <ShoppingBag size={42} />

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Add some products to your
                        cart and they will appear
                        here.
                    </p>

                    <a
                        href="/products"
                        className="primary-button"
                    >
                        Browse Products
                    </a>

                </div>
            ) : (
                <div className="cart-layout">

                    <div className="cart-items">

                        {items.map((item) => (
                            <article
                                className="cart-item"
                                key={item.product._id}
                            >

                                <div className="cart-item-image">

                                    <img
                                        src={
                                            item.product.image
                                        }
                                        alt={
                                            item.product.name
                                        }
                                    />

                                </div>

                                <div className="cart-item-info">

                                    <h3>
                                        {
                                            item.product.name
                                        }
                                    </h3>

                                    <span>
                                        {
                                            item.product.price
                                        }{" "}
                                        EGP
                                    </span>

                                    <div className="cart-item-actions">

                                        <div className="quantity-control">

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product._id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity <=
                                                    1
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus
                                                    size={15}
                                                />
                                            </button>

                                            <strong>
                                                {
                                                    item.quantity
                                                }
                                            </strong>

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product._id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                aria-label="Increase quantity"
                                            >
                                                <Plus
                                                    size={15}
                                                />
                                            </button>

                                        </div>

                                        <button
                                            className="remove-cart-item"
                                            onClick={() =>
                                                removeItem(
                                                    item.product._id
                                                )
                                            }
                                        >
                                            <Trash2
                                                size={17}
                                            />

                                            Remove
                                        </button>

                                    </div>

                                </div>

                                <strong className="cart-item-total">
                                    {
                                        item.product.price *
                                        item.quantity
                                    }{" "}
                                    EGP
                                </strong>

                            </article>
                        ))}

                    </div>

                    <aside className="cart-summary">

                        <h2>
                            Order Summary
                        </h2>

                        <div className="summary-row">

                            <span>
                                Items
                            </span>

                            <strong>
                                {items.reduce(
                                    (
                                        total,
                                        item
                                    ) =>
                                        total +
                                        item.quantity,
                                    0
                                )}
                            </strong>

                        </div>

                        <div className="summary-row total">

                            <span>
                                Total
                            </span>

                            <strong>
                                {totalPrice} EGP
                            </strong>

                        </div>

                        <button
                            className="checkout-button"
                            onClick={
                                handleCheckout
                            }
                            disabled={
                                checkoutLoading
                            }
                        >
                            {checkoutLoading
                                ? "Creating Order..."
                                : "Checkout"
                            }
                        </button>

                        <a
                            href="/products"
                            className="continue-shopping"
                        >
                            <ArrowLeft
                                size={16}
                            />

                            Continue Shopping
                        </a>

                    </aside>

                </div>
            )}

        </div>
    );
};

export default Cart;