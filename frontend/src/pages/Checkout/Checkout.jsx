import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router';

export default function CheckoutAddress() {
    const userId = localStorage.getItem('userId');
    const [addresses, setAddresses] = useState([]);
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState(null);

    const loadCart = async () => {
        if (!userId) return;
        const res = await api.get(`/cart/${userId}`);
        setCart(res.data);
    };

    const loadAddresses = async () => {
        if (!userId) return;
        const res = await api.get(`/address/${userId}`);
        setAddresses(res.data?.addresses || []);
        setSelectedAddress(res.data?.addresses[0] || null);
    };

    useEffect(() => {
      if (!userId) {
        navigate('/login');
        return;
      }
        loadCart();
        loadAddresses();
        //eslint-disable-next-line
    }, []);

    if (!cart) {
        return <div>Your cart is loading.</div>;
    }
    const total = cart.items?.reduce(
        (sum, item) => sum + ((item.productId?.price || 0) * (item.quantity || 0)),
        0
    );

    const placeOrder = async () => {
        if (!selectedAddress) {
            alert('Please select an address');
            return;
        }
        try {
            const res = await api({
                method: 'POST',
                url: '/orders/place-order',
                data: {
                    userId,
                    address: selectedAddress,
                   
                },
            });
            alert(res.data.message);
            console.log('Order Response:', res.data);
            navigate(`/order-success/${res.data.order._id}`);
        }
        catch (error) {
            alert('Error placing order', error.message);
        }
    };

            
               

    return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Address Selection */}
      <h2 className="font-semibold mb-2">Select Delivery Address</h2>

      <div className="space-y-3">
        {addresses?.map((addr) => (
          <label
            key={addr._id}
            className="block border p-3 rounded cursor-pointer"
          >
            <input
              type="radio"
              name="address"
              checked={selectedAddress?._id === addr._id}
              onChange={() => setSelectedAddress(addr)}
              className="mr-2"
            />
            <strong>{addr.fullName}</strong>
            <p className="text-sm">
              {addr.addressLine}, {addr.city}, {addr.state} - {addr.pinCode}
            </p>
            <p className="text-sm">📞 {addr.phone}</p>
          </label>
        ))}
      </div>

      {/* Order Summary */}
      <h2 className="font-semibold mt-6 mb-2">Order Summary</h2>
      <p className="text-lg font-bold">Total Amount: ₹{total}</p>

      <button
        onClick={placeOrder}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Place Order (COD)
      </button>
    </div>
  
    )
}
