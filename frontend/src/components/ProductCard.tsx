import { ShoppingCart, ArrowRight } from "lucide-react";
import type { Product } from "../types/product";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <article className="product-card">

            <div className="product-image">
                <img
                    src={product.image}
                    alt={product.name}
                />
            </div>

            <div className="product-info">

                <span className="product-category">
                    {product.category}
                </span>

                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <div className="product-bottom">

                    <strong>
                        {product.price} EGP
                    </strong>

                    <button
                        className="product-cart-button"
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <ShoppingCart size={18} />
                    </button>

                </div>

                <a
                    href={`/products/${product._id}`}
                    className="product-details"
                >
                    View Details
                    <ArrowRight size={16} />
                </a>

            </div>

        </article>
    );
};

export default ProductCard;