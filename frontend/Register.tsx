import React, { useState } from "react";
import type { FC } from "react";
import { TextField, Button, Typography, Alert, Box, Link } from "@mui/material";

import api from "./request.ts";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const Register: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 8) {
    setErrorMsg("Password must be at least 8 characters long");
    return;
  }

    if (password !== confirmPassword) {
      setErrorMsg("The password you conform must be same");
      setConfirmPassword("");
      return;
    }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
    if (!hasUpperCase || !hasLowerCase) {
    setErrorMsg("Password must contain at least one uppercase and one lowercase letter");
    return;
  }

try {
  const res = await api.post("/user/register", {
    email,
    password,
    name: `${firstName} ${lastName}`,
    role: "USER",
  });

  if (res.data.code === 200) {
    alert("Successful to register");
    console.log("Result:", res.data);
    navigate("/login"); 
  } else {
    setErrorMsg(res.data.msg || "Fail to register");
  }
} catch (err: any) {
  setErrorMsg(err?.response?.data?.msg || "Server error");
}
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      
        <Typography variant="h5" align="center" gutterBottom>
          User registration
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister}>
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
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            margin="normal"
            required
          />

          <Button type="submit" variant="contained" 
          sx={{ 
            mt: 2, 
            mb: 2,
            width: "60%",        
            mx: "auto",          
            display: "block",    
            py: 1.5, 
            
            }}>
            Register
          </Button>
          <Typography align="center">
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{ color: "success.main" }}
            >
              Already have an account? Login here
            </Link>
          </Typography>
        </Box>
      </Box>
   
  );
};

export default Register;
