import React from "react";
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

const drawerWidth = 220;

// Welcome page
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
        {/* four cards */}
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

  const handleLogout = () => {
    localStorage.removeItem("satoken");
    navigate("/login");
  };

  const menuItems = [
    { text: "Home page", icon: <HomeIcon />, path: "/welcome" },
    { text: "Report", icon: <AssignmentIcon />, path: "/welcome/report" },
    { text: "List", icon: <ListAltIcon />, path: "/welcome/issues" },
    { text: "Profile", icon: <PersonIcon />, path: "/welcome/profile" },
    { text: "Admin", icon: <AdminPanelSettingsIcon />, path: "/welcome/admin" },
  ];
  
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
        {/* Left side menu */}
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

        {/* Main area - Use Routes navigate different pages */}
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
            <Route index element={<HomePage />} />
            <Route path="report" element={<Report />} />
            <Route path="issues" element={<Typography variant="h4" sx={{ color: "#fff" }}>Issues Page</Typography>} />
            <Route path="profile" element={<Typography variant="h4" sx={{ color: "#fff" }}>Profile Page</Typography>} />
            <Route path="admin" element={<Typography variant="h4" sx={{ color: "#fff" }}>Admin Page</Typography>} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
