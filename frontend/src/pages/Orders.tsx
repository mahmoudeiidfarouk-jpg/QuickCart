import { useEffect, useState } from "react";
import {
    Package,
    Clock,
    CheckCircle,
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
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get(
                    "/orders/my-orders"
                );

                setOrders(response.data.data);
            } catch (error: any) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusIcon = (status: Order["status"]) => {
        switch (status) {
            case "pending":
                return <Clock size={16} />;

            case "processing":
                return <Package size={16} />;

            case "shipped":
                return <Truck size={16} />;

            case "delivered":
                return <CheckCircle size={16} />;

            case "cancelled":
                return <XCircle size={16} />;

            default:
                return <Clock size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="products-message">
                Loading orders...
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

    return (
        <div className="orders-page">

            <div className="orders-header">

                <span>Your Orders</span>

                <h1>Order History</h1>

                <p>
                    View and track your previous orders.
                </p>

            </div>

            {orders.length === 0 ? (
                <div className="empty-orders">

                    <Package size={42} />

                    <h2>No orders yet</h2>

                    <p>
                        Your completed orders will appear here.
                    </p>

                    <a
                        href="/products"
                        className="primary-button"
                    >
                        Browse Products
                    </a>

                </div>
            ) : (
                <div className="orders-list">

                    {orders.map((order) => (
                        <a
                            href={`/orders/${order._id}`}
                            className="order-card-link"
                            key={order._id}
                        >
                            <article className="order-card">

                                <div className="order-card-header">

                                    <div>
                                        <span>
                                            Order
                                        </span>

                                        <strong>
                                            #
                                            {order._id.slice(-8)}
                                        </strong>
                                    </div>

                                    <div
                                        className={`order-status ${order.status}`}
                                    >
                                        {getStatusIcon(
                                            order.status
                                        )}

                                        {order.status}
                                    </div>

                                </div>

                                <div className="order-products">

                                    {order.items.map((item) => (
                                        <div
                                            className="order-product"
                                            key={
                                                item.product
                                                    ._id
                                            }
                                        >

                                            <div className="order-product-image">

                                                <img
                                                    src={
                                                        item
                                                            .product
                                                            .image
                                                    }
                                                    alt={
                                                        item
                                                            .product
                                                            .name
                                                    }
                                                />

                                            </div>

                                            <div>
                                                <h3>
                                                    {
                                                        item
                                                            .product
                                                            .name
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        item.quantity
                                                    }{" "}
                                                    ×{" "}
                                                    {
                                                        item.price
                                                    }{" "}
                                                    EGP
                                                </p>
                                            </div>

                                        </div>
                                    ))}

                                </div>

                                <div className="order-card-footer">

                                    <span>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                    <strong>
                                        {order.totalPrice} EGP
                                    </strong>

                                </div>

                            </article>
                        </a>
                    ))}

                </div>
            )}

        </div>
    );
};

export default Orders;