import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Description,
  CheckCircle,
  Schedule,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.js';
import DocumentUpload from '../components/DocumentUpload.jsx';
import DocumentList from '../components/DocumentList.jsx';
const API_BASE_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const { user, token } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  });

  // 🔹 Fetch documents from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const docs = res.data.documents || [];

        const total = docs.length;
        const processing = docs.filter(d => d.ocrStatus === 'processing').length;
        const completed = docs.filter(d => d.ocrStatus === 'completed').length;
        const failed = docs.filter(d => d.ocrStatus === 'failed').length;

        setStats({ total, processing, completed, failed });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, [refreshTrigger, token]); // run again when upload success

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const cards = [
    { label: 'Total Documents', value: stats.total, icon: <Description />, color: 'primary' },
    { label: 'Processing', value: stats.processing, icon: <Schedule />, color: 'warning' },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle />, color: 'success' },
    { label: 'Failed', value: stats.failed, icon: <ErrorIcon />, color: 'error' },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Welcome back, {user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your documents and extract text using OCR technology.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: `${stat.color}.light`,
                    color: `${stat.color}.main`,
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upload Section */}
      <DocumentUpload onUploadSuccess={handleUploadSuccess} />

      {/* Documents List */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
          Your Documents
        </Typography>
        <DocumentList refreshTrigger={refreshTrigger} />
      </Box>
    </Box>
  );
};

export default Dashboard;
