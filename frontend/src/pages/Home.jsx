import {useEffect,useState} from 'react';
import api from '../api/axios';
import {Link} from 'react-router';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const loadProducts = async () => {
      const response =await api({
        method: 'get',
        url: '/products', // Pass search and category as query parameters
        params: {search, category} // Pass search and category as query parameters  
      })
       setProducts(response.data.products);
       console.log("check",response.data.products);
    }

    useEffect(() => {
        loadProducts();
      //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, category]); // Reload products whenever search or category changes

    const addToCart = async (productId) => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in to add items to your cart.");
        return;
      }
      const res = await api({
        method: 'post',
        url: '/cart/add',
        data: { userId, productId }
      });
      const total = res.data.cart.items.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
      ); //calculate total price of items in cart by reducing the array of cart items and summing up the price of each item multiplied by its quantity
      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="p-6">
      {/* Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-900 px-4 py-2 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 border border-gray-300 px-4 py-2 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Tablets">Tablets</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-3 rounded shadow hover:shadow-lg transition"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain bg-white rounded"
              />
              <h2 className="mt-2 font-semibold text-lg">{product.title}</h2>
            </Link>

            {/* Price + Add to Cart (same line) */}
            <div className="mt-2 flex items-center justify-between">
              <p className="text-gray-700 font-semibold">Rs. {product.price} /-</p>

              <button
                onClick={() => addToCart(product._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

