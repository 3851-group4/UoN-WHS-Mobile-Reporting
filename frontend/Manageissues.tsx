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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';

// 报告接口定义 API 
interface Report {
  id: number;
  title: string;
  category: string;
  location: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  submittedDate: string;
  submittedTime: string;
  submittedBy: string;
  images: string[];
}

const ManageIssues: React.FC = () => {
  // Sample data
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
      status: 'Resolved',
      submittedDate: '2024-02-16',
      submittedTime: '09:15',
      submittedBy: 'Sarah Johnson',
      images: [
        'https://via.placeholder.com/300x200?text=Wet+Floor',
      ],
    },
    {
      id: 3,
      title: 'Faulty Elevator in Library',
      category: 'Equipment',
      location: 'Central Library, 2nd Floor',
      description: 'The elevator keeps getting stuck between floors. This has happened three times this week.',
      status: 'In Progress',
      submittedDate: '2024-02-14',
      submittedTime: '11:20',
      submittedBy: 'Mike Chen',
      images: [],
    },
    {
      id: 4,
      title: 'Broken Lock on Lab Door',
      category: 'Security',
      location: 'Science Building, Lab 205',
      description: 'The door lock is not working properly, making it easy for unauthorized access.',
      status: 'Resolved',
      submittedDate: '2024-02-10',
      submittedTime: '16:45',
      submittedBy: 'Emily Davis',
      images: [
        'https://via.placeholder.com/300x200?text=Broken+Lock',
      ],
    },
  ]);

  // 对话框状态
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<Report['status']>('Pending');
  const [successMessage, setSuccessMessage] = useState('');

  // 图片预览 preview image
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 过滤器 filter
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // 查看详情 view report
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  // 更新状态 uodate status
  const handleUpdateStatus = (report: Report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setStatusDialogOpen(true);
  };

  // 确认更新状态 confirm
  const confirmUpdateStatus = () => {
    if (selectedReport) {
      setReports(reports.map(r => 
        r.id === selectedReport.id ? { ...r, status: newStatus } : r
      ));
      
      setStatusDialogOpen(false);
      setSuccessMessage(`Report #${selectedReport.id} status updated to "${newStatus}"!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // 状态颜色映射 color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'In Progress': return 'primary';
      case 'Resolved': return 'success';
      default: return 'default';
    }
  };

  // 状态图标映射 status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <HourglassEmptyIcon fontSize="small" />;
      case 'Acknowledged': return <CheckCircleIcon fontSize="small" />;
      case 'In Progress': return <EditIcon fontSize="small" />;
      case 'Resolved': return <CheckCircleIcon fontSize="small" />;
      default: return null;
    }
  };

  // 过滤报告 filter of report
  const filteredReports = statusFilter === 'All' 
    ? reports 
    : reports.filter(r => r.status === statusFilter);

  // 统计数据 data
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'Pending').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#000', mb: 1 }}>
          Manage Issues
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)' }}>
          View all safety reports and update their status
        </Typography>
      </Box>

      {/* Successful message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* 统计卡片 Total cards*/}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2' }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Reports
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ed6c02' }}>
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8eaf6' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#3f51b5' }}>
              {stats.inProgress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#2e7d32' }}>
              {stats.resolved}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resolved
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 过滤器 */}
<Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
  <Select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    size="small"
    sx={{
      minWidth: 200,
      bgcolor: '#fff',
    }}
  >
    <MenuItem value="All">All Reports</MenuItem>
    <MenuItem value="Pending">Pending</MenuItem>
    <MenuItem value="In Progress">In Progress</MenuItem>
    <MenuItem value="Resolved">Resolved</MenuItem>
  </Select>
</Box>

      {/* 报告列表 */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Submitted By</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Images</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No reports found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow 
                  key={report.id}
                  sx={{ 
                    '&:hover': { bgcolor: '#f9f9f9' },
                    opacity: report.status === 'Resolved' ? 0.8 : 1,
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      #{report.id}
                    </Typography>
                  </TableCell>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: '0.875rem' }}>
                        {report.submittedBy.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{report.submittedBy}</Typography>
                    </Box>
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
                      color={report.images.length > 0 ? 'primary' : 'default'}
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
                    
                    <Tooltip title="Update Status">
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handleUpdateStatus(report)}
                      >
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

      {/* 查看详情对话框 View the details */}
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
                <Typography variant="h6">{selectedReport.title}</Typography>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                    {selectedReport.submittedBy.charAt(0)}
                  </Avatar>
                  <Typography variant="body1">{selectedReport.submittedBy}</Typography>
                </Box>
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
                <Paper sx={{ p: 2, mt: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedReport.description}
                  </Typography>
                </Paper>
              </Grid>

              {/* 图片展示 display pictures */}
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
          <Button 
            onClick={() => {
              setViewDialogOpen(false);
              if (selectedReport) {
                handleUpdateStatus(selectedReport);
              }
            }}
            variant="contained"
            color="primary"
          >
            Update Status
          </Button>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* 更新状态对话框 Update status */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Report Status</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box sx={{ mt: 2 }}>
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" color="text.secondary">Report:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  #{selectedReport.id} - {selectedReport.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Submitted by: {selectedReport.submittedBy}
                </Typography>
              </Paper>

              <FormControl fullWidth>
                <InputLabel>New Status</InputLabel>
                <Select
                  value={newStatus}
                  label="New Status"
                  onChange={(e) => setNewStatus(e.target.value as Report['status'])}
                >
                  <MenuItem value="Pending">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HourglassEmptyIcon fontSize="small" />
                      Pending
                    </Box>
                  </MenuItem>

                  <MenuItem value="In Progress">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EditIcon fontSize="small" />
                      In Progress
                    </Box>
                  </MenuItem>
                  <MenuItem value="Resolved">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" />
                      Resolved
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Status Guide:</strong>
                </Typography>
                <Typography variant="caption" component="div">
                  • <strong>Pending:</strong> Report received, awaiting review<br/>
                  • <strong>In Progress:</strong> Currently being worked on<br/>
                  • <strong>Resolved:</strong> Issue has been fixed/completed
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmUpdateStatus} 
            variant="contained" 
            color="primary"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* 图片预览对话框 preview image  */}
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


export default ManageIssues;
