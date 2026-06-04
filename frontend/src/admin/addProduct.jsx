import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios"; // Assuming you have an API utility for making requests

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api({
        method: "post",
        url: "/products/add", 
        data: form
      });
      console.log("Product added successfully:", response.data);
      navigate("/admin/products"); // Redirect to the products list after successful addition
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-[2rem] bg-white/95 p-8 shadow-2xl shadow-slate-300/40 ring-1 ring-slate-200 sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Admin panel</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Add New Product
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Create a new product listing with title, price, category, stock, image, and description.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { name: "title", label: "Product Name", type: "text" },
              { name: "category", label: "Category", type: "text" },
              { name: "price", label: "Price", type: "number" },
              { name: "stock", label: "Stock", type: "number" },
              { name: "image", label: "Image URL", type: "url", fullWidth: true }
            ].map((field) => (
              <label
                key={field.name}
                className={`${field.fullWidth ? "sm:col-span-2" : ""} block text-sm font-medium text-slate-700`}
              >
                <span className="mb-2 block">{field.label}</span>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.label}
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </label>
            ))}
          </div>

          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Write a short product description"
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </label>

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 sm:w-auto"
            >
              Add Product
            </button>
            <span className="text-sm text-slate-500">
              Product data will be saved after submit.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
