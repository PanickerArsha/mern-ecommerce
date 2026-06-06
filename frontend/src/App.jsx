import { createBrowserRouter, Outlet,RouterProvider } from "react-router";
import { Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./admin/addProduct";
import ProductList from "./admin/productList";
import EditProduct from "./admin/editProduct";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
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
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },
      { path: "/home", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/admin/products", element: <ProductList /> },
      { path: "/admin/products/add", element: <AddProduct /> },
      { path : "/cart", element: <Cart />},
      { path : "/checkout-address", element: <CheckoutAddress />},
      { path : "/checkout", element: <Checkout />},
      { path : "/order-success/:id", element: <OrderSuccess />},
      { path: "/admin/products/update/:id", element: <EditProduct /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
