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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import CategoryIcon from "@mui/icons-material/Category";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("satoken");
    navigate("/login");
  };
  
  return (
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
            <ListItemText primary="" />
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
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Personal inforamation" />
          </ListItemButton>
        </List>
        
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* 右上角 logout */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="outlined" color="error" size="small" onClick={handleLogout}>
            Logout
          </Button>
        </Box>


      </Box>
    </Box>
  );
};

export default Welcome;
