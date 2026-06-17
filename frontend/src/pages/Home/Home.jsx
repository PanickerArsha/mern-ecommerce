import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axios";
import { fetchProducts } from "../../store/features/product/productSlice.js";
import { Link, useSearchParams } from "react-router";
import {Box,Button,Card,CardActions,CardContent,CardMedia,Container,Typography} from "@mui/material";
import "./Home.css";

export default function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    dispatch(fetchProducts({ search, category }));
  }, [dispatch, search, category]);

  const addToCart = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please login first");
        return;
      }
      const res = await api({
        method: "post",
        url: "/cart/add",
        data: {
          userId,
          productId,
        },
      });
      const total = res.data.cart.items.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
      );
      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xl" className="home-page">
    {!category && (
      <>
        {/* HERO SECTION */}
        <Box className="hero-section">
          <Box className="hero-content">
            <Typography className="hero-badge">Best Quality Products </Typography>
            <Typography variant="h2" className="hero-title">
              Shop Smarter,
              <br />
              Live Better
            </Typography>
            <Typography className="hero-subtitle">
              Discover amazing products at unbeatable prices.
            </Typography>
            <Button variant="contained" className="hero-button">
              Shop Now →
            </Button>
          </Box>
          <Box className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
              alt="Shopping"
            />
          </Box>
        </Box>
        {/* FEATURES */}
        <Box className="features-section">
          <Box className="feature-card">🚚 Free Delivery</Box>
          <Box className="feature-card">🔒 Secure Payment</Box>
          <Box className="feature-card">🎧 24/7 Support</Box>
          <Box className="feature-card">🔄 Easy Returns</Box>
        </Box>
      </>
    )}
    {/* PRODUCT TITLE */}
    <Typography variant="h4" className="products-heading">
      {category ? `${category} Products` : "Popular Products"}
    </Typography>
    {/* PRODUCTS */}
      <Box className="home-grid">
        {products.map((product) => (
          <Card className="home-card" key={product._id}>
            <Link
              to={`/product/${product._id}`}
              className="home-card-link"
            >
              <div className="home-image-wrapper">
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.title}
                  className="home-card-media"
                />
              </div>
              <CardContent>
                <Typography
                  variant="h6"
                  className="home-card-title"
                >
                  {product.title}
                </Typography>
              </CardContent>
            </Link>
            <CardActions className="home-card-actions">
              <Typography
                variant="subtitle1"
                className="home-price"
              >
                Rs. {product.price} /-
              </Typography>
              <Button
                variant="contained"
                className="home-add-button"
                onClick={() => addToCart(product._id)}
              >
                Add To Cart
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
}