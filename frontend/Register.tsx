import React, { useState } from "react";
import type { FC } from "react";
import { TextField, Button, Container, Paper, Typography, Alert, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "./request.ts";

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

    if (password !== confirmPassword) {
      setErrorMsg("The password you conform must be same");
      setConfirmPassword("");
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
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, width: "100%", maxWidth: 400 }}>
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

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
