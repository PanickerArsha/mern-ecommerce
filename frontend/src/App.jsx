import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Signup/SignUp";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/admin/addProduct";
import ProductList from "./pages/admin/productList";
import EditProduct from "./pages/admin/editProduct";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./pages/Cart/Cart";
import CheckoutAddress from "./pages/CheckoutAddress";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  { path: "/login",element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "home", element: <Home /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "admin/products", element: <ProductList /> },
      { path: "admin/products/add", element: <AddProduct /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout-address", element: <CheckoutAddress /> },
      { path: "checkout", element: <Checkout /> },
      { path: "order-success/:id", element: <OrderSuccess /> },
      { path: "admin/products/update/:id", element: <EditProduct /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
