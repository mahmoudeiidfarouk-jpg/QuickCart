import { useState } from "react";
import {
    ArrowLeft,
    ImagePlus,
    Upload,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const AddProduct = () => {
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!user || user.role !== "seller") {
        window.location.href = "/";
        return null;
    }

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setImage(file);
        setError("");
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append(
            "upload_preset",
            "quickcart_products"
        );

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/r3pdqbly/image/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error("Image upload failed.");
        }

        const data = await response.json();

        return data.secure_url as string;
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!image) {
            setError("Please choose a product image.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            setUploading(true);

            const imageUrl = await uploadImage(image);

            setUploading(false);

            await api.post("/products", {
                name,
                description,
                price: Number(price),
                category,
                stock: Number(stock),
                image: imageUrl,
            });

            setSuccess("Product added successfully.");

            setName("");
            setDescription("");
            setPrice("");
            setCategory("");
            setStock("");
            setImage(null);

            const fileInput = document.getElementById(
                "product-image"
            ) as HTMLInputElement | null;

            if (fileInput) {
                fileInput.value = "";
            }

        } catch (error: any) {
            console.error(error);

            setUploading(false);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to add product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-page">

            <a
                href="/products"
                className="back-button"
            >
                <ArrowLeft size={17} />
                Back to Products
            </a>

            <div className="add-product-header">
                <span>Seller Dashboard</span>

                <h1>Add Product</h1>

                <p>
                    Add a new product to your store.
                </p>
            </div>

            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="product-success">
                    {success}
                </div>
            )}

            <form
                className="add-product-form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">

                    <label htmlFor="product-name">
                        Product Name
                    </label>

                    <input
                        id="product-name"
                        type="text"
                        placeholder="Enter product name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                        minLength={3}
                        maxLength={100}
                    />

                </div>

                <div className="form-group">

                    <label htmlFor="product-description">
                        Description
                    </label>

                    <textarea
                        id="product-description"
                        placeholder="Enter product description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        required
                        minLength={5}
                        maxLength={1000}
                    />

                </div>

                <div className="add-product-row">

                    <div className="form-group">

                        <label htmlFor="product-price">
                            Price
                        </label>

                        <input
                            id="product-price"
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={(event) =>
                                setPrice(event.target.value)
                            }
                            min="0"
                            step="0.01"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="product-stock">
                            Stock
                        </label>

                        <input
                            id="product-stock"
                            type="number"
                            placeholder="0"
                            value={stock}
                            onChange={(event) =>
                                setStock(event.target.value)
                            }
                            min="0"
                            step="1"
                            required
                        />

                    </div>

                </div>

                <div className="form-group">

                    <label htmlFor="product-category">
                        Category
                    </label>

                    <input
                        id="product-category"
                        type="text"
                        placeholder="e.g. Electronics"
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                        required
                    />

                </div>

                <div className="form-group">

                    <label htmlFor="product-image">
                        Product Image
                    </label>

                    <label
                        htmlFor="product-image"
                        className="image-upload-box"
                    >
                        {image ? (
                            <>
                                <ImagePlus size={28} />

                                <strong>
                                    {image.name}
                                </strong>

                                <span>
                                    Click to change image
                                </span>
                            </>
                        ) : (
                            <>
                                <Upload size={28} />

                                <strong>
                                    Choose Product Image
                                </strong>

                                <span>
                                    PNG, JPG or WEBP
                                </span>
                            </>
                        )}
                    </label>

                    <input
                        id="product-image"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageChange}
                        hidden
                    />

                </div>

                <button
                    type="submit"
                    className="auth-submit-button"
                    disabled={loading}
                >
                    {uploading
                        ? "Uploading Image..."
                        : loading
                            ? "Adding Product..."
                            : "Add Product"
                    }
                </button>

            </form>

        </div>
    );
};

export default AddProduct;