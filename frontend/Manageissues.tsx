import React, { useState, useEffect } from 'react';
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
  Grid,
  Alert,
  Tooltip,
  ImageList,
  ImageListItem,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';

const API_BASE = 'http://localhost:8000';

interface IssueVo {
  id: number;
  userId: number;
  title: string;
  brief: string;
  description: string;
  location: string;
  status: string;
  witnessInfo: string;
  happenTime: string;
  urls: string[];
}

type BackendStatus = 'pending' | 'processing' | 'completed';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'In Progress',
  completed: 'Completed',
};

const statusColor = (status: string): 'warning' | 'primary' | 'success' | 'default' => {
  switch (status) {
    case 'pending': return 'warning';
    case 'processing': return 'primary';
    case 'completed': return 'success';
    default: return 'default';
  }
};

const formatDateTime = (dt: string | null) => {
  if (!dt) return '—';
  const d = new Date(dt);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const ManageIssues: React.FC = () => {
  const [issues, setIssues] = useState<IssueVo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueVo | null>(null);
  const [newStatus, setNewStatus] = useState<BackendStatus>('pending');
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const getToken = () => localStorage.getItem('token') || '';

  const fetchIssues = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/issue/admin/viewAll`, {
        headers: { 'token': getToken() },
      });
      const result = await res.json();
      if (result.code === 200) {
        setIssues(result.data || []);
      } else {
        setError(result.msg || 'Failed to load issues.');
      }
    } catch (e) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleViewReport = (issue: IssueVo) => {
    setSelectedIssue(issue);
    setViewDialogOpen(true);
  };

  const handleUpdateStatusOpen = (issue: IssueVo) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status as BackendStatus);
    setStatusDialogOpen(true);
  };

  const confirmUpdateStatus = async () => {
    if (!selectedIssue) return;
    setStatusSubmitting(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/issue/admin/updateStatus/${selectedIssue.id}?status=${newStatus}`,
        {
          method: 'PUT',
          headers: { 'token': getToken() },
        }
      );
      const result = await res.json();
      if (result.code === 200) {
        setStatusDialogOpen(false);
        setSuccessMessage(`Issue #${selectedIssue.id} status updated to "${STATUS_LABELS[newStatus]}"!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchIssues();
      } else {
        alert(result.msg || 'Failed to update status.');
      }
    } catch (e) {
      alert('An error occurred. Please try again.');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const filteredIssues = statusFilter === 'All'
    ? issues
    : issues.filter((i) => i.status === statusFilter);

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === 'pending').length,
    processing: issues.filter((i) => i.status === 'processing').length,
    completed: issues.filter((i) => i.status === 'completed').length,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#000', mb: 1 }}>
          Manage Issues
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)' }}>
          View all safety reports and update their status
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2' }}>{stats.total}</Typography>
            <Typography variant="body2" color="text.secondary">Total Reports</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ed6c02' }}>{stats.pending}</Typography>
            <Typography variant="body2" color="text.secondary">Pending</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8eaf6' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#3f51b5' }}>{stats.processing}</Typography>
            <Typography variant="body2" color="text.secondary">In Progress</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#2e7d32' }}>{stats.completed}</Typography>
            <Typography variant="body2" color="text.secondary">Completed</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 200, bgcolor: '#fff' }}
        >
          <MenuItem value="All">All Reports</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="processing">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </Box>

      {/* Issues Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Submitted By</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Images</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIssues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">No reports found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredIssues.map((issue) => (
                <TableRow key={issue.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>#{issue.id}</Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap>{issue.title}</Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 150 }}>
                    <Typography variant="body2" noWrap>{issue.location}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: '0.875rem' }}>
                        {String(issue.userId)}
                      </Avatar>
                      <Typography variant="body2">User #{issue.userId}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[issue.status] ?? issue.status}
                      color={statusColor(issue.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDateTime(issue.happenTime)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${(issue.urls || []).length} photo${(issue.urls || []).length !== 1 ? 's' : ''}`}
                      size="small"
                      color={(issue.urls || []).length > 0 ? 'primary' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary" onClick={() => handleViewReport(issue)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Update Status">
                      <IconButton size="small" color="success" onClick={() => handleUpdateStatusOpen(issue)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Report Details</Typography>
          <IconButton onClick={() => setViewDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedIssue && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Report ID</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>#{selectedIssue.id}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                <Typography variant="h6">{selectedIssue.title}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                <Typography variant="body1">{selectedIssue.location}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip
                  label={STATUS_LABELS[selectedIssue.status] ?? selectedIssue.status}
                  color={statusColor(selectedIssue.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Submitted By</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                    {String(selectedIssue.userId)}
                  </Avatar>
                  <Typography variant="body1">User #{selectedIssue.userId}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Date & Time</Typography>
                <Typography variant="body1">{formatDateTime(selectedIssue.happenTime)}</Typography>
              </Grid>
              {selectedIssue.brief && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Brief</Typography>
                  <Typography variant="body1">{selectedIssue.brief}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Paper sx={{ p: 2, mt: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedIssue.description}
                  </Typography>
                </Paper>
              </Grid>
              {selectedIssue.witnessInfo && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Witness Info</Typography>
                  <Typography variant="body1">{selectedIssue.witnessInfo}</Typography>
                </Grid>
              )}
              {(selectedIssue.urls || []).length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Attached Images ({selectedIssue.urls.length})
                  </Typography>
                  <ImageList cols={3} gap={8}>
                    {selectedIssue.urls.map((url, idx) => (
                      <ImageListItem
                        key={idx}
                        sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                        onClick={() => setPreviewImage(url)}
                      >
                        <img src={url} alt={`Image ${idx + 1}`} loading="lazy" style={{ height: 150, objectFit: 'cover' }} />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setViewDialogOpen(false);
              if (selectedIssue) handleUpdateStatusOpen(selectedIssue);
            }}
            variant="contained"
            color="primary"
          >
            Update Status
          </Button>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Report Status</DialogTitle>
        <DialogContent>
          {selectedIssue && (
            <Box sx={{ mt: 2 }}>
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" color="text.secondary">Report:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  #{selectedIssue.id} — {selectedIssue.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Submitted by: User #{selectedIssue.userId}
                </Typography>
              </Paper>

              <FormControl fullWidth>
                <InputLabel>New Status</InputLabel>
                <Select
                  value={newStatus}
                  label="New Status"
                  onChange={(e) => setNewStatus(e.target.value as BackendStatus)}
                >
                  <MenuItem value="pending">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HourglassEmptyIcon fontSize="small" />
                      Pending
                    </Box>
                  </MenuItem>
                  <MenuItem value="processing">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EditIcon fontSize="small" />
                      In Progress
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" />
                      Completed
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2"><strong>Status Guide:</strong></Typography>
                <Typography variant="caption" component="div">
                  • <strong>Pending:</strong> Report received, awaiting review<br />
                  • <strong>In Progress:</strong> Currently being worked on<br />
                  • <strong>Completed:</strong> Issue has been fixed/resolved
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} disabled={statusSubmitting}>Cancel</Button>
          <Button onClick={confirmUpdateStatus} variant="contained" color="primary" disabled={statusSubmitting}>
            {statusSubmitting ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Image Preview</Typography>
          <IconButton onClick={() => setPreviewImage(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManageIssues;
