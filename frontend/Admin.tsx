import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Button,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  // 测试模式开关
  const [testMode, setTestMode] = useState(true);
  const [mockRole, setMockRole] = useState<'admin' | 'user'>('admin');

  useEffect(() => {
    if (testMode) {
      // 测试模式：使用 Mock 数据  Mock
      checkAdminPermissionMock();
    } else {
      // 真实模式：调用后端 API    True
      checkAdminPermission();
    }
  }, [mockRole, testMode]);

  //  Mock 版本 - 用于测试 Use for test
  const checkAdminPermissionMock = async () => {
    setLoading(true);
    setError('');

    // 模拟网络延迟 Mock ping
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data
    const mockUsers = {
      admin: {
        username: 'admin_user',
        role: 'admin',
        email: 'admin@example.com'
      },
      user: {
        username: 'normal_user',
        role: 'user',
        email: 'user@example.com'
      }
    };

    const mockData = mockUsers[mockRole];

    // 模拟响应
    const result = {
      code: 200,
      data: mockData
    };

    if (result.code === 200 && result.data) {
      setUserInfo(result.data);
      
      if (result.data.role !== 'admin') {
        setError('Access Denied: You do not have admin privileges');
        setTimeout(() => {
          navigate('/welcome');
        }, 3000);
      } else {
        setLoading(false);
      }
    }
  };

  //  真实版本 - 调用后端 API  Real version to use API
  const checkAdminPermission = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/user/get/user', {
        method: 'GET',
        headers: {
          'token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const result = await response.json();
      
      if (result.code === 200 && result.data) {
        setUserInfo(result.data);
        
        if (result.data.role !== 'admin') {
          setError('Access Denied: You do not have admin privileges');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setLoading(false);
        }
      } else {
        throw new Error('Invalid response');
      }

    } catch (err: any) {
      console.error('Permission check failed:', err);
      setError('Failed to verify permissions. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  // Loading
  if (loading && !error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          color: '#fff'
        }}
      >
        <CircularProgress sx={{ color: '#fff', mb: 2 }} />
        <Typography variant="h6">Verifying admin permissions...</Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.6)' }}>
          {testMode ? '(Test Mode - Using Mock Data)' : '(Production Mode - Calling API)'}
        </Typography>
      </Box>
    );
  }

  // 错误状态
if (error) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#fff',
        p: 3
      }}
    >
      <Alert severity="error" sx={{ maxWidth: 500, mb: 2 }}>
        <Typography variant="h6">{error}</Typography>
      </Alert>
      
      {testMode && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5', border: '1px solid #e0e0e0' }}>
          <Typography variant="body2" sx={{ color: '#000', mb: 1 }}>
            🧪 Test Mode: Try switching role
          </Typography>
          <Button 
            variant="contained" 
            size="small"
            onClick={() => {
              setError('');  
              setMockRole('admin');  // switch
            }}
            sx={{
              bgcolor: '#4caf50',
              '&:hover': {
                bgcolor: '#45a049'
              }
            }}
          >
            Switch to Admin
          </Button>
        </Paper>
      )}
    </Box>
  );
}

  // Admin main page 页面主内容
  return (
      <Box sx={{ 
    p: 3, 
    color: '#000',  
    bgcolor: '#fff',  
    minHeight: '100vh'  
  }}>


      {/* 页面标题 title */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {/* 用户信息卡片 information */}
      <Paper sx={{ mb: 4, p: 3, bgcolor: 'rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          👤 Current User Information
        </Typography>
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Typography><strong>Username:</strong> {userInfo?.username}</Typography>
          <Typography><strong>Role:</strong> {userInfo?.role}</Typography>
          <Typography><strong>Email:</strong> {userInfo?.email || 'N/A'}</Typography>
        </Box>
      </Paper>

      {/* Admin function */}

    </Box>
  );
};

export default AdminPage;