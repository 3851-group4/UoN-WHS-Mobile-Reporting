import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, ImageList, ImageListItem, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { getMockCurrentUser, getMockIssues, saveMockIssues, shouldUseMock } from './mock';
import { uploadIssueImages } from './issueImages';

const API_BASE = 'http://localhost:8000';
const ISSUE_TYPES = ['Safety Hazard', 'Security Concern', 'Health Issue', 'Equipment Damage', 'Harassment', 'Other'];

interface IssueVo { id: number; userId: number; title: string; brief: string; description: string; location: string; status: string; witnessInfo: string; happenTime: string; urls: string[]; }
interface EditForm { issueType: string; brief: string; location: string; dateTime: string; description: string; witnessInfo: string; }
interface PendingImage { file: File; preview: string; }

const statusLabel: Record<string, string> = { pending: 'Pending', processing: 'In Progress', completed: 'Completed' };
const statusColor = (status: string): 'warning' | 'info' | 'success' | 'default' => status === 'pending' ? 'warning' : status === 'processing' ? 'info' : status === 'completed' ? 'success' : 'default';
const formatDateTime = (dt: string | null) => !dt ? 'N/A' : `${new Date(dt).toLocaleDateString()} ${new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

const ViewIssues: React.FC = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 900;
  });
  const [issues, setIssues] = useState<IssueVo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueVo | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ issueType: '', brief: '', location: '', dateTime: '', description: '', witnessInfo: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editImageUrls, setEditImageUrls] = useState<string[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  const getToken = () => localStorage.getItem('token') || '';
  const clearPendingImages = () => { pendingImages.forEach((image) => URL.revokeObjectURL(image.preview)); setPendingImages([]); };

  const fetchIssues = async () => {
    setLoading(true);
    setError('');
    if (shouldUseMock()) {
      const currentUser = getMockCurrentUser();
      setIssues(getMockIssues().filter((issue) => issue.userId === currentUser.id));
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/issue/view`, { method: 'GET', headers: { token: getToken() } });
      const result = await res.json();
      if (result.code === 200) setIssues(result.data || []);
      else setError(result.msg || 'Failed to load issues.');
    } catch {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssues(); }, []);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleView = (issue: IssueVo) => { setSelectedIssue(issue); setViewDialogOpen(true); };
  const handleEditOpen = (issue: IssueVo) => {
    clearPendingImages();
    const typeMatch = issue.title.match(/^\[(.+?)\] /);
    setEditForm({ issueType: typeMatch ? typeMatch[1] : '', brief: issue.brief || '', location: issue.location || '', dateTime: issue.happenTime ? issue.happenTime.slice(0, 16) : '', description: issue.description || '', witnessInfo: issue.witnessInfo || '' });
    setEditImageUrls(issue.urls || []);
    setSelectedIssue(issue);
    setEditDialogOpen(true);
  };
  const handleEditClose = () => { clearPendingImages(); setEditImageUrls([]); setEditDialogOpen(false); };
  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setPendingImages((prev) => [...prev, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    e.target.value = '';
  };
  const handleRemoveExistingImage = (url: string) => setEditImageUrls((prev) => prev.filter((item) => item !== url));
  const handleRemovePendingImage = (index: number) => {
    setPendingImages((prev) => {
      const image = prev[index];
      if (image) URL.revokeObjectURL(image.preview);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleEditSave = async () => {
    if (!selectedIssue) return;
    setEditSubmitting(true);
    try {
      const title = editForm.issueType ? `[${editForm.issueType}] ${editForm.brief}` : editForm.brief;
      if (shouldUseMock()) {
        const finalUrls = [...editImageUrls, ...pendingImages.map((image) => image.preview)];
        saveMockIssues(getMockIssues().map((issue) => issue.id === selectedIssue.id ? { ...issue, title, brief: editForm.brief, description: editForm.description, location: editForm.location, witnessInfo: editForm.witnessInfo, happenTime: editForm.dateTime ? new Date(editForm.dateTime).toISOString().slice(0, 19) : issue.happenTime, urls: finalUrls } : issue));
        handleEditClose();
        setSuccessMessage('Mock report updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchIssues();
        return;
      }
      const uploadedUrls = await uploadIssueImages(pendingImages.map((image) => image.file), getToken());
      const body = { id: selectedIssue.id, title, brief: editForm.brief, description: editForm.description, location: editForm.location, witnessInfo: editForm.witnessInfo || null, happenTime: editForm.dateTime ? new Date(editForm.dateTime).toISOString().slice(0, 19) : null, urls: [...editImageUrls, ...uploadedUrls] };
      const res = await fetch(`${API_BASE}/api/issue/upsert`, { method: 'POST', headers: { token: getToken(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await res.json();
      if (result.code === 200) {
        handleEditClose();
        setSuccessMessage('Report updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchIssues();
      } else alert(result.msg || 'Failed to update report.');
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteOpen = (issue: IssueVo) => { setSelectedIssue(issue); setDeleteDialogOpen(true); };
  const handleDeleteConfirm = async () => {
    if (!selectedIssue) return;
    setDeleteSubmitting(true);
    try {
      if (shouldUseMock()) {
        saveMockIssues(getMockIssues().filter((issue) => issue.id !== selectedIssue.id));
        setDeleteDialogOpen(false);
        setSuccessMessage('Mock report deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchIssues();
        return;
      }
      const res = await fetch(`${API_BASE}/api/issue/delete/${selectedIssue.id}`, { method: 'DELETE', headers: { token: getToken() } });
      const result = await res.json();
      if (result.code === 200) {
        setDeleteDialogOpen(false);
        setSuccessMessage('Report deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchIssues();
      } else alert(result.msg || 'Failed to delete report.');
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1, fontSize: { xs: '2.2rem', md: '3rem' } }}>My Reports</Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.78)', maxWidth: 520, fontSize: { xs: '1rem', md: '1.05rem' } }}>View and manage your submitted safety reports</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

      {isMobile ? (
        issues.length === 0 ? (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="body1" color="text.secondary" align="center">No reports found. Submit your first report!</Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {issues.map((issue) => (
              <Card key={issue.id} elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 2.25 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 0.8 }}>Report #{issue.id}</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25 }}>{issue.title}</Typography>
                    </Box>
                    <Chip label={statusLabel[issue.status] ?? issue.status} color={statusColor(issue.status)} size="small" />
                  </Stack>

                  <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Location</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{issue.location || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                      <Typography variant="body2">{formatDateTime(issue.happenTime)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Brief</Typography>
                      <Typography variant="body2">{issue.brief || 'N/A'}</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2, px: 1.5, py: 1.25, borderRadius: 2, bgcolor: 'rgba(25, 118, 210, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{(issue.urls || []).length} photo{(issue.urls || []).length !== 1 ? 's' : ''}</Typography>
                    <Chip label={(issue.urls || []).length > 0 ? 'Images attached' : 'No images'} size="small" color={(issue.urls || []).length > 0 ? 'primary' : 'default'} variant="outlined" />
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button variant="outlined" color="primary" startIcon={<VisibilityIcon />} onClick={() => handleView(issue)} fullWidth>View</Button>
                    <Button variant="outlined" color="info" startIcon={<EditIcon />} onClick={() => handleEditOpen(issue)} disabled={issue.status !== 'pending'} fullWidth>Edit</Button>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteOpen(issue)} disabled={issue.status !== 'pending'} fullWidth>Delete</Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Images</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">No reports found. Submit your first report!</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                issues.map((issue) => (
                  <TableRow key={issue.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell>#{issue.id}</TableCell>
                    <TableCell sx={{ maxWidth: 220 }}><Typography variant="body2" noWrap>{issue.title}</Typography></TableCell>
                    <TableCell sx={{ maxWidth: 160 }}><Typography variant="body2" noWrap>{issue.location}</Typography></TableCell>
                    <TableCell><Chip label={statusLabel[issue.status] ?? issue.status} color={statusColor(issue.status)} size="small" /></TableCell>
                    <TableCell><Typography variant="body2">{formatDateTime(issue.happenTime)}</Typography></TableCell>
                    <TableCell><Chip label={`${(issue.urls || []).length} photo${(issue.urls || []).length !== 1 ? 's' : ''}`} size="small" color={(issue.urls || []).length > 0 ? 'primary' : 'default'} variant="outlined" /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details"><IconButton size="small" color="primary" onClick={() => handleView(issue)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title={issue.status !== 'pending' ? 'Only pending reports can be edited' : 'Edit Report'}><span><IconButton size="small" color="info" onClick={() => handleEditOpen(issue)} disabled={issue.status !== 'pending'}><EditIcon fontSize="small" /></IconButton></span></Tooltip>
                      <Tooltip title={issue.status !== 'pending' ? 'Only pending reports can be deleted' : 'Delete Report'}><span><IconButton size="small" color="error" onClick={() => handleDeleteOpen(issue)} disabled={issue.status !== 'pending'}><DeleteIcon fontSize="small" /></IconButton></span></Tooltip>
                    </TableCell>
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
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Report ID</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>#{selectedIssue.id}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                <Typography variant="body1">{selectedIssue.title}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                <Typography variant="body1">{selectedIssue.location || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip label={statusLabel[selectedIssue.status] ?? selectedIssue.status} color={statusColor(selectedIssue.status)} size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Date & Time</Typography>
                <Typography variant="body1">{formatDateTime(selectedIssue.happenTime)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Brief</Typography>
                <Typography variant="body1">{selectedIssue.brief || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedIssue.description || 'N/A'}</Typography>
              </Grid>
              {selectedIssue.witnessInfo && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Witness Info</Typography>
                  <Typography variant="body1">{selectedIssue.witnessInfo}</Typography>
                </Grid>
              )}
              {(selectedIssue.urls || []).length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Attached Images ({selectedIssue.urls.length})</Typography>
                  <ImageList cols={isMobile ? 2 : 3} gap={8}>
                    {selectedIssue.urls.map((url, idx) => (
                      <ImageListItem key={idx} sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }} onClick={() => setPreviewImage(url)}>
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
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Issue Type</InputLabel>
                <Select value={editForm.issueType} label="Issue Type" onChange={(e) => setEditForm((f) => ({ ...f, issueType: e.target.value }))}>
                  {ISSUE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Brief Summary" value={editForm.brief} onChange={(e) => setEditForm((f) => ({ ...f, brief: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Location" value={editForm.location} onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="datetime-local" label="Date & Time" value={editForm.dateTime} onChange={(e) => setEditForm((f) => ({ ...f, dateTime: e.target.value }))} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Description" value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Witness Information (Optional)" value={editForm.witnessInfo} onChange={(e) => setEditForm((f) => ({ ...f, witnessInfo: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateIcon />}>Add Images
                  <input hidden type="file" accept="image/*" multiple onChange={handleEditImageSelect} />
                </Button>
                <Typography variant="body2" color="text.secondary">Existing images will be kept unless you remove them below.</Typography>
              </Box>
            </Grid>
            {editImageUrls.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Images ({editImageUrls.length})</Typography>
                <ImageList cols={isMobile ? 2 : 3} gap={8}>
                  {editImageUrls.map((url) => (
                    <ImageListItem key={url} sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                      <img src={url} alt="Current issue" loading="lazy" style={{ height: 140, objectFit: 'cover' }} />
                      <IconButton size="small" onClick={() => handleRemoveExistingImage(url)} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>
            )}
            {pendingImages.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>New Images To Upload ({pendingImages.length})</Typography>
                <ImageList cols={isMobile ? 2 : 3} gap={8}>
                  {pendingImages.map((image, index) => (
                    <ImageListItem key={`${image.file.name}-${index}`} sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                      <img src={image.preview} alt={image.file.name} loading="lazy" style={{ height: 140, objectFit: 'cover' }} />
                      <IconButton size="small" onClick={() => handleRemovePendingImage(index)} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} disabled={editSubmitting}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" disabled={editSubmitting}>{editSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullScreen={isMobile}>
        <DialogTitle>Delete Report</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to permanently delete this report? This action cannot be undone.</Typography>
          {selectedIssue && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Report:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>#{selectedIssue.id} - {selectedIssue.title}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteSubmitting}>No, Keep It</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={deleteSubmitting}>{deleteSubmitting ? 'Deleting...' : 'Yes, Delete'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Image Preview</Typography>
          <IconButton onClick={() => setPreviewImage(null)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {previewImage && <Box sx={{ display: 'flex', justifyContent: 'center' }}><img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} /></Box>}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ViewIssues;
