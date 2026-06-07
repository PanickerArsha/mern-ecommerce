import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router";

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
    loadCart();
  }, []);

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
    0
  );

  return (
    <Container maxWidth="lg" className="cart-page">
      <Typography variant="h4" className="cart-title">
        Your Cart
      </Typography>

      {cart.items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <div className="cart-list">
            {cart.items.map((item) => (
              <Card
                key={item.productId._id}
                className="cart-card"
                elevation={2}
              >
                <CardContent className="cart-card-content">
                  <div className="product-info">
                    <img
                      src={item.productId.image}
                      alt={item.productId.title}
                      className="product-image"
                    />

                    <div>
                      <Typography variant="h6">
                        {item.productId.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        className="product-price"
                      >
                        Rs.{item.productId.price.toFixed(2)}
                      </Typography>
                    </div>
                  </div>

                  <Box className="quantity-controls">
                    <IconButton
                      onClick={() =>
                        updateQty(
                          item.productId._id,
                          item.quantity - 1
                        )
                      }
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography>{item.quantity}</Typography>

                    <IconButton
                      onClick={() =>
                        updateQty(
                          item.productId._id,
                          item.quantity + 1
                        )
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="h6"
                    className="item-total"
                  >
                    Rs.
                    {(
                      item.productId.price * item.quantity
                    ).toFixed(2)}
                  </Typography>

                  <IconButton
                    color="error"
                    onClick={() =>
                      removeItem(item.productId._id)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="cart-summary">
            <Typography variant="h5">
              Total: Rs.{total.toFixed(2)}
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() =>
                navigate("/checkout-address")
              }
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}