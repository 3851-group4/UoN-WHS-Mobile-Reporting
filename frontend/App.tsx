import type { FC } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Container, Typography, Box, Paper } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import Welcome from "./Welcome";
import Admin from "./Admin";

const App: FC = () => {
    const location = useLocation();
    
    // Control page
    const isWelcomePage = location.pathname.startsWith("/welcome");

    return (
        <Box
            sx={{
        minHeight: "100vh",
        position: "relative",
        paddingTop: isWelcomePage ? "0px" : "40px",
        paddingBottom: isWelcomePage ? "0px" : "40px",
        "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url('/image/campus.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            filter: "blur(2.5px)", 
            zIndex: -1,
        },
        "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: -1,
        }
            }}
        >
            {isWelcomePage ? (
                // Welcome page and its subs
                <Routes>
                    <Route path="/welcome/*" element={<Welcome />} />
                </Routes>
            ) : (
                // Login and Register 
                <Container maxWidth="md">
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                            <Box
                                component="img"
                                src="/uon-logo-square.png"
                                alt="UON Logo"
                                sx={{
                                    height: 100,
                                    width: 100,
                                    mr: 3,
                                }}
                            />
                            <Typography variant="h4" sx={{ fontWeight: 500 }}>
                                Welcome to UON Safety Platform
                            </Typography>
                        </Box>
                        <Box>
                            <Routes>
                                <Route index element={<Login />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Routes>
                        </Box>
                    </Paper>
                </Container>
            )}
        </Box>
    );
};

export default App;
