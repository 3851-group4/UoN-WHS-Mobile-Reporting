import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { DEFAULT_MOCK_ADMIN, DEFAULT_MOCK_USER, getMockIssues, shouldUseMock } from './mock';

const API_BASE = 'http://localhost:8000';

interface UserInfoDto {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface IssueVo {
  id: number;
  status: string;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<UserInfoDto[]>([]);
  const [issues, setIssues] = useState<IssueVo[]>([]);

  const getToken = () => localStorage.getItem('token') || '';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    const token = getToken();

    if (shouldUseMock()) {
      setUsers([
        DEFAULT_MOCK_ADMIN,
        DEFAULT_MOCK_USER,
        {
          id: 1002,
          email: 'taylor.student@uon.edu.au',
          name: 'Taylor Student',
          role: 'user',
        },
      ]);
      setIssues(getMockIssues());
      setLoading(false);
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const [usersRes, issuesRes] = await Promise.all([
        fetch(`${API_BASE}/api/user/admin/viewAll`, {
          headers: { 'token': token },
        }),
        fetch(`${API_BASE}/api/issue/admin/viewAll`, {
          headers: { 'token': token },
        }),
      ]);

      const usersResult = await usersRes.json();
      const issuesResult = await issuesRes.json();

      if (usersResult.code === 200) {
        setUsers(usersResult.data || []);
      } else {
        setError(usersResult.msg || 'Failed to load user data.');
        return;
      }

      if (issuesResult.code === 200) {
        setIssues(issuesResult.data || []);
      } else {
        setError(issuesResult.msg || 'Failed to load issue data.');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Loading admin dashboard...</Typography>
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

  const stats = {
    totalUsers: users.length,
    adminCount: users.filter((u) => u.role === 'admin').length,
    userCount: users.filter((u) => u.role !== 'admin').length,
    totalIssues: issues.length,
    pendingIssues: issues.filter((i) => i.status === 'pending').length,
    processingIssues: issues.filter((i) => i.status === 'processing').length,
    completedIssues: issues.filter((i) => i.status === 'completed').length,
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography
        variant="h4"
        sx={{ mb: 1, fontWeight: 700, color: '#fff', fontSize: { xs: '2.45rem', md: '3rem' } }}
      >
        Admin Dashboard
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 3, color: 'rgba(255,255,255,0.78)', maxWidth: 580, fontSize: { xs: '1.1rem', md: '1.05rem' } }}
      >
        Monitor platform activity, review team members, and keep an eye on reporting volume.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <PeopleIcon sx={{ fontSize: 36, color: '#1976d2', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', fontSize: { xs: '2.2rem', md: '2.125rem' } }}>
              {stats.totalUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '0.875rem' } }}>Total Users</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <ReportIcon sx={{ fontSize: 36, color: '#ed6c02', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02', fontSize: { xs: '2.2rem', md: '2.125rem' } }}>
              {stats.totalIssues}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '0.875rem' } }}>Total Issues</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', fontSize: { xs: '2.2rem', md: '2.125rem' } }}>
              {stats.pendingIssues}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '0.875rem' } }}>Pending Issues</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', fontSize: { xs: '2.2rem', md: '2.125rem' } }}>
              {stats.completedIssues}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '0.875rem' } }}>Completed Issues</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* User List */}
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: '1.4rem', md: '1.25rem' } }}>
          All Users ({stats.totalUsers})
        </Typography>
        {isMobile ? (
          users.length === 0 ? (
            <Box sx={{ py: 4 }}>
              <Typography variant="body2" color="text.secondary" align="center">No users found.</Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {users.map((user) => (
                <Card key={user.id} elevation={0} sx={{ borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #e5e7eb' }}>
                  <CardContent sx={{ p: 2.4 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 42, height: 42, bgcolor: user.role === 'admin' ? '#d32f2f' : '#1976d2' }}>
                        {user.role === 'admin'
                          ? <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />
                          : <PersonIcon sx={{ fontSize: 20 }} />}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                          User #{user.id}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '1.25rem' }}>
                          {user.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={user.role === 'admin' ? 'Admin' : 'User'}
                        color={user.role === 'admin' ? 'error' : 'primary'}
                        size="small"
                      />
                    </Stack>
                    <Box sx={{ mt: 1.5, px: 1.5, py: 1.25, borderRadius: 2, bgcolor: '#fff' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.92rem' }}>Email</Typography>
                      <Typography variant="body2" sx={{ wordBreak: 'break-word', fontSize: '1rem' }}>{user.email}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">No users found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                      <TableCell>#{user.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: user.role === 'admin' ? '#d32f2f' : '#1976d2', fontSize: '0.875rem' }}>
                            {user.role === 'admin'
                              ? <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />
                              : <PersonIcon sx={{ fontSize: 18 }} />}
                          </Avatar>
                          <Typography variant="body2">{user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role === 'admin' ? 'Admin' : 'User'}
                          color={user.role === 'admin' ? 'error' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default AdminPage;
