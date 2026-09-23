import {
    ShoppingCart,
    Search,
    User,
    Menu,
    X,
    LogOut,
    Plus,
} from "lucide-react";
import { useEffect, useState } from "react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchCartCount = async () => {
            if (!user) {
                setCartCount(0);
                return;
            }

            try {
                const response = await api.get("/cart");

                const items =
                    response.data.data.items || [];

                const count = items.reduce(
                    (
                        total: number,
                        item: { quantity: number }
                    ) => total + item.quantity,
                    0
                );

                setCartCount(count);

            } catch (error) {
                console.error(error);
                setCartCount(0);
            }
        };

        fetchCartCount();

        const handleCartUpdated = () => {
            fetchCartCount();
        };

        window.addEventListener(
            "cartUpdated",
            handleCartUpdated
        );

        return () => {
            window.removeEventListener(
                "cartUpdated",
                handleCartUpdated
            );
        };

    }, [user]);

    const handleLogout = () => {
        logout();

        window.location.href = "/";
    };

    return (
        <header className="navbar">

            <div className="navbar-container">

                <a
                    href="/"
                    className="logo"
                >
                    QuickCart
                </a>

                <nav
                    className={`nav-links ${
                        isMenuOpen ? "open" : ""
                    }`}
                >
                    <a href="/">
                        Home
                    </a>

                    <a href="/products">
                        Products
                    </a>

                    {user?.role === "seller" && (
                        <a href="/add-product">
                            Add Product
                        </a>
                    )}

                    <a href="/cart">
                        Cart
                    </a>

                    {user && (
                        <a href="/orders">
                            Orders
                        </a>
                    )}
                </nav>

                <div className="nav-actions">

                    <button
                        className="icon-button"
                        aria-label="Search"
                    >
                        <Search size={20} />
                    </button>

                    {user ? (
                        <button
                            className="account-button"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <User size={19} />

                            <span>
                                {user.name}
                            </span>

                            <LogOut size={16} />
                        </button>
                    ) : (
                        <a
                            href="/login"
                            className="icon-button"
                            aria-label="Login"
                        >
                            <User size={20} />
                        </a>
                    )}

                    <a
                        href="/cart"
                        className="cart-button"
                        aria-label="Cart"
                    >
                        <ShoppingCart size={20} />

                        {cartCount > 0 && (
                            <span>
                                {cartCount}
                            </span>
                        )}
                    </a>

                    <button
                        className="menu-button"
                        onClick={() =>
                            setIsMenuOpen(!isMenuOpen)
                        }
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>

                </div>

            </div>

        </header>
    );
};

export default Navbar;