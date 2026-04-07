import React, { useEffect, useState } from 'react';
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, ImageList, ImageListItem, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getAttachmentName, isImageAttachment } from './attachments';
import { DEFAULT_MOCK_ADMIN, DEFAULT_MOCK_USER, getMockIssues, saveMockIssues, shouldUseMock } from './mock';

const API_BASE = 'http://localhost:8000';

interface IssueVo { id: number; userId: number; title: string; brief: string; description: string; location: string; status: string; witnessInfo: string; happenTime: string; urls: string[]; }
interface UserInfoDto { id: number; name: string; email: string; role: string; }
type BackendStatus = 'pending' | 'processing' | 'completed';

const STATUS_LABELS: Record<string, string> = { pending: 'Pending', processing: 'In Progress', completed: 'Completed' };
const statusColor = (status: string): 'warning' | 'primary' | 'success' | 'default' => status === 'pending' ? 'warning' : status === 'processing' ? 'primary' : status === 'completed' ? 'success' : 'default';
const formatDateTime = (dt: string | null) => !dt ? 'N/A' : `${new Date(dt).toLocaleDateString()} ${new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

const ManageIssues: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [issues, setIssues] = useState<IssueVo[]>([]);
  const [users, setUsers] = useState<UserInfoDto[]>([]);
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
  const [searchQuery, setSearchQuery] = useState('');

  const getToken = () => localStorage.getItem('token') || '';

  const fetchIssues = async () => {
    setLoading(true);
    setError('');
    if (shouldUseMock()) {
      setIssues(getMockIssues());
      setUsers([
        DEFAULT_MOCK_ADMIN,
        DEFAULT_MOCK_USER,
        { id: 1002, name: 'Taylor Student', email: 'taylor.student@uon.edu.au', role: 'user' },
        { id: 1003, name: 'Jordan Student', email: 'jordan.student@uon.edu.au', role: 'user' },
      ]);
      setLoading(false);
      return;
    }
    try {
      const [issuesRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/api/issue/admin/viewAll`, { headers: { token: getToken() } }),
        fetch(`${API_BASE}/api/user/admin/viewAll`, { headers: { token: getToken() } }),
      ]);
      const issuesResult = await issuesRes.json();
      const usersResult = await usersRes.json();
      if (issuesResult.code === 200) setIssues(issuesResult.data || []);
      else {
        setError(issuesResult.msg || 'Failed to load issues.');
        return;
      }
      if (usersResult.code === 200) setUsers(usersResult.data || []);
      else setError(usersResult.msg || 'Failed to load users.');
    } catch {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssues(); }, []);

  const handleViewReport = (issue: IssueVo) => { setSelectedIssue(issue); setViewDialogOpen(true); };
  const handleUpdateStatusOpen = (issue: IssueVo) => { setSelectedIssue(issue); setNewStatus(issue.status as BackendStatus); setStatusDialogOpen(true); };

  const confirmUpdateStatus = async () => {
    if (!selectedIssue) return;
    setStatusSubmitting(true);
    try {
      if (shouldUseMock()) {
        saveMockIssues(getMockIssues().map((issue) => issue.id === selectedIssue.id ? { ...issue, status: newStatus } : issue));
        setStatusDialogOpen(false);
        setSuccessMessage(`Issue #${selectedIssue.id} status updated to "${STATUS_LABELS[newStatus]}"!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchIssues();
        return;
      }
      const res = await fetch(`${API_BASE}/api/issue/admin/updateStatus/${selectedIssue.id}?status=${newStatus}`, { method: 'PUT', headers: { token: getToken() } });
      const result = await res.json();
      if (result.code === 200) {
        setStatusDialogOpen(false);
        setSuccessMessage(`Issue #${selectedIssue.id} status updated to "${STATUS_LABELS[newStatus]}"!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchIssues();
      } else alert(result.msg || 'Failed to update status.');
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const getSubmittedByName = (userId: number) => users.find((user) => user.id === userId)?.name || `User #${userId}`;
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredIssues = issues.filter((issue) => {
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    if (!matchesStatus) return false;
    if (!normalizedSearchQuery) return true;

    const submittedBy = getSubmittedByName(issue.userId).toLowerCase();
    return [issue.title, issue.location, submittedBy].some((value) =>
      (value || '').toLowerCase().includes(normalizedSearchQuery),
    );
  });
  const stats = { total: issues.length, pending: issues.filter((i) => i.status === 'pending').length, processing: issues.filter((i) => i.status === 'processing').length, completed: issues.filter((i) => i.status === 'completed').length };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1, fontSize: { xs: '2.45rem', md: '3rem' } }}>Manage Issues</Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.78)', maxWidth: 560, fontSize: { xs: '1.1rem', md: '1rem' } }}>View all safety reports and update their status</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 3 }}><Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>{stats.total}</Typography><Typography variant="body2" color="text.secondary">Total Reports</Typography></Paper></Grid>
        <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0', borderRadius: 3 }}><Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02' }}>{stats.pending}</Typography><Typography variant="body2" color="text.secondary">Pending</Typography></Paper></Grid>
        <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8eaf6', borderRadius: 3 }}><Typography variant="h4" sx={{ fontWeight: 700, color: '#3f51b5' }}>{stats.processing}</Typography><Typography variant="body2" color="text.secondary">In Progress</Typography></Paper></Grid>
        <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9', borderRadius: 3 }}><Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>{stats.completed}</Typography><Typography variant="body2" color="text.secondary">Completed</Typography></Paper></Grid>
      </Grid>

      <Box sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 1.5 }}>
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          placeholder="Search title, location, submitted by"
          sx={{ minWidth: { xs: '100%', sm: 320 }, bgcolor: '#fff', '& .MuiInputBase-input': { fontSize: { xs: '1.02rem', md: '0.875rem' } } }}
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small" sx={{ minWidth: { xs: '100%', sm: 200 }, bgcolor: '#fff' }}>
          <MenuItem value="All">All Reports</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="processing">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </Box>

      {isMobile ? (
        filteredIssues.length === 0 ? (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}><Typography variant="body1" color="text.secondary" align="center">No reports found</Typography></Paper>
        ) : (
          <Stack spacing={2}>
            {filteredIssues.map((issue) => (
              <Card key={issue.id} elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 0.8, fontSize: '0.95rem' }}>Report #{issue.id}</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25, fontSize: '1.5rem' }}>{issue.title}</Typography>
                    </Box>
                    <Chip label={STATUS_LABELS[issue.status] ?? issue.status} color={statusColor(issue.status)} size="small" />
                  </Stack>
                  <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                    <Grid item xs={12}><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.92rem' }}>Location</Typography><Typography variant="body2" sx={{ fontWeight: 500, fontSize: '1.05rem' }}>{issue.location || 'N/A'}</Typography></Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.92rem' }}>Submitted By</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#1976d2', fontSize: '0.8rem' }}>{String(issue.userId)}</Avatar>
                        <Typography variant="body2" sx={{ fontSize: '1.05rem' }}>{getSubmittedByName(issue.userId)}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.92rem' }}>Date & Time</Typography><Typography variant="body2" sx={{ fontSize: '1.05rem' }}>{formatDateTime(issue.happenTime)}</Typography></Grid>
                  </Grid>
                  <Box sx={{ mt: 2, px: 1.5, py: 1.25, borderRadius: 2, bgcolor: 'rgba(25, 118, 210, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>{(issue.urls || []).length} attachment{(issue.urls || []).length !== 1 ? 's' : ''}</Typography>
                    <Chip label={(issue.urls || []).length > 0 ? 'Files attached' : 'No files'} size="small" color={(issue.urls || []).length > 0 ? 'primary' : 'default'} variant="outlined" />
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button variant="outlined" color="primary" startIcon={<VisibilityIcon />} onClick={() => handleViewReport(issue)} fullWidth sx={{ fontSize: '1rem', py: 1.1 }}>View</Button>
                    <Button variant="outlined" color="success" startIcon={<EditIcon />} onClick={() => handleUpdateStatusOpen(issue)} fullWidth sx={{ fontSize: '1rem', py: 1.1 }}>Status</Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead><TableRow sx={{ bgcolor: '#f5f5f5' }}><TableCell sx={{ fontWeight: 600 }}>ID</TableCell><TableCell sx={{ fontWeight: 600 }}>Title</TableCell><TableCell sx={{ fontWeight: 600 }}>Location</TableCell><TableCell sx={{ fontWeight: 600 }}>Submitted By</TableCell><TableCell sx={{ fontWeight: 600 }}>Status</TableCell><TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell><TableCell sx={{ fontWeight: 600 }}>Attachments</TableCell><TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell></TableRow></TableHead>
            <TableBody>
              {filteredIssues.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}><Typography variant="body1" color="text.secondary">No reports found</Typography></TableCell></TableRow>
              ) : (
                filteredIssues.map((issue) => (
                  <TableRow key={issue.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>#{issue.id}</Typography></TableCell>
                    <TableCell sx={{ maxWidth: 200 }}><Typography variant="body2" noWrap>{issue.title}</Typography></TableCell>
                    <TableCell sx={{ maxWidth: 150 }}><Typography variant="body2" noWrap>{issue.location}</Typography></TableCell>
                    <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: '0.875rem' }}>{String(issue.userId)}</Avatar><Typography variant="body2">{getSubmittedByName(issue.userId)}</Typography></Box></TableCell>
                    <TableCell><Chip label={STATUS_LABELS[issue.status] ?? issue.status} color={statusColor(issue.status)} size="small" /></TableCell>
                    <TableCell><Typography variant="body2">{formatDateTime(issue.happenTime)}</Typography></TableCell>
                    <TableCell><Chip label={`${(issue.urls || []).length} attachment${(issue.urls || []).length !== 1 ? 's' : ''}`} size="small" color={(issue.urls || []).length > 0 ? 'primary' : 'default'} variant="outlined" /></TableCell>
                    <TableCell align="center"><Tooltip title="View Details"><IconButton size="small" color="primary" onClick={() => handleViewReport(issue)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip><Tooltip title="Update Status"><IconButton size="small" color="success" onClick={() => handleUpdateStatusOpen(issue)}><EditIcon fontSize="small" /></IconButton></Tooltip></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Report Details</Typography>
          <IconButton onClick={() => setViewDialogOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedIssue && (
            <Grid container spacing={2}>
              <Grid item xs={12}><Typography variant="subtitle2" color="text.secondary">Report ID</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>#{selectedIssue.id}</Typography></Grid>
              <Grid item xs={12}><Typography variant="subtitle2" color="text.secondary">Title</Typography><Typography variant="h6">{selectedIssue.title}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2" color="text.secondary">Location</Typography><Typography variant="body1">{selectedIssue.location || 'N/A'}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2" color="text.secondary">Status</Typography><Chip label={STATUS_LABELS[selectedIssue.status] ?? selectedIssue.status} color={statusColor(selectedIssue.status)} size="small" /></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2" color="text.secondary">Submitted By</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}><Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>{String(selectedIssue.userId)}</Avatar><Typography variant="body1">{getSubmittedByName(selectedIssue.userId)}</Typography></Box></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2" color="text.secondary">Date & Time</Typography><Typography variant="body1">{formatDateTime(selectedIssue.happenTime)}</Typography></Grid>
              {selectedIssue.brief && <Grid item xs={12}><Typography variant="subtitle2" color="text.secondary">Brief</Typography><Typography variant="body1">{selectedIssue.brief}</Typography></Grid>}
              <Grid item xs={12}><Typography variant="subtitle2" color="text.secondary">Description</Typography><Paper sx={{ p: 2, mt: 1, bgcolor: '#f5f5f5' }}><Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedIssue.description || 'N/A'}</Typography></Paper></Grid>
              {selectedIssue.witnessInfo && <Grid item xs={12}><Typography variant="subtitle2" color="text.secondary">Witness Info</Typography><Typography variant="body1">{selectedIssue.witnessInfo}</Typography></Grid>}
              {(selectedIssue.urls || []).length > 0 && <Grid item xs={12}><Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Attachments ({selectedIssue.urls.length})</Typography><ImageList cols={isMobile ? 2 : 3} gap={8}>{selectedIssue.urls.map((url, idx) => <ImageListItem key={idx} sx={{ overflow: 'hidden', borderRadius: 2 }}>{isImageAttachment(url) ? <Box sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }} onClick={() => setPreviewImage(url)}><img src={url} alt={`Attachment ${idx + 1}`} loading="lazy" style={{ height: 150, width: '100%', objectFit: 'cover' }} /></Box> : <Box sx={{ height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1, px: 2, textAlign: 'center', bgcolor: '#f8fafc', border: '1px solid #e5e7eb' }}><InsertDriveFileIcon sx={{ fontSize: 36, color: '#475569' }} /><Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>{getAttachmentName(url)}</Typography><Button component="a" href={url} target="_blank" rel="noreferrer" size="small" endIcon={<OpenInNewIcon fontSize="small" />}>Open</Button></Box>}</ImageListItem>)}</ImageList></Grid>}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setViewDialogOpen(false); if (selectedIssue) handleUpdateStatusOpen(selectedIssue); }} variant="contained" color="primary">Update Status</Button>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>Update Report Status</DialogTitle>
        <DialogContent>
          {selectedIssue && (
            <Box sx={{ mt: 2 }}>
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" color="text.secondary">Report:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>#{selectedIssue.id} - {selectedIssue.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Submitted by: {getSubmittedByName(selectedIssue.userId)}</Typography>
              </Paper>
              <FormControl fullWidth>
                <InputLabel>New Status</InputLabel>
                <Select value={newStatus} label="New Status" onChange={(e) => setNewStatus(e.target.value as BackendStatus)}>
                  <MenuItem value="pending"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><HourglassEmptyIcon fontSize="small" />Pending</Box></MenuItem>
                  <MenuItem value="processing"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EditIcon fontSize="small" />In Progress</Box></MenuItem>
                  <MenuItem value="completed"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CheckCircleIcon fontSize="small" />Completed</Box></MenuItem>
                </Select>
              </FormControl>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2"><strong>Status Guide:</strong></Typography>
                <Typography variant="caption" component="div">- <strong>Pending:</strong> Report received, awaiting review<br />- <strong>In Progress:</strong> Currently being worked on<br />- <strong>Completed:</strong> Issue has been fixed/resolved</Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} disabled={statusSubmitting}>Cancel</Button>
          <Button onClick={confirmUpdateStatus} variant="contained" color="primary" disabled={statusSubmitting}>{statusSubmitting ? 'Updating...' : 'Update Status'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Attachment Preview</Typography>
          <IconButton onClick={() => setPreviewImage(null)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>{previewImage && <Box sx={{ display: 'flex', justifyContent: 'center' }}><img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} /></Box>}</DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManageIssues;
