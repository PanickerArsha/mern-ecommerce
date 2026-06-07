import {useState,useEffect} from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router";

export default function EditProduct() {
    const { id } = useParams(); // Get the product ID from the URL parameters
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: ""
    });
    const navigate = useNavigate();

    const allowedFields = ["title", "description", "price", "category", "image", "stock"];

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const loadProduct = async () => {
            const response = await api({
                method: "get",
                url: `/products`, // Fetch the product details using the ID
            });
            const product= response.data.find(p => p._id === parseInt(id)); // Find the product with the matching ID
            setForm(product); // Set the form state with the product details
       
    };

    useEffect(() => {
        loadProduct();
    }, []); // Re-run the effect when the product ID changes

    const handleSubmit = async (e) => {
        e.preventDefault(); 
            const response = await api({
                method: "put",
                url: `/products/update/${id}`, // Send the update request to the server with the product ID
                data: form
            });
            console.log("Product updated successfully:", response.data);
            navigate("/admin/products"); // Redirect to the products list after successful update
        }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-3xl rounded-[2rem] bg-white/95 p-8 shadow-2xl shadow-slate-300/40 ring-1 ring-slate-200 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                    {allowedFields.map((key) => (
                        allowedFields.includes(key) && (
                            <input
                                key={key}
                                name={key}
                                value={form[key] || ""}
                                onChange={handleChange}
                                placeholder={key}
                                className="block w-full rounded-md border-0 px-3 py-2 text-sm shadow-sm ring-1 ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-600 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-sky-600 focus-visible:ring-offset-sky-300 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 disabled:ring-slate-200 sm:leading-6"
                                
                            />
                        )
                    ))}  
                </div>
                <button type="submit" className="rounded-md bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700">
                    Update Product
                </button>
            </form>
        </div>
                    
        </div>
    );
}
