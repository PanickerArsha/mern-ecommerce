import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { Alert, Box, Button, Collapse, Container, TextField, Typography } from "@mui/material";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api({
        method: "post",
        url: "/auth/login",
        data: form,
      });
          

      setMessageType("success");
      setMessage(response.data.message || "Login successful");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user?.id || response.data.user?._id);
      localStorage.setItem("userName", response.data.user?.name || "User");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "An error occurred during login");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api({
        method: "POST",
        url: "/auth/google",
        data: {
          token: credentialResponse.credential,
        },
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId",response.data.user?.id || response.data.user?._id);
      localStorage.setItem("userName", response.data.user?.name || "User");
      navigate("/home");
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <Box className="login-page">
      <Container maxWidth="xs">
        <div className="login-card">
          <div className="login-content">
            <div className="login-title">
              <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
                Shopora
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Login to Your Account
              </Typography>
            </div>

            <Collapse in={Boolean(message)}>
              <Alert severity={messageType} onClose={() => setMessage("")}>{message}</Alert>
            </Collapse>

            <form onSubmit={handleSubmit} noValidate className="login-form">
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                id="password"
                name="password"
                type="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                fullWidth
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                className="auth-button"
              >
                Login
              </Button>
            </form>

            <div className="login-signup">
              <Typography variant="body2" color="text.secondary" sx={{ display: "inline", mr: 1 }}>
                Don't have an account?
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate("/signup")}
                sx={{ textTransform: "none", fontWeight: 600, color: "#64713f" }}
              >
                Sign Up for free
              </Button>
            </div>

            <div className="login-divider">
              <span />
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
              <span />
            </div>

            <div className="login-social">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => {
                setMessageType("error");
                setMessage("Google Login Failed");
              }} />
            </div>
          </div>
        </div>
      </Container>
    </Box>
  );
}
