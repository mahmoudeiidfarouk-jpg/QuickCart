import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    const path = window.location.pathname;

    let page;

    if (path === "/products") {
        page = <Products />;

    } else if (path.startsWith("/products/")) {
        page = <ProductDetails />;

    } else if (path === "/login") {
        page = <Login />;

    } else if (path === "/register") {
        page = <Register />;

    } else if (path === "/add-product") {
        page = (
            <ProtectedRoute>
                <AddProduct />
            </ProtectedRoute>
        );

    } else if (path === "/cart") {
        page = (
            <ProtectedRoute>
                <Cart />
            </ProtectedRoute>
        );

    } else if (path === "/orders") {
        page = (
            <ProtectedRoute>
                <Orders />
            </ProtectedRoute>
        );

    } else if (path.startsWith("/orders/")) {
        page = (
            <ProtectedRoute>
                <OrderDetails />
            </ProtectedRoute>
        );

    } else {
        page = <Home />;
    }

    return (
        <MainLayout>
            {page}
        </MainLayout>
    );
}

export default App;