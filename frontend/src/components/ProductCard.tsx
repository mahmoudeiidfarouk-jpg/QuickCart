import { ShoppingCart, ArrowRight } from "lucide-react";
import type { Product } from "../types/product";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const productUrl = `/products/${product._id}`;

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

                    <a
                        href={productUrl}
                        className="product-cart-button"
                        aria-label={`View ${product.name}`}
                    >
                        <ShoppingCart size={18} />
                    </a>

                </div>

                <a
                    href={productUrl}
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