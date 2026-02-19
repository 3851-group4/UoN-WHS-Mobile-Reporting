import type { FC } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Container, Typography, Box, Paper } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import Welcome from "./Welcome";
import Admin from "./Admin";

const App: FC = () => {
    const location = useLocation();
    
    // 判断是否是 Welcome 相关页面（用于控制布局）
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
            filter: "blur(2.5px)", // 调整数值控制模糊程度
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
                // Welcome 页面及其子页面：全屏显示
                <Routes>
                    <Route path="/welcome/*" element={<Welcome />} />
                </Routes>
            ) : (
                // Login 和 Register 页面：居中卡片布局
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
