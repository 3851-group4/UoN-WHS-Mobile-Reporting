import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
}

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/api/user/get/user", {
        method: "GET",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.code === 200 && result.data) {
        setUserInfo(result.data);
      } else {
        setError(result.msg || "Failed to fetch user information.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  const detailFields = [
    {
      icon: <BadgeIcon sx={{ color: "#1976d2" }} />,
      label: "Full Name",
      value: userInfo?.name,
    },
    {
      icon: <EmailIcon sx={{ color: "#1976d2" }} />,
      label: "Email Address",
      value: userInfo?.email,
    },
    {
      icon: <FingerprintIcon sx={{ color: "#1976d2" }} />,
      label: "Account ID",
      value: `#${userInfo?.id}`,
    },
    {
      icon: <AdminPanelSettingsIcon sx={{ color: "#1976d2" }} />,
      label: "Account Role",
      value: userInfo?.role === "admin" ? "Administrator" : "Student",
    },
  ];

  return (
    <Box sx={{ maxWidth: 700, mx: "auto" }}>
      {/* Profile header */}
      <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 80,
              height: 80,
              fontSize: "2rem",
              fontWeight: 700,
            }}
          >
            {userInfo ? getInitials(userInfo.name) : <PersonIcon />}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {userInfo?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {userInfo?.email}
            </Typography>
            <Chip
              label={userInfo?.role === "admin" ? "Administrator" : "Student"}
              color={userInfo?.role === "admin" ? "error" : "primary"}
              size="small"
              icon={
                userInfo?.role === "admin" ? (
                  <AdminPanelSettingsIcon />
                ) : (
                  <PersonIcon />
                )
              }
            />
          </Box>
        </Box>
      </Paper>

      {/* Account details */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Account Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {detailFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.label}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(25, 118, 210, 0.1)",
                    width: 44,
                    height: 44,
                  }}
                >
                  {field.icon}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {field.label}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {field.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;