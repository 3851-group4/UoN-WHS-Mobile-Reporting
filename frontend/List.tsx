import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Tooltip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// Api report
interface Report {
  id: number;
  title: string;
  category: string;
  location: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Cancelled';
  submittedDate: string;
  submittedTime: string;
  submittedBy: string;
  images: string[];  // iMAGE URL
}

const ViewIssues: React.FC = () => {
  // Sample
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      title: 'Broken Window in Building A',
      category: 'Facility',
      location: 'Building A, Room 301',
      description: 'The window on the third floor is cracked and poses a safety hazard. It needs immediate attention as glass shards are falling.',
      status: 'Pending',
      submittedDate: '2024-02-15',
      submittedTime: '14:30',
      submittedBy: 'John Smith',
      images: [
        'https://via.placeholder.com/300x200?text=Broken+Window+1',
        'https://via.placeholder.com/300x200?text=Broken+Window+2',
      ],
    },
    {
      id: 2,
      title: 'Slippery Floor in Cafeteria',
      category: 'Safety',
      location: 'Main Cafeteria',
      description: 'Water leak causing slippery floor near the beverage station. Multiple students have nearly slipped.',
      status: 'Pending',
      submittedDate: '2024-02-16',
      submittedTime: '09:15',
      submittedBy: 'Sarah Johnson',
      images: [
        'https://via.placeholder.com/300x200?text=Wet+Floor',
      ],
    },
  ]);

  // The status of window
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editedReport, setEditedReport] = useState<Report | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // preview image
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // detail
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  // Edir report
  const handleEditReport = (report: Report) => {
    setEditedReport({ ...report });
    setEditDialogOpen(true);
  };

  // Add more images
  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && editedReport) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const newImages = [...editedReport.images, reader.result as string];
        setEditedReport({ ...editedReport, images: newImages });
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Delete image
  const handleDeleteImage = (index: number) => {
    if (editedReport) {
      const newImages = editedReport.images.filter((_, i) => i !== index);
      setEditedReport({ ...editedReport, images: newImages });
    }
  };

  // Save
  const handleSaveEdit = () => {
    if (editedReport) {
      setReports(reports.map(r => r.id === editedReport.id ? editedReport : r));
      setEditDialogOpen(false);
      setSuccessMessage('Report updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Delete
  const handleDeleteReport = (report: Report) => {
    setSelectedReport(report);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReport) {
      setReports(reports.map(r => 
        r.id === selectedReport.id ? { ...r, status: 'Cancelled' as const } : r
      ));
      
      setDeleteDialogOpen(false);
      setSuccessMessage('Report cancelled successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

 
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'In Progress': return 'info';
      case 'Resolved': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
          My Reports
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          View and manage your submitted safety reports
        </Typography>
      </Box>

      {/* Successful */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Report  */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Images</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow 
                key={report.id}
                sx={{ 
                  '&:hover': { bgcolor: '#f9f9f9' },
                  opacity: report.status === 'Cancelled' ? 0.6 : 1,
                }}
              >
                <TableCell>#{report.id}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" noWrap>
                    {report.title}
                  </Typography>
                </TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell sx={{ maxWidth: 150 }}>
                  <Typography variant="body2" noWrap>
                    {report.location}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={report.status} 
                    color={getStatusColor(report.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{report.submittedDate}</Typography>
                  <Typography variant="caption" color="text.secondary">{report.submittedTime}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${report.images.length} photo${report.images.length !== 1 ? 's' : ''}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleViewReport(report)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Edit Report">
                    <IconButton 
                      size="small" 
                      color="info"
                      onClick={() => handleEditReport(report)}
                      disabled={report.status === 'Cancelled' || report.status === 'Resolved'}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Cancel Report">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteReport(report)}
                      disabled={report.status === 'Cancelled' || report.status === 'Resolved'}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View details */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Report Details</Typography>
          <IconButton onClick={() => setViewDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedReport && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Report ID</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>#{selectedReport.id}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                <Typography variant="body1">{selectedReport.title}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                <Typography variant="body1">{selectedReport.category}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                <Typography variant="body1">{selectedReport.location}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedReport.status} 
                  color={getStatusColor(selectedReport.status) as any}
                  size="small"
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Submitted By</Typography>
                <Typography variant="body1">{selectedReport.submittedBy}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Submitted Date</Typography>
                <Typography variant="body1">{selectedReport.submittedDate}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Submitted Time</Typography>
                <Typography variant="body1">{selectedReport.submittedTime}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedReport.description}
                </Typography>
              </Grid>

              {/* Display image*/}
              {selectedReport.images.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Attached Images ({selectedReport.images.length})
                  </Typography>
                  <ImageList cols={3} gap={8}>
                    {selectedReport.images.map((image, index) => (
                      <ImageListItem 
                        key={index}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { opacity: 0.8 }
                        }}
                        onClick={() => setPreviewImage(image)}
                      >
                        <img
                          src={image}
                          alt={`Report image ${index + 1}`}
                          loading="lazy"
                          style={{ height: 150, objectFit: 'cover' }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent dividers>
          {editedReport && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={editedReport.title}
                  onChange={(e) => setEditedReport({ ...editedReport, title: e.target.value })}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={editedReport.category}
                  onChange={(e) => setEditedReport({ ...editedReport, category: e.target.value })}
                >
                  <MenuItem value="Facility">Facility</MenuItem>
                  <MenuItem value="Safety">Safety</MenuItem>
                  <MenuItem value="Security">Security</MenuItem>
                  <MenuItem value="Equipment">Equipment</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={editedReport.location}
                  onChange={(e) => setEditedReport({ ...editedReport, location: e.target.value })}
                />
              </Grid>

              {/* Date and time */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={editedReport.submittedDate}
                  onChange={(e) => setEditedReport({ ...editedReport, submittedDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  value={editedReport.submittedTime}
                  onChange={(e) => setEditedReport({ ...editedReport, submittedTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={editedReport.description}
                  onChange={(e) => setEditedReport({ ...editedReport, description: e.target.value })}
                />
              </Grid>

              {/* Manage images */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Images ({editedReport.images.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddPhotoAlternateIcon />}
                    component="label"
                    size="small"
                  >
                    Add Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAddImage}
                    />
                  </Button>
                </Box>

                {editedReport.images.length > 0 ? (
                  <ImageList cols={3} gap={8}>
                    {editedReport.images.map((image, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          loading="lazy"
                          style={{ height: 150, objectFit: 'cover' }}
                        />
                        <ImageListItemBar
                          actionIcon={
                            <IconButton
                              sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                              onClick={() => handleDeleteImage(index)}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Box 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      bgcolor: '#f5f5f5', 
                      borderRadius: 1,
                      border: '2px dashed #ccc'
                    }}
                  >
                    <AddPhotoAlternateIcon sx={{ fontSize: 48, color: '#999', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No images attached
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete dialog window */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Cancel Report</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this report? This action cannot be undone.
          </Typography>
          {selectedReport && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Report:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {selectedReport.title}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>No, Keep It</Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            color="error"
          >
            Yes, Cancel Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview image window */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Image Preview</Typography>
          <IconButton onClick={() => setPreviewImage(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={previewImage}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};


export default ViewIssues;

