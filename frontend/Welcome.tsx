import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Switch,
  FormControlLabel,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SecurityIcon from "@mui/icons-material/Security";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import Report from "./Report";
import Admin from "./Admin";
import Manageissues from "./Manageissues";
import Issuelist from "./List";

const drawerWidth = 220;

// 首页内容组件
const HomePage: React.FC = () => {
  return (
    <>
      {/* Welcome message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
            <PersonIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              Welcome back!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You have successfully logged in to the UON Safety Platform
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* 4个卡片 */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#2e7d32", mr: 2 }}>
                  <ReportIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  New Report
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Submit a new safety incident or hazard report
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#ed6c02", mr: 2 }}>
                  <SettingsIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  My Issues
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                View and track your submitted reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Safety Resources
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Access safety guidelines and procedures
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#9c27b0", mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Completed
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                View resolved safety reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

interface WelcomeProps {
  children?: React.ReactNode;
}

const Welcome: React.FC<WelcomeProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🧪 测试模式：用于切换角色
  const [testMode, setTestMode] = useState(true);
  const [mockRole, setMockRole] = useState<'admin' | 'user'>('user');
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

  // 获取用户角色
  useEffect(() => {
    if (testMode) {
      // 测试模式：使用 Mock 角色
      setUserRole(mockRole);
    } else {
      // 生产模式：从后端获取用户信息
      fetchUserRole();
    }
  }, [testMode, mockRole]);

  // 🌐 真实模式：调用后端获取用户角色
  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/user/get/user', {
        method: 'GET',
        headers: {
          'token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const result = await response.json();
      
      if (result.code === 200 && result.data) {
        setUserRole(result.data.role);
      } else {
        throw new Error('Invalid response');
      }

    } catch (err) {
      console.error('Failed to fetch user role:', err);
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔑 根据角色定义菜单项
  const getMenuItems = () => {
    if (userRole === 'admin') {
      // Admin 用户只显示 Admin 页面
      return [
        { text: "Admin", icon: <AdminPanelSettingsIcon />, path: "/welcome/admin" },
        { text: "Issues", icon: <ListAltIcon />, path: "/welcome/viewissues" },
      ];
    } else {
      // 普通用户显示 4 个页面
      return [
        { text: "Home page", icon: <HomeIcon />, path: "/welcome" },
        { text: "Report", icon: <AssignmentIcon />, path: "/welcome/user/report" },
        { text: "List", icon: <ListAltIcon />, path: "/welcome/user/list" },
        { text: "Profile", icon: <PersonIcon />, path: "/welcome/profile" },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {/* 🧪 测试控制面板 */}
      {testMode && (
        <Paper
          sx={{
            position: "fixed",
            top: 80,
            right: 30,
            zIndex: 1400,
            p: 2,
            bgcolor: 'rgba(33, 150, 243, 0.95)',
            color: '#fff',
            minWidth: 200,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            🧪 Test Mode
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant={mockRole === 'user' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setMockRole('user')}
              sx={{
                color: mockRole === 'user' ? '#2196f3' : '#fff',
                bgcolor: mockRole === 'user' ? '#fff' : 'transparent',
                borderColor: '#fff',
                '&:hover': {
                  bgcolor: mockRole === 'user' ? '#f5f5f5' : 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Login as User
            </Button>
            <Button
              variant={mockRole === 'admin' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setMockRole('admin')}
              sx={{
                color: mockRole === 'admin' ? '#2196f3' : '#fff',
                bgcolor: mockRole === 'admin' ? '#fff' : 'transparent',
                borderColor: '#fff',
                '&:hover': {
                  bgcolor: mockRole === 'admin' ? '#f5f5f5' : 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Login as Admin
            </Button>
          </Box>
          <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
            Current Role: {userRole}
          </Typography>
        </Paper>
      )}

      {/* Logout 按钮 */}
      <Box
        sx={{
          position: "fixed",
          top: 30,
          right: 30,
          zIndex: 1400,
        }}
      >
        <Button
          variant="contained"
          color="info"
          size="large"
          onClick={handleLogout}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          }}
        >
          LOGOUT
        </Button>
      </Box>

      <Box sx={{ display: "flex" }}>
        {/* 左侧导航 */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#1a1a1aff",
              color: "#fff",
            },

            "& .MuiListItemText-primary": {
              fontSize: "1rem",
              fontWeight: 600,
            },
          }}
        >
          {/* 用户角色标识 */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
              Role
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
              {userRole}
            </Typography>
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                sx={{
                  py: 1,
                  mb: 1,
                  backgroundColor: location.pathname === item.path ? "rgba(255,255,255,0.1)" : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon sx={{ color: "#fff" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>

        {/* 主内容区域 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${drawerWidth}px)`,
            minHeight: "100vh",
          }}
        >
          <Routes>
            {/* 根据角色显示不同的首页 */}
            {userRole === 'user' && (
              <>
                <Route index element={<HomePage />} />
                <Route path="user/report" element={<Report />} />
                <Route path="user/list" element={<Issuelist />} />
                <Route path="profile" element={<Typography variant="h4" sx={{ color: "#fff" }}>Profile Page</Typography>} />
              </>
            )}
            
            {userRole === 'admin' && (
              <>
                <Route index element={<Admin />} />
                <Route path="admin" element={<Admin />} />
                <Route path="viewissues" element={<Manageissues />} />
              </>
            )}
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
