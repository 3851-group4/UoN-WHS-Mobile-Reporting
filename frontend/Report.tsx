import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  alpha,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Report as ReportIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

interface ReportForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  studentId: string;
  issueLocation: string;
  issueType: string;
  priority: string;
  brief: string;
  description: string;
  dateTime: string;
  witnessInfo: string;
}

const Reporting: React.FC = () => {
  const [formData, setFormData] = useState<ReportForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    studentId: "",
    issueLocation: "",
    issueType: "",
    priority: "",
    brief: "",
    description: "",
    dateTime: "",
    witnessInfo: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages((prev) => [...prev, ...newImages]);

      newImages.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      studentId: "",
      issueLocation: "",
      issueType: "",
      priority: "",
      brief: "",
      description: "",
      dateTime: "",
      witnessInfo: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    images.forEach((image, index) => {
      submitData.append(`image${index}`, image);
    });

    try {
      const response = await fetch("/api/submit-report", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        alert("Report submitted successfully!");
        handleClear();
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Cards
  const cardStyle = {
    p: 4,
    backgroundColor: "#fff",
    borderRadius: 3,
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
    },
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
    <Box
      sx={{
        maxWidth: 900,
        margin: "0 auto",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Title */}
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

      <form onSubmit={handleSubmit}>
        {/* Personal information */}
        <Paper elevation={0} sx={{ ...cardStyle, mb: 3 }}>
          <Box sx={sectionHeaderStyle}>
            <Typography
              variant="h5"
              sx={{ color: "#1e293b", fontWeight: 600 }}
            >
              Personal Information
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#f8fafc", 0.5),
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#f8fafc", 0.5),
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#f8fafc", 0.5),
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="email"
                label="Email Address"
                name="email"
                placeholder="xxx@xx.com"
                value={formData.email}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#f8fafc", 0.5),
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#f8fafc", 0.5),
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Details of iccident */}
        <Paper elevation={0} sx={{ ...cardStyle, mb: 3 }}>
          <Box sx={sectionHeaderStyle}>
            
            <Typography
              variant="h5"
              sx={{ color: "#1e293b", fontWeight: 600 }}
            >
              Incident Details
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Incident Location"
                name="issueLocation"
                value={formData.issueLocation}
                onChange={handleChange}
                placeholder="e.g., Building A, Room 101"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#fef3c7", 0.3),
                    "&:hover": {
                      backgroundColor: alpha("#fef3c7", 0.5),
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#fef3c7", 0.3),
                    "&:hover": {
                      backgroundColor: alpha("#fef3c7", 0.5),
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
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
                  <MenuItem value="Safety Hazard">🚧 Safety Hazard</MenuItem>
                  <MenuItem value="Security Concern">🔒 Security Concern</MenuItem>
                  <MenuItem value="Health Issue">🏥 Health Issue</MenuItem>
                  <MenuItem value="Equipment Damage">⚙️ Equipment Damage</MenuItem>
                  <MenuItem value="Harassment">⚠️ Harassment</MenuItem>
                  <MenuItem value="Other">📝 Other</MenuItem>
                </Select>
              </FormControl>
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
                    "&:hover": {
                      backgroundColor: alpha("#fef3c7", 0.5),
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
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
                    "&:hover": {
                      backgroundColor: alpha("#fef3c7", 0.5),
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
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
                placeholder="Please provide a detailed description of what happened, including any relevant context..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#fef3c7", 0.3),
                    "&:hover": {
                      backgroundColor: alpha("#fef3c7", 0.5),
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
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
                    "&:hover": {
                      backgroundColor: alpha("#f0fdf4", 0.8),
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Upload image */}
        <Paper elevation={0} sx={{ ...cardStyle, mb: 4 }}>
          <Box sx={sectionHeaderStyle}>
            <ImageIcon sx={{ color: "#06b6d4", fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{ color: "#1e293b", fontWeight: 600 }}
            >
              Attachments
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", ml: "auto" }}
            >
              Optional
            </Typography>
          </Box>

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            sx={{
              borderColor: alpha("#06b6d4", 0.3),
              color: "#06b6d4",
              backgroundColor: alpha("#ecfeff", 0.5),
              py: 1.5,
              px: 3,
              borderRadius: 2,
              fontWeight: 500,
              "&:hover": {
                borderColor: "#06b6d4",
                backgroundColor: alpha("#ecfeff", 0.8),
              },
            }}
          >
            Upload Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>

          {imagePreviews.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, mt: 3 }}>
              {imagePreviews.map((preview, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: 140,
                    height: 140,
                    borderRadius: 2.5,
                    overflow: "hidden",
                    border: "2px solid",
                    borderColor: alpha("#06b6d4", 0.2),
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#06b6d4",
                      boxShadow: "0 4px 12px rgba(6, 182, 212, 0.3)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteImage(index)}
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      "&:hover": {
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Paper>

        {/* Button */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClear}
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
            "&:hover": {
              borderColor: "#d1d5db",
              backgroundColor: "#f3f4f6",
              color: "#374151",
            },
          }}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              minWidth: 140,
              py: 1.5,
              px: 4,
              borderRadius: 2.5,
              backgroundColor: "#6366f1",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              "&:hover": {
                backgroundColor: "#4f46e5",
                boxShadow: "0 6px 20px rgba(99, 102, 241, 0.5)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Submit Report
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Reporting;

