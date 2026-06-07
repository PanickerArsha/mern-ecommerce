import { useState } from "react"
import api from "../../api/axios";
import { Alert, Box, Button, Collapse, Container, TextField, Typography } from "@mui/material"
import { useNavigate } from "react-router";
import "./SignUp.css"

export default function SignUp() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });
    const[message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();   
        try {
            const response = await api({
            method: "post",
            url: "/auth/signup",
            data: form
        });
            setMessage(response.data.message); // Assuming the backend sends a message in the response
            // Navigate to login page after successful signup
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred during signup');
        }
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    return (
      <Box className="signup-page">
         <Container maxWidth="xs">
        <div className="signup-card">
          <div className="signup-title">
              <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
                Shopora
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create your account to start shopping!
              </Typography>
            </div>
          <Collapse in={Boolean(message)}>
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setMessage('')}>
              {message}
            </Alert>
          </Collapse>
          <form onSubmit={handleSubmit} className="signup-form">
            <TextField
              id="name"
              name="name"
              label="Name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <Button type="submit" variant="contained" fullWidth size="large" className="auth-button">
              Sign Up
            </Button>
          </form>
          <div className="login-signup">
              <Typography variant="body2" color="text.secondary" sx={{ display: "inline", mr: 1 }}>
                Already have an account?
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none", fontWeight: 600, color: "#64713f" }}
              >
                Go back to Login
              </Button>
            </div>
        </div>
        </Container>
      </Box>
    );
  }
