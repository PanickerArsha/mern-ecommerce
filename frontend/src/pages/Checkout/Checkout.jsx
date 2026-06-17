import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router';
import './Checkout.scss';

export default function CheckoutAddress() {
    const userId = localStorage.getItem('userId');
    const [addresses, setAddresses] = useState([]);
    const [cart, setCart] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        addressLine: '',
        phone: '',
        city: '',
        state: '',
        pinCode: '',
    });
    const [saving, setSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const navigate = useNavigate();

    const loadCart = useCallback(async () => {
      if (!userId) return;
      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);
    }, [userId]);

    const loadAddresses = useCallback(async () => {
      if (!userId) return;
      const res = await api.get(`/address/${userId}`);
      const fetched = res.data?.addresses || [];
      setAddresses(fetched);
      setSelectedAddress((current) => {
        if (current && fetched.find((addr) => addr._id === current._id)) {
          return current;
        }
        return fetched[0] || null;
      });
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        (async () => {
            await Promise.all([loadCart(), loadAddresses()]);
        })();
    }, [navigate, userId, loadCart, loadAddresses]);

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
            navigate(`/order-success/${res.data.order._id}`);
        } catch (error) {
            alert('Error placing order: ' + error.message);
        }
    };

      const handlePayment = async () => {
        if (!selectedAddress) {
          alert('Please select an address');
          return;
        }

        try {
          setProcessingPayment(true);
          const { data } = await api.post('/orders/create-razorpay-order', {
            userId,
          });

          if (!window.Razorpay) {
            alert('Razorpay checkout is not available right now. Please refresh and try again.');
            return;
          }

          const options = {
            key: data.key,
            amount: data.amount,
            currency: data.currency,
            order_id: data.orderId,
            name: 'Shopora',
            handler: async function (response) {
              const verifyResponse = await api.post('/orders/verify-payment', {
                ...response,
                userId,
                address: selectedAddress,
              });

              navigate(`/order-success/${verifyResponse.data.order._id}`);
            },
            theme: {
              color: '#d97706',
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } catch (error) {
          alert('Error starting payment: ' + error.message);
        } finally {
          setProcessingPayment(false);
        }
      };

    const handleNewAddressChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const saveNewAddress = async () => {
        const { fullName, addressLine, phone, city, state, pinCode } = newAddress;
        if (!fullName || !addressLine || !phone || !city || !state || !pinCode) {
            alert('Please fill in all address fields.');
            return;
        }

        try {
            setSaving(true);
            const response = await api({
                method: 'post',
                url: '/address/add',
                data: { ...newAddress, userId },
            });
            setNewAddress({
                fullName: '',
                addressLine: '',
                phone: '',
                city: '',
                state: '',
                pinCode: '',
            });
            await loadAddresses();
            setSelectedAddress(response.data.address || selectedAddress);
            alert('Address saved successfully.');
        } catch (error) {
            alert('Error saving address: ' + error.message);
        } finally {
            setSaving(false);
            setShowAddForm(false)
        }
    };

    return (
    <div className="checkout-page">

  <div className="checkout-header">
    <h1>Select Delivery Address</h1>
    <p>Choose a saved address or add a new one</p>
  </div>

  <div className="checkout-layout">

    {/* LEFT SIDE */}

    <div className="address-section">

      {addresses.map((addr) => (
        <div
          key={addr._id}
          className={`address-card ${
            selectedAddress?._id === addr._id
              ? "selected"
              : ""
          }`}
        >
          <div className="address-left">

            <input
              type="radio"
              checked={
                selectedAddress?._id === addr._id
              }
              onChange={() =>
                setSelectedAddress(addr)
              }
            />

            <div>
              <h3>{addr.fullName}</h3>

              <p>
                {addr.addressLine}
              </p>

              <p>
                {addr.city}, {addr.state}
                {" - "}
                {addr.pinCode}
              </p>

              <p>
                📞 {addr.phone}
              </p>
            </div>
          </div>

          <button
            className="use-address-btn"
            onClick={() =>
              setSelectedAddress(addr)
            }
          >
            Use This Address
          </button>
        </div>
      ))}

      {/* ADD NEW ADDRESS */}

      <button
        className="add-address-btn"
        onClick={() =>
          setShowAddForm(!showAddForm)
        }
      >
        ➕ Add New Address
      </button>

      {showAddForm && (
        <div className="new-address-card">

          <h3>Add New Address</h3>

          <div className="form-grid">

            <input
              name="fullName"
              placeholder="Full Name"
              value={newAddress.fullName}
              onChange={handleNewAddressChange}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={newAddress.phone}
              onChange={handleNewAddressChange}
            />

            <input
              className="full-width"
              name="addressLine"
              placeholder="Address Line"
              value={newAddress.addressLine}
              onChange={handleNewAddressChange}
            />

            <input
              name="city"
              placeholder="City"
              value={newAddress.city}
              onChange={handleNewAddressChange}
            />

            <input
              name="state"
              placeholder="State"
              value={newAddress.state}
              onChange={handleNewAddressChange}
            />

            <input
              className="full-width"
              name="pinCode"
              placeholder="Pin Code"
              value={newAddress.pinCode}
              onChange={handleNewAddressChange}
            />

          </div>

          <button
            onClick={saveNewAddress}
            className="save-address-btn"
          >
            {saving
              ? "Saving..."
              : "Save Address"}
          </button>

        </div>
      )}

    </div>

    {/* RIGHT SIDE */}

    <div className="summary-card">

      <h2>Order Summary</h2>

      <div className="summary-row">
        <span>Products</span>
        <span>₹{total}</span>
      </div>

      <div className="summary-row">
        <span>Delivery</span>
        <span className="free">
          FREE
        </span>
      </div>

      <hr />

      <div className="summary-total">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button
        className="place-order-btn"
        onClick={placeOrder}
      >
        Place Order (COD)
      </button>

      <button
        className="pay-now-btn"
        onClick={handlePayment}
        disabled={processingPayment}
      >
        {processingPayment ? 'Processing...' : 'Pay with Razorpay'}
      </button>

    </div>

  </div>
</div>
  );
}
