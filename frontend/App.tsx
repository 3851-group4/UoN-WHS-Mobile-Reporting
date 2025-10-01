
import type { FC } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Typography, Box, Paper } from "@mui/material";
import Login from "./Login";
import Register from "./Register";

const App: FC = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 6 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Welcome to UON Safety Platform
                </Typography>

                <Box mt={4}>
                    <Routes>
                        <Route index element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </Box>
            </Paper>
        </Container>
    );
};

export default App;