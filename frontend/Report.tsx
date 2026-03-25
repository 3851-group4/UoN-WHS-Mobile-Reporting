import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  alpha,
  Alert,
} from "@mui/material";
import {
  Send as SendIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

const API_BASE = "http://localhost:8000";

const ISSUE_TYPES = [
  "Safety Hazard",
  "Security Concern",
  "Health Issue",
  "Equipment Damage",
  "Harassment",
  "Other",
];

interface ReportForm {
  issueType: string;
  brief: string;
  location: string;
  dateTime: string;
  description: string;
  witnessInfo: string;
}

const emptyForm: ReportForm = {
  issueType: "",
  brief: "",
  location: "",
  dateTime: "",
  description: "",
  witnessInfo: "",
};

const Reporting: React.FC = () => {
  const [formData, setFormData] = useState<ReportForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData(emptyForm);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Not authenticated. Please log in again.");
        return;
      }

      // Combine issueType + brief as the title
      const title = formData.issueType
        ? `[${formData.issueType}] ${formData.brief}`
        : formData.brief;

      const body = {
        title,
        brief: formData.brief,
        description: formData.description,
        location: formData.location,
        witnessInfo: formData.witnessInfo || null,
        happenTime: formData.dateTime
          ? new Date(formData.dateTime).toISOString().slice(0, 19)
          : null,
      };

      const response = await fetch(`${API_BASE}/api/issue/upsert`, {
        method: "POST",
        headers: {
          "token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.code === 200) {
        setSuccessMessage("Report submitted successfully!");
        setFormData(emptyForm);
      } else {
        setErrorMessage(result.msg || "Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardStyle = {
    p: 4,
    backgroundColor: "#fff",
    borderRadius: 3,
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.06)",
  };

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    mb: 3,
    pb: 2,
    borderBottom: "2px solid",
    borderColor: alpha("#6366f1", 0.15),
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography
        variant="h3"
        sx={{
          color: "white",
          fontWeight: 650,
          mb: 1.5,
          textShadow: "0 4px 16px rgba(6, 182, 212, 0.5)",
          letterSpacing: "-0.02em",
        }}
      >
        Safety Incident Report
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Incident Details */}
        <Paper elevation={0} sx={{ ...cardStyle, mb: 3 }}>
          <Box sx={sectionHeaderStyle}>
            <Typography variant="h5" sx={{ color: "#1e293b", fontWeight: 600 }}>
              Incident Details
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#fef3c7", 0.3),
                  },
                }}
              >
                <InputLabel>Issue Type</InputLabel>
                <Select
                  name="issueType"
                  value={formData.issueType}
                  label="Issue Type"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, issueType: e.target.value }))
                  }
                >
                  {ISSUE_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Incident Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Building A, Room 101"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#fef3c7", 0.3),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="datetime-local"
                label="Date & Time of Incident"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#fef3c7", 0.3),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Brief Summary"
                name="brief"
                value={formData.brief}
                onChange={handleChange}
                placeholder="Short description of the incident"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#fef3c7", 0.3),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={5}
                label="Detailed Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please provide a detailed description of what happened..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#fef3c7", 0.3),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Witness Information (Optional)"
                name="witnessInfo"
                value={formData.witnessInfo}
                onChange={handleChange}
                placeholder="Names and contact information of any witnesses"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#f0fdf4", 0.5),
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            disabled={submitting}
            sx={{
              minWidth: 140,
              py: 1.5,
              px: 4,
              borderRadius: 2.5,
              borderWidth: 2,
              borderColor: "#e5e7eb",
              color: "#6b7280",
              backgroundColor: "#f9fafb",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SendIcon />}
            disabled={submitting}
            sx={{
              minWidth: 140,
              py: 1.5,
              px: 4,
              borderRadius: 2.5,
              backgroundColor: "#6366f1",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
            }}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Reporting;
