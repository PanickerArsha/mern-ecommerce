import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axios";
import { fetchProducts } from "../../store/features/product/productSlice.js";
import { Link, useSearchParams } from "react-router";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import "./Home.css";

export default function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    dispatch(fetchProducts({ search, category }));
  }, [dispatch, search, category]); // Reload products whenever search or category changes

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
    <Container className="home-page" maxWidth="xl">
      <Box className="home-grid">
        {products.map((product) => (
          <Card className="home-card" key={product._id}>
            <Link to={`/product/${product._id}`} className="home-card-link">
              <CardMedia
                component="img"
                image={product.image}
                alt={product.title}
                className="home-card-media"
              />
              <CardContent>
                <Typography variant="h6" className="home-card-title">
                  {product.title}
                </Typography>
              </CardContent>
            </Link>
            <CardActions className="home-card-actions">
              <Typography variant="subtitle1" className="home-price">
                Rs. {product.price} /-
              </Typography>
              <Button
                variant="contained"
                size="small"
                className="home-add-button"
                onClick={() => addToCart(product._id)}
              >
                Add
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

