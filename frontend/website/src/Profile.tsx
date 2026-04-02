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
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { getMockCurrentUser, shouldUseMock } from "./mock";

interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
}

const MOCK_PROFILE_KEY_PREFIX = "mock-profile-email-";

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [emailDraft, setEmailDraft] = useState("");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    if (shouldUseMock()) {
      const mockUser = getMockCurrentUser();
      const savedEmail = window.localStorage.getItem(`${MOCK_PROFILE_KEY_PREFIX}${mockUser.id}`);
      const nextUser = {
        ...mockUser,
        email: savedEmail || mockUser.email,
      };
      setUserInfo(nextUser);
      setEmailDraft(nextUser.email);
      setLoading(false);
      return;
    }

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
        setEmailDraft(result.data.email || "");
      } else {
        setError(result.msg || "Failed to fetch user information.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!userInfo) {
      return;
    }

    const trimmedEmail = emailDraft.trim();
    if (!trimmedEmail) {
      setError("Email address cannot be empty.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    if (shouldUseMock()) {
      window.localStorage.setItem(`${MOCK_PROFILE_KEY_PREFIX}${userInfo.id}`, trimmedEmail);
      setUserInfo({ ...userInfo, email: trimmedEmail });
      setSuccessMessage("Email address updated.");
      setEmailDialogOpen(false);
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated. Please log in again.");
      }

      const response = await fetch("http://localhost:8000/api/user/update", {
        method: "POST",
        headers: {
          token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      const result = await response.json();

      if (result.code === 200 && result.data) {
        setUserInfo(result.data);
        setEmailDraft(result.data.email || trimmedEmail);
        setSuccessMessage("Email address updated.");
        setEmailDialogOpen(false);
      } else {
        setError(result.msg || "Failed to update email address.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEmailDraft(userInfo?.email || "");
    setEmailDialogOpen(false);
    setError(null);
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
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}
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
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {field.label}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {field.value}
                  </Typography>
                </Box>
                {field.label === "Email Address" && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      setEmailDraft(userInfo?.email || "");
                      setSuccessMessage(null);
                      setError(null);
                      setEmailDialogOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={emailDialogOpen} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Edit Email Address</Typography>
          <IconButton onClick={handleCancelEdit} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update the email used for your account notifications and login.
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={emailDraft}
            onChange={(e) => setEmailDraft(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEmail}
            disabled={saving || !emailDraft.trim() || emailDraft.trim() === userInfo?.email}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
