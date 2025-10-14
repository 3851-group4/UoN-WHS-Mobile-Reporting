import type { FC } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Typography, Box, Paper } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import Welcome from "./Welcome";

const App: FC = () => {
    return (
        <Routes>
            {/* Auth routes with container */}
            <Route path="/login" element={
                <Container maxWidth="md" sx={{ mt: 6 }}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Welcome to UON Safety Platform
                        </Typography>
                        <Box mt={4}>
                            <Login />
                        </Box>
                    </Paper>
                </Container>
            } />
            
            <Route path="/register" element={
                <Container maxWidth="md" sx={{ mt: 6 }}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Welcome to UON Safety Platform
                        </Typography>
                        <Box mt={4}>
                            <Register />
                        </Box>
                    </Paper>
                </Container>
            } />

            {/* Default route */}
            <Route index element={
                <Container maxWidth="md" sx={{ mt: 6 }}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Welcome to UON Safety Platform
                        </Typography>
                        <Box mt={4}>
                            <Login />
                        </Box>
                    </Paper>
                </Container>
            } />

            {/* Welcome page route - no container wrapper needed as Welcome has its own layout */}
            <Route path="/welcome" element={<Welcome />} />
        </Routes>
    );
};

export default App;
