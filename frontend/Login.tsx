
import React, { useState } from "react";
import type { FC } from "react";
import { TextField, Button, Typography, Alert, Box, Link } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "./request";

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg("Email or password cannot be empty");
      return;
    }

    try {
      const res = await api.post("/user/login", { email, password });

      // 假设后端用 code === 200 表示成功
      if (res.data.code === 200 && res.data?.data) {
        setErrorMsg("");   // 清空错误提示
        alert("Successful to log in！");
        localStorage.setItem("token", res.data.data); // Store token
        navigate("/welcome"); // Next page
      } else {
        setErrorMsg(res.data.msg || "fail to log in");
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.msg || "Server error");
    }
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
          sx={{ 
            mt: 2, 
            mb: 2,
            width: "60%",      
            mx: "auto",          
            display: "block",    
            py: 1.5, 
            }}
          >
            Login
          </Button>

          <Typography align="center">
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              sx={{ color: "success.main" }}
            >
              New user? Register here
            </Link>
          </Typography>
        </Box>
      
    </Box>
  );
};

export default Login;

