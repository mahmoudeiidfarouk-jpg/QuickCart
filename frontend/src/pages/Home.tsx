import {
    ArrowRight,
    ShoppingBag,
    ShieldCheck,
    Truck,
} from "lucide-react";

import FeaturedProducts from "../components/FeaturedProducts";

const Home = () => {
    return (
        <div className="home-page">

            <section className="hero">
                <div className="hero-content">

                    <div className="hero-text">

                        <span className="hero-label">
                            Simple shopping. Better experience.
                        </span>

                        <h1>
                            Everything you need,
                            <span> in one place.</span>
                        </h1>

                        <p>
                            Discover quality products with a simple,
                            smooth and reliable shopping experience.
                        </p>

                        <div className="hero-actions">

                            <a
                                href="/products"
                                className="primary-button"
                            >
                                Shop Products
                                <ArrowRight size={18} />
                            </a>

                            <a
                                href="/products"
                                className="secondary-button"
                            >
                                Explore Products
                            </a>

                        </div>

                    </div>

                    <div className="hero-visual">

                        <div className="hero-card">

                            <ShoppingBag size={42} />

                            <div>
                                <strong>QuickCart</strong>
                                <span>Shopping made simple</span>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            <section className="features">

                <div className="feature-card">
                    <Truck size={24} />

                    <div>
                        <h3>Fast Delivery</h3>
                        <p>
                            Get your orders delivered quickly.
                        </p>
                    </div>
                </div>

                <div className="feature-card">
                    <ShieldCheck size={24} />

                    <div>
                        <h3>Secure Shopping</h3>
                        <p>
                            Your shopping experience stays protected.
                        </p>
                    </div>
                </div>

                <div className="feature-card">
                    <ShoppingBag size={24} />

                    <div>
                        <h3>Quality Products</h3>
                        <p>
                            Explore products selected for you.
                        </p>
                    </div>
                </div>

            </section>

            <FeaturedProducts />

        </div>
    );
};

export default Home;