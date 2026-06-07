import {useState,useEffect} from "react";
import api from "../../api/axios";
import { Link } from "react-router";

export default function ProductList() {
    const [products, setProducts] = useState([]);

    const loadProducts = async () => {
            const response = await api({
                method: "get",
                url: "/products", 
            });
            setProducts(response.data.products || []);
            
    };

    const deletedProduct = async (id) => {
        try {
            await api({
                method: "delete",
                url: `/products/delete/${id}`,
            });
            loadProducts(); // Refresh the product list after deletion
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-3xl rounded-[2rem] bg-white/95 p-8 shadow-2xl shadow-slate-300/40 ring-1 ring-slate-200 sm:p-10">
                <div className="mb-8 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Admin panel</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Product List</h2>
                    <Link to="/admin/products/add" className="mt-4 inline-block rounded-md bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700">
                        Add New Product
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">${product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link to={`/admin/products/update/${product._id}`} className="text-sky-600 hover:text-sky-900 mr-4">Edit</Link>
                                        <button onClick={() => deletedProduct(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>    
                    </table>
                </div>
            </div>
        </div>
    );
}