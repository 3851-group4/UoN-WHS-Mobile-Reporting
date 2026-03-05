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
  CircularProgress,
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
import Profile from "./Profile";

const drawerWidth = 220;
const API_BASE = "http://localhost:8000";

// Homepage
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

  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE}/api/user/get/user`, {
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
        setUserRole(result.data.role === 'admin' ? 'admin' : 'user');
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('Failed to fetch user role:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_BASE}/api/user/logout`, {
          method: 'GET',
          headers: { 'token': token }
        });
      } catch (e) {
        // ignore error, proceed with local logout
      }
    }
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getMenuItems = () => {
    if (userRole === 'admin') {
      return [
        { text: "Admin", icon: <AdminPanelSettingsIcon />, path: "/welcome/admin" },
        { text: "Issues", icon: <ListAltIcon />, path: "/welcome/viewissues" },
      ];
    } else {
      return [
        { text: "Home page", icon: <HomeIcon />, path: "/welcome" },
        { text: "Report", icon: <AssignmentIcon />, path: "/welcome/user/report" },
        { text: "List", icon: <ListAltIcon />, path: "/welcome/user/list" },
        { text: "Profile", icon: <PersonIcon />, path: "/welcome/profile" },
      ];
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  const menuItems = getMenuItems();

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Logout button */}
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
        {/* Left menu */}
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
          {/* Role */}
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

        {/* Main page */}
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
            {userRole === 'user' && (
              <>
                <Route index element={<HomePage />} />
                <Route path="user/report" element={<Report />} />
                <Route path="user/list" element={<Issuelist />} />
                <Route path="profile" element={<Profile />} />
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
