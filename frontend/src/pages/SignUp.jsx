import { useState } from "react"
import api from "../api/axios"

export default function SignUp() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });
    const[message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();   
        try {
            const response = await api({
            method: "post",
            url: "/auth/signup",
            data: form
        });
            setMessage(response.data.message); // Assuming the backend sends a message in the response
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred during signup');
        }
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>   
          {message && <p className="text-red-500 text-center">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>  
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"   
              />
            </div>
            <div> 
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"    
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }
