import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import "./Cart.scss";

export default function Cart() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!userId) return;

    const res = await api.get(`/cart/${userId}`);
    setCart(res.data);
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);
    };
    fetchCart();
  }, [userId]);

  const removeItem = async (productId) => {
    await api.post(`/cart/remove`, { userId, productId });
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQty = async (productId, quantity) => {
    if (quantity === 0) {
      await removeItem(productId);
      return;
    }

    await api.post(`/cart/update`, {
      userId,
      productId,
      quantity,
    });

    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!cart) {
    return (
      <Container className="cart-page">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0,
  );

  return (
    <Container maxWidth="xl" className="cart-page">
      <div className="cart-header">
        <Typography variant="h5" className="cart-title">
          <ShoppingCartCheckoutIcon style={{ width: "3%", height: "4%" }} />
          Your Cart
        </Typography>

        <Typography className="cart-subtitle">
          Review your items and proceed to checkout
        </Typography>
      </div>

      {cart.items.length === 0 ? (
        <div className="empty-cart-card">
          <Typography variant="h4" className="empty-title">
            Your cart is empty!
          </Typography>

          <Typography className="empty-description">
            Looks like you haven't added anything to your cart yet.
          </Typography>

          <Button
            className="continue-shopping-btn"
            onClick={() => navigate("/home")}
          >
            ← Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* LEFT SIDE */}

          <div className="cart-left">
            {cart.items.map((item) => (
              <Card key={item.productId._id} className="cart-card">
                <CardContent className="cart-card-content">
                  <div className="product-section">
                    <img
                      src={item.productId.image}
                      alt={item.productId.title}
                      className="product-image"
                    />

                    <div className="product-details">
                      <Typography variant="h5" className="product-title">
                        {item.productId.title}
                      </Typography>

                      <Typography className="stock-text">✓ In Stock</Typography>
                    </div>
                  </div>

                  <div className="price-section">Rs.{item.productId.price}</div>

                  <Box className="quantity-controls">
                    <IconButton
                      className="qty-btn"
                      onClick={() =>
                        updateQty(item.productId._id, item.quantity - 1)
                      }
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography>{item.quantity}</Typography>

                    <IconButton
                      className="qty-btn"
                      onClick={() =>
                        updateQty(item.productId._id, item.quantity + 1)
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <Typography className="item-total">
                    Rs.
                    {(item.productId.price * item.quantity).toFixed(2)}
                  </Typography>
                  <IconButton
                    color="error"
                    className="remove-btn"
                    onClick={() => removeItem(item.productId._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}

            <div className="free-delivery">
              🚚 Yay! You qualify for FREE delivery
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="summary-card">
            <Typography variant="h5" className="summary-title">
              Order Summary
            </Typography>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>

            <div className="summary-row">
              <span>Discount</span>
              <span>Rs.0</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>

            <Button
              className="checkout-btn"
              fullWidth
              onClick={() => navigate("/checkout")}
            >
              Proceed To Checkout
            </Button>

            <div className="benefits">
              <div>
                🔒
                <p>Secure Payment</p>
              </div>

              <div>
                🔄
                <p>Easy Returns</p>
              </div>

              <div>
                🎧
                <p>Support</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
