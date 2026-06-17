import { useParams } from "react-router";
import { useNavigate } from "react-router";
import './OrderSuccess.scss';

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-subtitle">
          Thank you for your purchase.
          Your order has been placed successfully.
        </p>
        <div className="order-id-card">
          <div className="order-icon">📋</div>
          <div>
            <span className="order-label">Order ID</span>
            <h3>{id}</h3>
          </div>
        </div>
        <div className="order-info">
          <div className="info-box">
            <div className="info-icon">📦</div>
            <div>
              <h4>Estimated Delivery</h4>
              <p>18 June - 20 June</p>
            </div>
          </div>
          <div className="info-box">
            <div className="info-icon">📍</div>
            <div>
              <h4>Shipping Status</h4>
              <p>Preparing for dispatch</p>
            </div>
          </div>
          <div className="info-box">
            <div className="info-icon">💳</div>
            <div>
              <h4>Payment Method</h4>
              <p>Cash On Delivery</p>
            </div>
          </div>
        </div>
        <div className="button-group">
          <button className="continue-btn" onClick={() => navigate("/home")}>
            Continue Shopping
          </button>
        </div>
        <div className="benefits">
          <div className="benefit">
            🔒<span>Secure Payment</span>
          </div>
          <div className="benefit">
            🚚<span>Free Delivery</span>
          </div>
          <div className="benefit">
            🎧<span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}