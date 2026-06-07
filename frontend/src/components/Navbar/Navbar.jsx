import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/features/product/categoriesSlice.js";
import api from "../../api/axios";
import { Badge, Box, Button, IconButton, TextField, Menu, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import "./Navbar.scss";

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
      const total = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    loadCart();
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [userId]);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
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
      <Link to="/home" className="navbar-brand">
        Shopora
      </Link>
      <Box className="navbar-search">
        <TextField
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search products"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <IconButton edge="start" size="small" className="navbar-search-icon">
                <ManageSearchOutlinedIcon/>
              </IconButton>
            ),
          }}
        />
      </Box>
      <Box className="navbar-category">
        <FormControl variant="outlined" className="home-category">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={categoryValue}
            onChange={handleCategoryChange}
            label="Select Category"
            className="selectCategory"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box className="navbar-actions">
        <Button
          component={Link}
          to="/cart"
          className="navbar-link"
          startIcon={
            <Badge badgeContent={cartCount} color="error" className="navbar-badge">
              <ShoppingCartCheckoutIcon/>
            </Badge>
          }
        >
        </Button>

        {!userId ? (
          <>
            <Button component={Link} to="/login" className="navbar-link">
              Login
            </Button>
            <Button component={Link} to="/signup" className="navbar-link">
              Signup
            </Button>
          </>
        ) : (
            <>
       <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Hello {localStorage.getItem("userName")} !
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <div>
        <MenuItem onClick={() => setAnchorEl(null)}>
          Profile
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          My Account
        </MenuItem>
        <MenuItem onClick={logout} >
          Logout
        </MenuItem>
        </div>
      </Menu>
          </>
        )}
      </Box>
    </Box>
  );
}
