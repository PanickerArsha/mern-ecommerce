import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/features/product/categoriesSlice.js";
import api from "../../api/axios.js";
import logoImage from "../../assets/logoImage.svg";
import {
  Badge,
  Box,
  Button,
  TextField,
  Menu,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import "./Header.scss";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cartCount, setCartCount] = useState(0);
  const categories = useSelector((state) => state.categories.list);
  const categoriesStatus = useSelector((state) => state.categories.status);
  const userId = localStorage.getItem("userId");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const searchValue = searchParams.get("search") || "";
  const categoryValue = searchParams.get("category") || "";

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) return setCartCount(0);

      const res = await api.get(`/cart/${userId}`);
      const total = res.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      setCartCount(total);
    };

    loadCart();
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [userId]);

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/login");
  };

  const handleSearchChange = (event) => {
    const nextSearch = event.target.value;
    const params = new URLSearchParams();

    if (nextSearch) params.set("search", nextSearch);
    if (categoryValue) params.set("category", categoryValue);

    const queryString = params.toString();
    navigate(`/home${queryString ? `?${queryString}` : ""}`, { replace: true });
  };

  const handleCategoryChange = (event) => {
    const nextCategory = event.target.value;
    const params = new URLSearchParams();

    if (searchValue) params.set("search", searchValue);
    if (nextCategory) params.set("category", nextCategory);

    const queryString = params.toString();
    navigate(`/home${queryString ? `?${queryString}` : ""}`, { replace: true });
  };

  return (
    <Box component="nav" className="navbar-root">
      {/* Logo */}
      <Link to="/home" className="navbar-brand">
        <img src={logoImage} alt="Shopora" className="navbar-logo" />
      </Link>

      {/* Search */}
      <Box className="navbar-search">
        <TextField
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search products..."
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <ManageSearchOutlinedIcon className="search-icon" />
            ),
          }}
        />
      </Box>

      {/* Category */}
      <Box className="navbar-category">
        <FormControl fullWidth>
          <Select
            value={categoryValue}
            onChange={handleCategoryChange}
            displayEmpty
            className="category-select"
          >
            <MenuItem value="">Category</MenuItem>

            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Right Side */}
      <Box className="navbar-actions">
        <Button component={Link} to="/cart" className="cart-button">
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartCheckoutIcon />
          </Badge>
        </Button>

        {!userId ? (
          <>
            <Button className="login-btn" component={Link} to="/login">
              Login
            </Button>

            <Button className="signup-btn" component={Link} to="/signup">
              Signup
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              className="user-chip"
            >
              👤 {localStorage.getItem("userName")}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>

              <MenuItem onClick={() => setAnchorEl(null)}>My Account</MenuItem>

              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
}
