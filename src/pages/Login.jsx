import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../context/AuthContext';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/chat', { replace: true });
    return null;
  }

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    // Check against registered users in localStorage
    const users = JSON.parse(localStorage.getItem('abdai_users') || '[]');
    const found = users.find(
      (u) => u.username === data.username && u.password === data.password
    );

    if (found) {
      login({ username: found.username, email: found.email });
      toast.success('Welcome back, ' + found.username + '!');
      navigate('/chat');
    } else {
      // Allow demo login with any credentials
      Swal.fire({
        title: 'User Not Found',
        text: 'No registered account found. Would you like to continue with a demo session?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Continue as Demo',
        cancelButtonText: 'Register Instead',
        confirmButtonColor: '#f59e0b',
        cancelButtonColor: '#6b7280',
        background: '#111120',
        color: '#e8e8f0',
        customClass: { popup: 'swal-custom' },
      }).then((result) => {
        if (result.isConfirmed) {
          login({ username: data.username, email: `${data.username}@demo.ai` });
          toast.success('Logged in as ' + data.username);
          navigate('/chat');
        } else {
          navigate('/register');
        }
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%), #08080f',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background blobs */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            width: { xs: 250, md: 400 },
            height: { xs: 250, md: 400 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.06), transparent 70%)',
            top: '10%',
            left: '5%',
            animation: 'floatBlob 12s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: { xs: 200, md: 350 },
            height: { xs: 200, md: 350 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.05), transparent 70%)',
            bottom: '10%',
            right: '5%',
            animation: 'floatBlob 15s ease-in-out infinite reverse',
          }}
        />
      </Box>

      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          background: 'rgba(17,17,32,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(245,158,11,0.05)',
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo / Brand */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 30px rgba(245,158,11,0.3)',
              }}
            >
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#000' }}>A</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Welcome to ABDAI
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sign in to continue your conversation
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              startIcon={<LoginIcon />}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}
              >
                Create one
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
