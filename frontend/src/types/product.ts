export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
    seller: string;
    createdAt?: string;
    updatedAt?: string;
}