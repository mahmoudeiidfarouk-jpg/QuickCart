import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Package,
    Truck,
    XCircle,
} from "lucide-react";

import api from "../services/api";

interface OrderProduct {
    _id: string;
    name: string;
    image: string;
}

interface OrderItem {
    product: OrderProduct;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled";
    createdAt: string;
    updatedAt: string;
}

const OrderDetails = () => {
    const [order, setOrder] = useState<Order | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelError, setCancelError] = useState("");

    const orderId = window.location.pathname.split("/").pop();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(
                    `/orders/${orderId}`
                );

                setOrder(response.data.data);
            } catch (error: any) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleCancelOrder = async () => {
        try {
            setCancelLoading(true);
            setCancelError("");

            const response = await api.patch(
                `/orders/${orderId}/cancel`
            );

            setOrder(response.data.data);
        } catch (error: any) {
            console.error(error);

            setCancelError(
                error.response?.data?.message ||
                "Unable to cancel order."
            );
        } finally {
            setCancelLoading(false);
        }
    };

    const getStatusIcon = () => {
        if (!order) {
            return <Clock size={17} />;
        }

        switch (order.status) {
            case "pending":
                return <Clock size={17} />;

            case "processing":
                return <Package size={17} />;

            case "shipped":
                return <Truck size={17} />;

            case "delivered":
                return <CheckCircle size={17} />;

            case "cancelled":
                return <XCircle size={17} />;

            default:
                return <Clock size={17} />;
        }
    };

    if (loading) {
        return (
            <div className="products-message">
                Loading order...
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="products-message error">
                {error || "Order not found."}
            </div>
        );
    }

    const canCancel =
        order.status === "pending" ||
        order.status === "processing";

    return (
        <div className="order-details-page">

            <a
                href="/orders"
                className="back-button"
            >
                <ArrowLeft size={17} />
                Back to Orders
            </a>

            {cancelError && (
                <div className="auth-error">
                    {cancelError}
                </div>
            )}

            <section className="order-details-card">

                <div className="order-details-header">

                    <div>
                        <span>Order</span>

                        <h1>
                            #{order._id.slice(-8)}
                        </h1>

                        <p>
                            {new Date(
                                order.createdAt
                            ).toLocaleDateString()}
                        </p>
                    </div>

                    <div
                        className={`order-status ${order.status}`}
                    >
                        {getStatusIcon()}
                        {order.status}
                    </div>

                </div>

                <div className="order-details-items">

                    {order.items.map((item) => (
                        <div
                            className="order-details-item"
                            key={item.product._id}
                        >

                            <div className="order-details-item-image">

                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                />

                            </div>

                            <div className="order-details-item-info">

                                <h3>
                                    {item.product.name}
                                </h3>

                                <p>
                                    Quantity: {item.quantity}
                                </p>

                            </div>

                            <strong>
                                {item.price *
                                    item.quantity}{" "}
                                EGP
                            </strong>

                        </div>
                    ))}

                </div>

                <div className="order-details-summary">

                    <span>Total</span>

                    <strong>
                        {order.totalPrice} EGP
                    </strong>

                </div>

                {canCancel && (
                    <button
                        className="cancel-order-button"
                        onClick={handleCancelOrder}
                        disabled={cancelLoading}
                    >
                        <XCircle size={18} />

                        {cancelLoading
                            ? "Cancelling..."
                            : "Cancel Order"
                        }
                    </button>
                )}

            </section>

        </div>
    );
};

export default OrderDetails;