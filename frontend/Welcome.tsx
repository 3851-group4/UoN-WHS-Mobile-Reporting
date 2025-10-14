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
import SettingsIcon from "@mui/icons-material/Settings";
import CategoryIcon from "@mui/icons-material/Category";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Left sidebar navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1a1a1a",
            color: "#fff",
          },
        }}
      >
        <List>
          <ListItemButton>
            <ListItemIcon sx={{ color: "#fff" }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "#fff" }}>
              <StarIcon />
            </ListItemIcon>
            <ListItemText primary="Reporting" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "#fff" }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="The list of your issues" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "#fff" }}>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Admin only" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "#fff" }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Personal information" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main content area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header with logout button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
            Welcome to UON Safety Platform
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            size="small" 
            onClick={handleLogout}
            sx={{ fontWeight: 500 }}
          >
            Logout
          </Button>
        </Box>

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

        {/* Dashboard cards */}
        <Grid container spacing={3}>
          {/* Quick access card 1 */}
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

          {/* Quick access card 2 */}
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

          {/* Quick access card 3 */}
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

          {/* Quick access card 4 */}
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

        {/* Information section */}
        <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Platform Information
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            The UON Safety Platform is designed to help maintain a safe environment 
            for all students, staff, and visitors at the University of Newcastle.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You can use this platform to:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Report safety incidents, hazards, or near-misses
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Track the status of your submitted reports
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Access safety resources and guidelines
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Stay informed about workplace health and safety updates
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Welcome;
